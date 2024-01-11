const MTRUtil = {
    getTrainClient(id) {
        return MTRClientData.TRAINS.stream().filter(e => e.id == id).findFirst().orElse(null);
    },
    getSiding(id) {
        return MTRClientData.DATA_CACHE.sidingIdMap.get(id);
    },
    getPlatform(id) {
        return MTRClientData.DATA_CACHE.platformIdMap.get(id);
    },
    getDepot(id) {
        return MTRClientData.DATA_CACHE.depotIdMap.get(id);
    },
    getDepotFromSiding(id) {
        return MTRClientData.DATA_CACHE.sidingIdToDepot.get(id);
    },
    getRoute(id) {
        return MTRClientData.DATA_CACHE.routeIdMap.get(id);
    },
    getConnectingStation(stnId) {
        return MTRClientData.DATA_CACHE.stationIdToConnectingStations.get(stnId);
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
    }
}