const MTRUtil = {
    getTrainClient(id) {
        return MTRClientData.TRAINS.stream().filter(e => e.id == id).findFirst().orElse(null);
    },
    getSiding(id) {
        return MTRClientData.DATA_CACHE.sidingIdMap.get(new java.lang.Long(id));
    },
    getPlatform(id) {
        return MTRClientData.DATA_CACHE.platformIdMap.get(new java.lang.Long(id));
    },
    getDepot(id) {
        return MTRClientData.DATA_CACHE.depotIdMap.get(new java.lang.Long(id));
    },
    getDepotFromSiding(id) {
        return MTRClientData.DATA_CACHE.sidingIdToDepot.get(new java.lang.Long(id));
    },
    getRoute(id) {
        return MTRClientData.DATA_CACHE.routeIdMap.get(new java.lang.Long(id));
    },
    getConnectingStation(stnId) {
        return MTRClientData.DATA_CACHE.stationIdToConnectingStations.get(new java.lang.Long(stnId));
    },
    getClosePlatform(pos, radius, lower, upper) {
        if(radius == null) radius = 5;
        if(lower == null) lower = 0;
        if(upper == null) upper = 4;
        let platforms = MTRClientData.PLATFORMS;
        let dataCache = MTRClientData.DATA_CACHE;

        let platform = 0;
        for (let i = 1; i <= radius; i++) {
            let searchRadius = i;
            platform = platforms.stream().filter(platform => platform.isCloseToSavedRail(pos, searchRadius, lower, upper)).min(java.util.Comparator.comparingInt(platform => platform.getMidPos().distManhattan(pos))).orElse(null);
            if (platform != null) {
                break;
            }
        }
        return platform;
    },
    requestPlatformIdToRoutes(platformId) {
        let platList = MTRClientData.DATA_CACHE.requestPlatformIdToRoutes(platformId);
        let platArr = [];
        for(let i = 0; i < platList.size(); i++) {
            platArr.push(platList.get(i));
        }
        return platArr;
    },
    getRouteDestination(route, currentStationIndex) {
        return MTRClientData.DATA_CACHE.getFormattedRouteDestination(route, currentStationIndex, "")
    },
    getETAForPlatform(platformId) {
        let list = MTRClientData.SCHEDULES_FOR_PLATFORM.get(new java.lang.Long(platformId))
        let arr = [];
        if(list != null) {
            list.forEach(scheduleEntry => {
                arr.push(scheduleEntry);
            });
        }
        
        arr.sort((a, b) => a.arrivalMillis - b.arrivalMillis);
        return arr;
    }
}