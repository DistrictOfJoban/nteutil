const FormatUtil = {
    stationNameOrPlatform(platInfo) {
        if(platInfo == null) {
            return "";
        }
        
        if(platInfo.station == null) {
            return `${platInfo.platform.name}號月台|Platform ${platInfo.platform.name}`
        } else {
            return platInfo.station.name;
        }
    },
    formatCountdown(arrivalMillis, mode) {
        let sec = getCountdownSec(arrivalMillis);
        if(mode === "S" || (mode === "A" && sec < 60)) {
            return `${Math.floor(sec)}秒|${Math.floor(sec)} sec`;
        }
        
        let min = sec / 60;
        if(mode === "M" || (mode === "A" && min < 60)) {
            return `${Math.floor(min)}分鐘|${Math.floor(min)} min`;
        }
        
        let hr = min / 60;
        if(mode === "H" || (mode === "A" && hr < 24)) {
            return `${Math.floor(hr)}小時|${Math.floor(hr)} hour`;
        }
        
        let d = hr / 24;
        if(mode === "D" || (mode === "A" && hr >= 24)) {
            return `${Math.floor(d)}日|${Math.floor(d)} day`;
        }
        return null;
    },
    getCountdownSec(arrivalMillis) {
        return (arrivalMillis - java.lang.System.currentTimeMillis()) / 1000;
    }
}