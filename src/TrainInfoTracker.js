function TrainInfoTracker(updateFreq, train) {
    this.ratelimit = new RateLimit(updateFreq);
    this.tick(train);
}

TrainInfoTracker.prototype.tick = function(train) {
    if(this.ratelimit.shouldUpdate()) {
        this._allPlatforms = train.getAllPlatforms();
        this._routePlatforms = train.getThisRoutePlatforms();
        this._allNextPlatform = train.getAllPlatformsNextIndex();
        this._routeNextPlatform = train.getThisRoutePlatformsNextIndex();
        this._railProgress = train.railProgress();
        this._speed = train.speed();
        this._doorValue = train.doorValue();
        this._doorOpening = train.isDoorOpening();
        this._isOnRoute = train.isOnRoute();
    }
}

TrainInfoTracker.prototype.nextStation = function(allRoute) {
    let nextPlatform = this.nextPlatform(allRoute);
    return nextPlatform == null ? null : nextPlatform.station;
}

TrainInfoTracker.prototype.nextPlatform = function(allRoute, offset) {
    let nextIndex = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    if(offset != null) {
        nextIndex = Math.max(Math.min(list.size() - 1, nextIndex + offset), 0)
    }
    
    if(list.size() == 0 || nextIndex > list.size()-1) return null;
    return list.get(nextIndex);
}

TrainInfoTracker.prototype.destStation = function(allRoute) {
    let destPlatform = this.destPlatform(allRoute);
    return destPlatform == null ? null : destPlatform.station;
}

TrainInfoTracker.prototype.destPlatform = function(allRoute) {
    let nextIndex = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    
    if(list.size() == 0 || nextIndex > list.size()-1) return null;
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
    let lastPlatform = this.dockedAtPlatform() ? nextPlatform : this.nextPlatform(true, -1);
    
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
    let nextIndex = allRoute ? this._allNextPlatform : this._routeNextPlatform;
    let list = allRoute ? this._allPlatforms : this._routePlatforms;
    
    if(this.dockedAtPlatform() && nextIndex == list.size()-1) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.outOfPassengerService = function() {
    if(!this._isOnRoute || this._routeNextPlatform == this._routePlatforms.size()) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.returningToDepot = function() {
    if(this._allNextPlatform == this._allPlatforms.size()) {
        return true;
    } else {
        return false;
    }
}

TrainInfoTracker.prototype.doorAnyOpened = function() {
    return this._doorValue > 0;
}

TrainInfoTracker.prototype.doorFullyOpened = function() {
    return this._doorValue == 1;
}

TrainInfoTracker.prototype.speedKmh = function() {
    return this._speed * 20 * 3.6;
}

TrainInfoTracker.prototype.speedMph = function() {
    return this.speedKmh() / 1.609;
}

TrainInfoTracker.prototype.speedKnot = function() {
    return this.speedKmh() / 1.852;
}