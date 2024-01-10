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
    }
}