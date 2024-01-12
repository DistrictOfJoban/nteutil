include(Resources.idr("MTRUtil.js"));

function TrainHelper(dummy, train) {
    if(train == null) {
        train = dummy
    } else {
        train = train;
    }
    if(train == null) throw new Error("A train is required!")
    this.ratelimit = new RateLimit(0.3);
    this.tick(train);
}

TrainHelper.prototype.tick = function(train) {
    if(this.ratelimit.shouldUpdate()) {
        this.train = train;
        this._trainClient = MTRClientData.TRAINS.stream().filter(e => e.id == train.id()).findFirst().orElse(null);
    }
}

TrainHelper.prototype.trainClient = function() {
    return this._trainClient;
}

TrainHelper.prototype.getNextIndex = function(allRoute) {
    return allRoute ? this.train.getAllPlatformsNextIndex() : this.train.getThisRoutePlatformsNextIndex();
}

TrainHelper.prototype.getPlatformList = function(allRoute) {
    return allRoute ? this.train.getAllPlatforms() : this.train.getThisRoutePlatforms();
}

TrainHelper.prototype.absoluteStation = function(index, allRoute) {
    let platform = this.absolutePlatform(index, allRoute);
    return platform == null ? null : platform.station;
}

TrainHelper.prototype.absolutePlatform = function(index, allRoute) {
    let list = this.getPlatformList(allRoute);
    if(index >= list.size()) return null;

    return list.get(index);
}

TrainHelper.prototype.relativeStation = function(offset, allRoute) {
    let platform = this.relativePlatform(offset, allRoute);
    return platform == null ? null : platform.station;
}

TrainHelper.prototype.relativePlatform = function(offset, allRoute) {
    let index = this.getNextIndex(allRoute);
    let list = this.getPlatformList(allRoute);
    
    if(index + offset >= list.size()) return null;
    
    if(list.size() == 0 || index + offset < 0 || index + offset >= list.size()) return null;
    return list.get(index + offset);
}

TrainHelper.prototype.nextStation = function(allRoute) {
    return this.relativeStation(0, allRoute);
}

TrainHelper.prototype.nextPlatform = function(allRoute) {
    return this.relativePlatform(0, allRoute)
}

TrainHelper.prototype.lastStation = function(allRoute) {
    let lastPlatform = this.lastPlatform(allRoute);
    return lastPlatform == null ? null : lastPlatform.station;
}

TrainHelper.prototype.lastPlatform = function(allRoute) {
    let index = this.getNextIndex(allRoute);
    let list = this.getPlatformList(allRoute);
    
    if(list.size() == 0 || index >= list.size()) return null;
    return list.get(list.size() - 1);
}

TrainHelper.prototype.destName = function() {
    let nextPlatform = this.nextPlatform(true);
    
    if(nextPlatform != null) {
        return nextPlatform.destinationName;
    } else {
        return this.destPlatform(false);
    }
}

TrainHelper.prototype.remainingDwell = function() {
    let nextPlatform = this.nextPlatform(true);
    if(!this.dockedAtPlatform() || nextPlatform == null) return NaN;

    let fullDwell = this._trainClient.getTotalDwellTicks();
    let elapsedDwell = this._trainClient.getElapsedDwellTicks();
    
    return (fullDwell - elapsedDwell) / 20;
}


TrainHelper.prototype.dockedAtPlatform = function() {
    let nextPlatform = this.nextPlatform(true);
    if(nextPlatform == null) return false;
    
    if(this.train.railProgress() == nextPlatform.distance) {
        return true;
    } else {
        return false;
    }
}

TrainHelper.prototype.currentRoute = function(nullWhenTransitioning) {
    let nextPlatform = this.nextPlatform(true);
    let lastPlatform = this.dockedAtPlatform() ? nextPlatform : this.relativePlatform(-1, true);
    
    if(nullWhenTransitioning && nextPlatform != null && lastPlatform != null && nextPlatform.route.id != lastPlatform.route.id) {
        return null;
    }
    
    if(nextPlatform != null && lastPlatform != null) {
        return nextPlatform.route;
    }
    
    if(lastPlatform != null) {
        return lastPlatform.route;
    }
    if(nextPlatform != null) {
        return nextPlatform.route;
    }
    return null;
}

TrainHelper.prototype.terminating = function(allRoute) {
    let index = this.getNextIndex(allRoute);
    let list = this.getPlatformList(allRoute);
    
    if(this.dockedAtPlatform() && index == list.size()-1) {
        return true;
    } else {
        return false;
    }
}

TrainHelper.prototype.outOfPassengerService = function() {
    if(!this.train.isOnRoute()) return true;
    if(this.returningToDepot()) return true;
    
    let thisRouteList = this.getPlatformList(false);
    if(thisRouteList == thisRouteList.size()) return true; // End of service
    
    let firstPlat = this.absolutePlatform(0, true)
    if(firstPlat == null || this.train.railProgress() < firstPlat.distance) return true; // Before first station

    return false;
}

TrainHelper.prototype.returningToDepot = function() {
    if(this.getNextIndex(true) == this.getPlatformList(true).size()) {
        return true;
    } else {
        return false;
    }
}

TrainHelper.prototype.doorOpeningOrOpened = function() {
    return this.train.doorValue() > 0;
}

TrainHelper.prototype.doorFullyOpened = function() {
    return this.train.doorValue() == 1;
}

TrainHelper.prototype.doorOpening = function() {
    return this.train.isDoorOpening();
}

TrainHelper.prototype.doorClosing = function() {
    return this.train.doorValue() > 0 && this.train.doorValue() < 1 && !this.doorOpening();
}

TrainHelper.prototype.speedKmh = function() {
    return this.train.speed() * 20 * 3.6;
}

TrainHelper.prototype.speedMph = function() {
    return this.speedKmh() / 1.609;
}

TrainHelper.prototype.speedKnot = function() {
    return this.speedKmh() / 1.852;
}