# ElapsedDeltaTimer
Keeps track of the elapsed time, the delta time (The time since last call), and provide a way to reset the elapsed time tracked by this class.

## Functions

### tick()
This increments the timer's elapsed time, and updates the delta time.  
This should be called every frame (In `renderTrain`) for a consistent result.

### delta(): Number
Returns the time **in seconds** between the last time tick() is called and now.  
You can multiply this value with your animation moving speed to achieve fps-independent animation.

### elapsed(): Number
Return the elapsed time **in seconds** up until this point.
This value may be reset by calling `resetElapsed()`

### resetElapsed()
This resets the elapsed time back to 0.

## Example
```
    // Include ElapsedDeltaTimer, make sure to replace the path with where you put your NTEUtil scripts!
    include(Resources.id("mtr:custom_directory/nteutil/ElapsedDeltaTimer.js"));
    
    function createTrain(ctx, state, train) {
        // Create a new ElapsedDeltaTimer, this works per train
        state.timeTracker = new ElapsedDeltaTimer();
    }
    
    function renderTrain(ctx, state, train) {
        // Update our timer
        state.timeTracker.tick();
        
        if(Math.random() > 0.98) {
            print("Too lucky :P");
            print(`We have lasted ${state.timeTracker.elapsed()}s before another reset!`);
            state.timeTracker.resetElapsed();
        }
    }
```