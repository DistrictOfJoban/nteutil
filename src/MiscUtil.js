const MiscUtil = {
    stationNameOrPlatform(platInfo) {
        if(platInfo == null) {
            return "";
        }
        
        if(platInfo.station == null) {
            return `${platInfo.platform.name}號月台|Platform ${platInfo.platform.name}`
        } else {
            return platInfo.station.name;
        }
    }
}