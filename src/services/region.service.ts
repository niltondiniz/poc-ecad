export const getRegionById = (regionList, id) => regionList.find(region => region.id === id);
export const setStartEndRegion = (region, startRegion, endRegion) => {
    if (region) {
        region.setOptions({
            start: startRegion,
            end: endRegion
        });
    }
    return { startRegion, endRegion };
}

export const deleteRegion = (region) => {
    if (region) {
        region.un('update-end');
        region.un('over');
        region.un('leave');
        region.remove();
    }    
}