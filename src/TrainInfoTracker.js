function TrainInfoTracker(updateFreq, train) {
    this.ratelimit = new RateLimit(updateFreq);
    this.tick(train);
}

TrainInfoTracker.prototype.tick = function(train) {
    if(this.ratelimit.shouldUpdate()) {
        this._train = train;
        this._allPlatforms = train.getAllPlatforms();
        this._routePlatforms = train.getThisRoutePlatforms();
        this._allNextPlatform = train.getAllPlatformsNextIndex();
        this._routeNextPlatform = train.getThisRoutePlatformsNextIndex();
        this._railProgress = train.railProgress();
    }
}

TrainInfoTracker.prototype.absoluteStation = function(index, allRoute) {
    let platform = this.absolutePlatform(index, allRoute);
    return platform == null ? null : platform.station;
}

TrainInfoTracker.prototype.absolutePlatform = function(index, allRoute) {
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    if(index >= list.size()) return null;

    return list.get(index);
}

TrainInfoTracker.prototype.relativeStation = function(offset, allRoute) {
    let platform = this.relativePlatform(offset, allRoute);
    return platform == null ? null : platform.station;
}

TrainInfoTracker.prototype.relativePlatform = function(offset, allRoute) {
    let index = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    
    if(index + offset >= list.size()) return null;
    
    if(list.size() == 0 || index >= list.size()) return null;
    return list.get(index);
}

TrainInfoTracker.prototype.nextStation = function(allRoute) {
    return this.relativeStation(0, allRoute);
}

TrainInfoTracker.prototype.nextPlatform = function(allRoute) {
    return this.relativePlatform(0, allRoute)
}

TrainInfoTracker.prototype.destStation = function(allRoute) {
    let destPlatform = this.destPlatform(allRoute);
    return destPlatform == null ? null : destPlatform.station;
}

TrainInfoTracker.prototype.destPlatform = function(allRoute) {
    let index = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    
    if(list.size() == 0 || index >= list.size()) return null;
    return list.get(list.size() - 1);
}


TrainInfoTracker.prototype.dockedAtPlatform = function() {
    let nextPlatform = this.nextPlatform(true);
    if(nextPlatform == null) return false;
    
    if(this._railProgress == nextPlatform.distance) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.currentRoute = function(nullWhenTransitioning) {
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

TrainInfoTracker.prototype.terminating = function(allRoute) {
    let index = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    
    if(this.dockedAtPlatform() && index == list.size()-1) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.outOfPassengerService = function() {
    if(!this._train.isOnRoute()) return true;
    if(this.returningToDepot()) return true;
    if(this._routeNextPlatform == this._routePlatforms.size()) return true; // End of service
    
    let firstPlat = this.absolutePlatform(0, true)
    if(firstPlat == null || this._railProgress < firstPlat.distance) return true; // Before first station

    return false;
}

TrainInfoTracker.prototype.returningToDepot = function() {
    if(this._allNextPlatform == this._allPlatforms.size()) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.doorOpeningOrOpened = function() {
    return this._train.doorValue() > 0;
}

TrainInfoTracker.prototype.doorFullyOpened = function() {
    return this._train.doorValue() == 1;
}

TrainInfoTracker.prototype.doorOpening = function() {
    return this._train.isDoorOpening();
}

TrainInfoTracker.prototype.doorClosing = function() {
    return this._train.doorValue() > 0 && this._train.doorValue() < 1 && !this.doorOpening();
}

TrainInfoTracker.prototype.speedKmh = function() {
    return this._train.speed() * 20 * 3.6;
}

TrainInfoTracker.prototype.speedMph = function() {
    return this.speedKmh() / 1.609;
}

TrainInfoTracker.prototype.speedKnot = function() {
    return this.speedKmh() / 1.852;
}