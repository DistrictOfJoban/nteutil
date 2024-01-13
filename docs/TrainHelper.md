# TrainHelper
Keeps track of train information, and allows you to more easily obtain specific train information (Such as next station, destination station, whether the train is returning to depot or docked on a platform, etc.)

To access the underlying TrainWrapper provided by NTE, use the `.train` variable.

## Functions

### new TrainHelper(train: Train)
This is the constructor for this object. This should be stored in your `state` in the `createTrain` function.
**Parameters:**
- `train`: The `train` parameter from `createTrain(ctx, state, train)`

### tick(train: Train)
This updates the train data, you should call this in your `renderTrain` function.  
**Parameters:**
- `train`: The `train` parameter from `renderTrain(ctx, state, train)`

### nextStation(allRoute: boolean): Station
Return this train's next station, returns a [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java). (stn.name to obtain the station number)

**Parameters:**
- `allRoute`: Whether to also consider stations outside the current running route.

This is the same as `relativeStation(0, allRoute)`, which is described below.

### nextPlatform(allRoute: boolean): PlatformInfo
Return this train's next platform info. (platInfo.plat.name to obtain the platform number)

**Parameters:**
- `allRoute`: Whether to also consider platforms outside the current running route.

This is the same as `relativePlatform(0, allRoute)`, which is described below.

### relativeStation(offset: number, allRoute: boolean): Station
Return the platform at offset relative to the train's next station, or null if the specified platform is not in a station.

**Parameters:**
- `offset`: A number on how much to offset from the next station. (So `0` for the next station, `1` is the 2nd next station, and so on...)
- `allRoute`: Whether to also consider stations outside the current running route.

### relativePlatform(offset: number, allRoute: boolean): PlatformInfo
Return the platform at offset relative to the train's next platform.

**Parameters:**
- `offset`: A number on how much to offset from the next platform. (So `0` for the next station, `1` is the 2nd next station, and so on...)
- `allRoute`: Whether to also consider platforms outside the current running route.

### absoluteStation(index: Number, allRoute: boolean): Station
Returns the station at the specified index, calculated from the start of the current route (Regardless of where the train is).  

**Parameters:**
- `index`: The number of station counted from the start.
- `allRoute`: If true, the "start" will be considered to be the first station on the first route the train runs.

### absolutePlatform(index: Number, allRoute: boolean): Station
Returns the platform at the specified index, calculated from the start of the current route (Regardless of where the train is).  

**Parameters:**
- `index`: The number of station counted from the start.
- `allRoute`: If true, the "start" will be considered to be the first station on the first route the train runs.

### lastStation(allRoute: boolean): [Station](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Station.java)
Return this train's last station, returns a **Station**, or null if the last platform is not in a station.

**Parameters:**
- `allRoute`: Whether to also consider stations outside the current running route.

### lastPlatform(allRoute: boolean): [PlatformInfo](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-train?id=platforminfo)
Return the **PlatformInfo** for the last platform of this train.
`allRoute` means whether to also consider stations not on the current route.

**Parameters:**
- `allRoute`: Whether to also consider platforms outside the current running route.

### nextPath(roundDown): [PathData](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-train?id=pathdata)
Returns this train's next/current path, this is equivalant to `relativePath(0)`.

**Parameters:**
- `roundDown` - Whether to obtain the section based on the train's head or the train's tail. By default this is `true` to match up with the behavior of the `nextStation()` function, which is that the current path is returned.

### relativePath(offset, roundDown): [PathData](https://www.zbx1425.cn/nautilus/mtr-nte/#/js-train?id=pathdata)
Returns the train's next/current path with an offset. null if the final index is out of bound.

**Parameters:**
- `roundDown` - If `true` (default), this will match up with the behavior of the `relativeStation()` function, which is that the current path is returned if the train stopped exactly on a path.
- `offset`: A number on how much to offset from the next path. (So `0` for the next path, `1` is the 2nd next path, and so on...)

### destination(): String
Returns this train's destination name.  
This could either be the train's last station name, or a name provided by custom destination.

### dockedAtPlatform(): boolean
Return whether the train is exactly stopped on a platform. (Note: This does not mean the door is opened)

### remainingDwell(): Number
This returns `NaN` (Can check with `isNaN()` function) if the train is not stopped at a platform.  
Otherwise, it will return the remaining dwell time in seconds.

### currentRoute(nullWhenTransitioning: boolean): [Route](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/87c987f660dac35832bb9373c7d7da8bd31e2abc/common/src/main/java/mtr/data/Route.java)
Return the current route the train is running, returns a **Route**.

**Parameters:**
- `nullWhenTransitioning`: If true, this will return `null` when the train is not in service between route transition.

### terminating(allRoute: boolean): boolean
Return whether the train is stopped on a platform & it is the terminus of the current route.

**Parameters:**
- `allRoute`: If true, the terminus would be considered to be the last platform across all routes (aka the platform before the train returns to depot).

### outOfPassengerService(): boolean
Whether the train is not supposed to be carrying passengers. This is true if the train is parked inside the depot, returning to the depot, has not reached the first platform yet, or has finished running the current route. (Might be en route to the next route)

### returningToDepot(): boolean
Whether the train has finished running all it's route and are now returning to the depot.

### doorOpeningOrOpened(): boolean
Whether either side of the train door have been opened by any means, even if not fully opened.

### doorFullyOpened(): boolean
Whether either side of the train door is fully opened.

### doorOpening(): boolean
Whether the door is opening (Will be `false` if door is fully opened, fully closed, or closing)

### doorClosing(): boolean
Whether the door is closing (Will be `false` if door is fully opened, fully closed, or opening)

### speedKmh(): Number
Returns the train's speed in km/h

### speedMph(): Number
Returns the train's speed in mph

### speedKnot(): Number
Returns the train's speed in Knot

### trainClient(): [TrainClient](https://github.com/Minecraft-Transit-Railway/Minecraft-Transit-Railway/blob/master/common/src/main/java/mtr/data/TrainClient.java)
This obtains the underlying MTR **TrainClient**, which may allow you to gather more data about trains that are not exposed otherwise, however should not be necessary under most normal circumstances.

## Example
```
    // Include TrainHelper, make sure to replace the path with where you put your NTEUtil scripts!
    include(Resources.id("mtr:custom_directory/nteutil/TrainHelper.js"));
    
    function createTrain(ctx, state, train) {
        // Create a new TrainHelper, this works per train
        state.trainHelper = new TrainHelper(train);
    }
    
    function renderTrain(ctx, state, train) {
        // Update our train data
        state.trainHelper.tick(train);
        
        if(state.trainHelper.doorOpeningOrOpened()) {
            print("Train door is now open!");
        }
        
        if(state.trainHelper.terminating()) {
            print("Train is now terminating, please leave!");
        }
    }
```