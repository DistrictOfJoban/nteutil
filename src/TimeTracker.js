function TimeTracker() {
    this._timingElapsed = Timing.elapsed();
    this._elapsed = 0;
    this._delta = 0;
}

TimeTracker.prototype.tick = function() {
    let newElapsed = Timing.elapsed();
    this._delta = newElapsed - this._timingElapsed;
    this._elapsed += this._delta;
    this._timingElapsed = newElapsed;
}

TimeTracker.prototype.delta = function() {
    return this._delta;
}

TimeTracker.prototype.elapsed = function() {
    return this._elapsed;
}

TimeTracker.prototype.resetElapsed = function() {
    this._elapsed = 0;
}