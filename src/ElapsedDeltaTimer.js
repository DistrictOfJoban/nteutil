function ElapsedDeltaTimer() {
    this._timingElapsed = Timing.elapsed();
    this._elapsed = 0;
    this._delta = 0;
}

ElapsedDeltaTimer.prototype.tick = function() {
    let newElapsed = Timing.elapsed();
    this._delta = newElapsed - this._timingElapsed;
    this._elapsed += this._delta;
    this._timingElapsed = newElapsed;
}

ElapsedDeltaTimer.prototype.delta = function() {
    return this._delta;
}

ElapsedDeltaTimer.prototype.elapsed = function() {
    return this._elapsed;
}

ElapsedDeltaTimer.prototype.resetElapsed = function() {
    this._elapsed = 0;
}