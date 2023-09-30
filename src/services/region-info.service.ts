import { RegionInfo } from "../interfaces/region-info.interface";
import { log } from "../utils/log";

export const updateRegionInfo = (regionInfoList: RegionInfo[], regionInfoToUpdate: RegionInfo, newStart, newEnd, setRegionInfo: any) => {

    if (regionInfoToUpdate) {
        log('Vai atualizar', regionInfoToUpdate);
        const updatedRegion = {
            ...regionInfoToUpdate, // Copie todas as propriedades existentes
            start: newStart,
            end: newEnd,
            duration: newEnd - newStart,
        };

        // Crie uma nova cópia do array com a região atualizada
        const updatedRegionsArray = regionInfoList.map(regionData => {
            if (regionData.id === regionInfoToUpdate.id) {
                return updatedRegion;
            }
            return regionData;
        });

        // Atualize o state regionInfo com a nova cópia do array
        log('atualizou', updatedRegion);
        setRegionInfo(updatedRegionsArray);
    }
}

export const deleteRegionInfo = (regionInfoList: RegionInfo[], regionInfoToDelete: RegionInfo, setRegionInfo: any) => {

    if (regionInfoToDelete) {             
        const updatedRegionsArray = regionInfoList.filter(regionData => regionData.id !== regionInfoToDelete.id);
        log('novo array', updatedRegionsArray);
        setRegionInfo(updatedRegionsArray);
    }
};

export const findGaps = (regions, totalTime) => {
    const gaps = [];
    let timeLineStart = 0;
  
    for (const regiao of regions) {
      if (regiao.start > timeLineStart) {
        // Encontrou um espaço vazio entre o final do espaço anterior e o início da região atual
        gaps.push({ start: timeLineStart, end: regiao.start });
      }  
      // Atualize o início do próximo possível espaço vazio
      timeLineStart = regiao.end;
    }
  
    // Verifique se há um espaço vazio após a última região
    if (timeLineStart < totalTime) {
      gaps.push({ start: timeLineStart, end: totalTime });
    }
  
    return gaps;
  }