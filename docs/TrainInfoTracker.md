# TrainInfoTracker
Keeps track of train information, and allows you to more easily obtain specific train information (Such as next station, destination station, whether the train is returning to depot or docked on a platform, etc.)

## Functions

### \<init\>(rateLimitSec: number, train: Train)
This is the constructor, and the object should be stored in your `state` in the `createTrain` function.

- rateLimitSec: How frequent TrainInfoTracker update it's train information
- train: The train parameter from `createTrain`

### tick(train: Train)
This updates the train data returned by TrainInfoTracker.  
The `train` parameter is a provided parameter from `renderTrain`.

### nextStation(): Station
Return this train's next station, returns a [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java). (stn.name to obtain the station number)

### nextPlatform(): PlatformInfo
Return this train's next platform info. (platInfo.plat.name to obtain the platform number)

### destStation(): Station
Return this train's destination station, returns a [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java). (stn.name to obtain the station number)

### destPlatform(): PlatformInfo
Return this train's destination platform info. (platInfo.plat.name to obtain the platform number)

### dockedAtPlatform(): boolean
Return whether the train is exactly stopped on a platform. (Note: This does not mean the door is opened)

### currentRoute(nullWhenTransitioning: boolean): Route
Return the current route the train is running, returns a [MTR Route](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Route.java). (route.name to obtain the station name)

If `nullWhenTransitioning` is true, this will return `null` when the train is not in service between route transition.

### terminating(allRoute: boolean): boolean
Return whether the train is stopped on a platform & it is the terminus.  
If `allRoute` is true, the terminus is considered to be the very last platform across all routes before the train returns to depot.  
Otherwise, the terminus is considered to be the last platform of the current running route.

### outOfPassengerService(): boolean
Whether the train is not supposed to be carrying passengers. This is true if the train is parked inside a depot, or has finished running the current route. (Might be en route to the next route)

### returningToDepot(): boolean
Whether the train has finished running all it's route and are now returning to the depot.

### doorAnyOpened(): boolean
Whether either side of the train door have been opened by any means, even if not fully opened.

### doorFullyOpened(): boolean
Whether either side of the train door is fully opened.

### speedKmh(): Number
Returns the train's speed in km/h

### speedMph(): Number
Returns the train's speed in mph

### speedKnot(): Number
Returns the train's speed in Knot

## Example
```
    // Include TrainInfoTracker, make sure to replace the path with where you put your NTEUtil scripts!
    include(Resources.id("mtr:custom_directory/nteutil/TrainInfoTracker.js"));
    
    function createTrain(ctx, state, train) {
        // Create a new TrainInfoTracker with update frequency of 1 second, this works per train
        state.trainInfoTracker = new TrainInfoTracker(1, train);
    }
    
    function renderTrain(ctx, state, train) {
        // Update our timer
        state.trainInfoTracker.tick();
        
        if(state.trainInfoTracker.doorAnyOpened()) {
            print("Train door is now open!");
        }
        
        if(state.trainInfoTracker.terminating()) {
            print("Train is now terminating, please leave!");
        }
    }
```