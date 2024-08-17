# FormatUtil
Functions for text formatting.

## Functions
### stationNameOrPlatform(platInfo: PlatformInfo): String
This returns the station name, or the platform number represented as `X號月台|Platform X` (Where X is the platform number) if the associated platform does not have a station.

### formatCountdown(arrivalMillis, mode)
Obtain a MTR-formatted ETA text similar to those seen in PIDS.  
**Parameters:**
- `arrivalMillis` - Epoch time in millisecond where the countdown would reaches 0
- `mode` - `S` to obtain the string in Second, `M` for minute, `H` for hour, `D` for day, `A (Or unfilled)` for automatic time unit.