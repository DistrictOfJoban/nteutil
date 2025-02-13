if(Resources.getNTEVersionInt() < 502) {
    throw Error("This script requires NTE 0.5.2 or above to execute.");
}

const MTRUtil = {
    getId(map, id) {
        if(id instanceof java.lang.Long) {
            return map.get(id);
        } else {
            return map.get(new java.lang.Long(id));
        }
    },
    getSiding(id) {
        return this.getId(MTRClientData.DATA_CACHE.sidingIdMap, id);
    },
    getPlatform(id) {
        return this.getId(MTRClientData.DATA_CACHE.platformIdMap, id);
    },
    getRoute(id) {
        return this.getId(MTRClientData.DATA_CACHE.routeIdMap, id);
    },
    getDepot(id) {
        return this.getId(MTRClientData.DATA_CACHE.depotIdMap, id);
    },
    getDepotFromSiding(id) {
        return this.getId(MTRClientData.DATA_CACHE.sidingIdToDepot, id);
    },
    getRouteDestination(route, currentStationIndex) {
        return MTRClientData.DATA_CACHE.getFormattedRouteDestination(route, currentStationIndex, "");
    },
    getExitDestinations(station, exit) {
        let exits = [];
        if(station == null) return exits;
        
        let targetExit = station.exits.get(exit);
        if(targetExit != null) {
            for(let i = 0; i < targetExit.size(); i++) {
                exits.push(targetExit.get(i));
            }
        }
        return exits;
    },
    getRouteInfoForPlatform(platformId) {
        let platList = MTRClientData.DATA_CACHE.requestPlatformIdToRoutes(platformId);
        let platArr = [];
        for(let i = 0; i < platList.size(); i++) {
            platArr.push(platList.get(i));
        }
        return platArr;
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
    getClosePlatforms(pos, radius, lower, upper) {
        if(radius == null) radius = 5;
        if(lower == null) lower = 0;
        if(upper == null) upper = 4;
        let mtrPlatforms = MTRClientData.PLATFORMS;
        let dataCache = MTRClientData.DATA_CACHE;
        
        let platforms = [];
        for (let i = 1; i <= radius; i++) {
            let searchRadius = i;
            let platformList = mtrPlatforms.stream().filter(platform => platform.isCloseToSavedRail(pos, searchRadius, lower, upper));
            
            for(let j = 0; j < platformList.size(); j++) {
                platforms.push(platformList.get(j));
            }
        }
        return platforms;
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
    },
    getETAForClosePlatform(pos) {
        let closestPlatform = MTRUtil.getClosePlatform(pos);
        if(closestPlatform == null) return [];
        
        return this.getETAForPlatform(closestPlatform.id);
    },
    getHiddenRouteNames(filter) {
        const hiddenRoutes = [];
        for(let rt of MTRClientData.ROUTES) {
            let filtered = filter(rt);
            if(rt.routeType.toString() == "HIGH_SPEED" || rt.isHidden) {
                if(!hiddenRoutes.includes(filtered)) hiddenRoutes.push(filtered);
            }
        }
        
        // 2nd-pass
        for(let rt of MTRClientData.ROUTES) {
            if(hiddenRoutes.includes(filter(rt)) && (rt.routeType.toString() != "HIGH_SPEED" && !rt.isHidden)) {
                hiddenRoutes.splice(hiddenRoutes.indexOf(filter(rt)), 1);
            }
        }
        
        return hiddenRoutes;
    },
    getRouteInterchange(stationId, ownRoute, deduplicate, includeHidden) {
        let interchangeArr = [];
        let interchangeData = MTRClientData.DATA_CACHE.stationIdToRoutes.get(new java.lang.Long(stationId));
        
        let interchanged = [];
        
        if(interchangeData != null) {
            let hiddenRouteNames = this.getHiddenRouteNames(e => TextUtil.getNonExtraParts(e.name));
            
            interchangeData.forEach((routeColor, routeNameColor) => {
                let routeName = routeNameColor.name;
                let visibleRouteName = TextUtil.getNonExtraParts(ownRoute.name);
                // Check if is our route
                if(ownRoute != null) {
                    if(routeName == visibleRouteName) {
                        return;
                    }
                }
                
                // Check if route is hidden
                if(!includeHidden && hiddenRouteNames.includes(routeName)) {
                    return;
                }
                
                // Duplicated Route
                if(deduplicate && interchanged.includes(routeName)) {
                    return;
                }
                
                interchangeArr.push({
                    routeName: routeName,
                    routeColor: routeNameColor.color
                });
                interchanged.push(routeName);
            });
        }
        
        return interchangeArr;
    }
}