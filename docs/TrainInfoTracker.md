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

### nextStation(allRoute: boolean): Station
Return this train's next station, returns a [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java). (stn.name to obtain the station number)

This is the same as `relativeStation(0, allRoute)`, which is described below.

### nextPlatform(allRoute: boolean): PlatformInfo
Return this train's next platform info. (platInfo.plat.name to obtain the platform number)

This is the same as `relativePlatform(0, allRoute)`, which is described below.

### relativeStation(offset: number, allRoute: boolean): Station
Return the platform at offset relative to the train's next station. (So offset `0` is the next station, offset `1` is the 2nd next station, and so on...)  
`allRoute` means whether to also consider stations not on the current route.

### relativePlatform(offset: number, allRoute: boolean): PlatformInfo
Return the platform at offset relative to the train's next platform. (So offset `0` is the next station, offset `1` is the 2nd next station, and so on...)  
`allRoute` means whether to also consider stations not on the current route.

### absoluteStation(index: Number, allRoute: boolean): Station
Returns the station at the specified index, calculated from the start of the current route (Regardless of where the train is).  
If `allRoute` is true, this will be calculated from the very first route.

### absolutePlatform(index: Number, allRoute: boolean): Station
Returns the platform at the specified index, calculated from the start of the current route (Regardless of where the train is).  
If `allRoute` is true, this will be calculated from the very first route.

### destStation(allRoute: boolean): Station
Return this train's destination station, returns a [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java). (stn.name to obtain the station number)
`allRoute` means whether to also consider stations not on the current route.

### destPlatform(allRoute: boolean): PlatformInfo
Return this train's destination platform info. (platInfo.plat.name to obtain the platform number)
`allRoute` means whether to also consider stations not on the current route.

### destName(): String
Returns this train's destination name.  
This could either be the train's last station name, or a name provided by custom destination.

### dockedAtPlatform(): boolean
Return whether the train is exactly stopped on a platform. (Note: This does not mean the door is opened)

### remainingDwell(): Number
This returns `NaN` (Can check with `isNaN()` function) if the train is not stopped at a platform.  
Otherwise, it will return the remaining dwell time in seconds.

### currentRoute(nullWhenTransitioning: boolean): Route
Return the current route the train is running, returns a [MTR Route](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Route.java). (route.name to obtain the route's name)

If `nullWhenTransitioning` is true, this will return `null` when the train is not in service between route transition.

### terminating(allRoute: boolean): boolean
Return whether the train is stopped on a platform & it is the terminus.  
If `allRoute` is true, the terminus is considered to be the very last platform across all routes before the train returns to depot.  
Otherwise, the terminus is considered to be the last platform of the current running route.

### outOfPassengerService(): boolean
Whether the train is not supposed to be carrying passengers. This is true if the train is parked inside the depot, returning to the depot, has not reached the first platform yet, or has finished running the current route. (Might be en route to the next route)

### returningToDepot(): boolean
Whether the train has finished running all it's route and are now returning to the depot.

### doorOpeningOrOpened(): boolean
Whether either side of the train door have been opened by any means, even if not fully opened.

### doorFullyOpened(): boolean
Whether either side of the train door is fully opened.

### doorOpening(): boolean
Whether the door is opening (Will be `false` is door is fully opened, fully closed, or closing)

### doorClosing(): boolean
Whether the door is closing (Will be `false` is door is fully opened, fully closed, or opening)

### speedKmh(): Number
Returns the train's speed in km/h

### speedMph(): Number
Returns the train's speed in mph

### speedKnot(): Number
Returns the train's speed in Knot

### trainClient(): TrainClient
This obtains the underlying MTR [TrainClient](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/master/common/src/main/java/mtr/data/TrainClient.java).  

This may allow you to gather more data about trains that are not exposed otherwise, however should not be necessary under normal circumstances.

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
        
        if(state.trainInfoTracker.doorOpeningOrOpened()) {
            print("Train door is now open!");
        }
        
        if(state.trainInfoTracker.terminating()) {
            print("Train is now terminating, please leave!");
        }
    }
```