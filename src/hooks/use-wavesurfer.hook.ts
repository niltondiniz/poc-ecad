import { useRef } from 'react';
import { useCallback, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { WavesurferProps } from "../interfaces/wavesurferProps.interface";
import { log } from "../utils/log";
import { RegionInfo } from "../interfaces/region-info.interface";
import { getTwoRandomNumbers } from "../utils/helpers";
import { TooltipPropsInterface } from '../interfaces/tooltip-props.interface';
import { deleteRegionInfo, findGaps, updateRegionInfo } from '../services/region-info.service';
import { deleteRegion, getRegionById, setStartEndRegion } from '../services/region.service';

export const useWavesurfer = (
    containerRef,
    options: WavesurferProps,
    regionInfo: RegionInfo[],
    setRegionInfo: any,
    tooltipPosition: any,    
    setTooltipVisible: any,
    tooltipData: TooltipPropsInterface,
    setTooltipData: any,
) => {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [wsRegions, setWsRegions] = useState(null);
    const [minimapRegions, setMinimapWsRegions] = useState(null);
    const [minimap, setMinimap] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [zoom, setZoom] = useState(0);

    // Use useRef para armazenar a referência atualizada a regionInfo
    const regionInfoRef = useRef(regionInfo);

    useEffect(() => {
        // Atualize a referência com o valor atual de regionInfo
        regionInfoRef.current = regionInfo;
    }, [regionInfo]);

    const changeZoom = (zoom) => {
        setZoom(zoom);
    }

    const getValueFromProps = (propName, defaultValue) => {
        if (options[propName] !== undefined) {
            return options[propName];
        }
        return defaultValue;
    }

    const toNextRegion = () => {
        const currentCursorTime = wavesurfer.getCurrentTime();
        const regions = wsRegions.getRegions();
        let nextRegion = null;

        // Encontre a próxima região após o cursor atual
        for (const regionId in regions) {
            const region = regions[regionId];
            if (region.start > currentCursorTime) {
                if (!nextRegion || region.start < nextRegion.start) {
                    nextRegion = region;
                }
            }
        }

        // Verifique se há uma próxima região e posicione o cursor nela
        if (nextRegion) {
            wavesurfer.setTime(nextRegion.start);
        }
    }

    const toPreviousRegion = () => {
        const currentCursorTime = wavesurfer.getCurrentTime();
        const regions = wsRegions.getRegions();
        let previousRegion = null;

        // Encontre a próxima região após o cursor atual
        for (const regionId in regions) {
            const region = regions[regionId];
            if (region.start < currentCursorTime) {
                if (!previousRegion || region.start > previousRegion.start) {
                    previousRegion = region;
                }
            }
        }

        // Verifique se há uma próxima região e posicione o cursor nela
        if (previousRegion) {
            wavesurfer.setTime(previousRegion.start);
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const manageRegionOverlap = (region, regions) => {

        const minimapRegion = getRegionById(minimapRegions.getRegions(), `minimap-${region.id}`);        

        for (var i = 0; i < regions.length; i++) {
            if ((region.start >= regions[i].start && region.end <= regions[i].end && region.id !== regions[i].id) ||
                (region.start < regions[i].start && region.end > regions[i].end && region.id !== regions[i].id)) {
                deleteRegionInfo(regionInfoRef.current, getRegionById(regionInfoRef.current, region.id), setRegionInfo);
                deleteRegion(region);
                deleteRegion(minimapRegion);
                alert('A região está sobrepondo uma outra região, a região será removida');
                return getRegionById(regionInfoRef.current, region.id);

            }
            else if (region.start > regions[i].start && region.start < regions[i].end && region.end > regions[i].end) {
                setStartEndRegion(region, regions[i].end, region.end);
                setStartEndRegion(minimapRegion, regions[i].end, region.end);
                return null;
            }
            else if (region.end > regions[i].start && region.end < regions[i].end && region.start < regions[i].start) {
                setStartEndRegion(region, regions.start, regions[i].start);
                setStartEndRegion(minimapRegion, regions.start, regions[i].start);
                return null;
            }
        }
    }

    const registerUpdateRegionEvent = useCallback((region) => {
        region.on('update-end', () => {

            //Reflete a mudança na região do minimap
            const minimapRegion = getRegionById(minimapRegions.getRegions(), `minimap-${region.id}`);
            setStartEndRegion(minimapRegion, region.start, region.end);

            //Gerencia sobreposição de regiões
            const regionToDelete = manageRegionOverlap(region, wsRegions.getRegions());

            if (regionToDelete) {
                setTooltipData(null);
                setTooltipVisible(false);
                deleteRegionInfo(regionInfoRef.current, regionToDelete, setRegionInfo);
            } else {             
                const regionToUpdate = getRegionById(regionInfoRef.current, region.id);
                updateRegionInfo(regionInfoRef.current, regionToUpdate, region.start, region.end, setRegionInfo);
            }

            log(regionInfoRef.current);

            return () => {
                region.un('update-end');
            }
        });

    }, [minimapRegions, manageRegionOverlap, wsRegions, setTooltipData, setTooltipVisible, setRegionInfo]);

    const registerOnMouseOverEvent = useCallback((region, id) => {
        region.on('over', () => {
            const tooltipPropsData = {
                regionInfo: getRegionById(regionInfoRef.current, id),
                tooltipPosition: tooltipPosition,
                isVisible: true,
            };
            setTooltipData(tooltipPropsData);
            setTooltipVisible(true);
        });
        region.on('leave', () => {
            setTooltipData(null);
            setTooltipVisible(false);
        });

        return () => {
            region.un('over');
            region.un('leave');
        }
    }, [tooltipPosition, setTooltipData, setTooltipVisible, regionInfoRef]);

    const addRegion = (regionData: RegionInfo) => {
        //Adiciona a região no wavesurfer
        const newRegion = wsRegions.addRegion({
            id: regionData.id,
            start: wavesurfer.getCurrentTime(),
            end: wavesurfer.getCurrentTime() + 10000,
            color: `#${getTwoRandomNumbers()}${getTwoRandomNumbers()}${getTwoRandomNumbers()}B0`,
            drag: true,
            resize: true,
        });
        //Adiciona o minimap da região
        const newMinimapRegion = minimapRegions.addRegion({
            id: `minimap-${newRegion.id}`,
            start: newRegion.start,
            end: newRegion.end,
            color: newRegion.color,
            drag: newRegion.drag,
            resize: newRegion.resize,
        });
        //options.setRegionInfo([...regionInfo, regionData]);
        //Configura o estilo das regiões adicionadas
        setRegionBorderStyle(newRegion, wavesurfer);
        setRegionBorderStyle(newMinimapRegion, wavesurfer);
        //Registra o evento de over na região
        registerOnMouseOverEvent(newRegion, regionData.id);
        registerOnMouseOverEvent(newMinimapRegion, regionData.id);
        //Registra o evento de update-end na região
        registerUpdateRegionEvent(newRegion);
        //Registra evento para ajustar a região para o tamanho total do áudio no duplo clique
        setBorderToFullWidth(newRegion, newMinimapRegion, wavesurfer);
        

    }

    const findRegionGaps = (totalTime) => {                
        return findGaps(regionInfoRef.current, totalTime);
    }

    const setZoomOnGap = (gap) => {
        wavesurfer.setTime(gap.start);
        changeZoom(3);
    }

    useEffect(() => {
        if (!wavesurfer) return        
        wavesurfer.zoom(zoom);
    }, [zoom]);

    useEffect(() => {
        if (!options.loadByUrl && options.peaks.length === 1) {
            return;
        }

        if (!options || !containerRef.current) return

        const regions = RegionsPlugin.create();
        setWsRegions(regions);

        const minimapRegions = RegionsPlugin.create()
        setMinimapWsRegions(minimapRegions);

        const ws = WaveSurfer.create({
            height: options.wavesurferHeight,
            container: containerRef.current,
            fillParent: getValueFromProps('wavesurferFillParent', false),
            hideScrollbar: getValueFromProps('wavesurferHideScrollbar', false),
            waveColor: getValueFromProps('wavesurferWaveColor', '#ff4e00)'),
            progressColor: getValueFromProps('wavesurferProgressColor', 'rgb(100, 0, 100, 0.1)'),
            cursorColor: getValueFromProps('wavesurferCursorColor', '#ddd5e9'),
            cursorWidth: getValueFromProps('wavesurferCursorWidth', 2),
            autoScroll: getValueFromProps('wavesurferAutoScroll', true),
            autoCenter: getValueFromProps('wavesurferAutoCenter', true),
            mediaControls: getValueFromProps('wavesurferMediaControls', false),
            barWidth: getValueFromProps('wavesurferBarWidth', 2),

            plugins: [
                regions,
            ],
        });

        const minimapInstance = ws.registerPlugin(MinimapPlugin.create({
            height: getValueFromProps('minimapHeight', 40),
            waveColor: getValueFromProps('minimapWaveColor', '#ddd'),
            progressColor
                : getValueFromProps('minimapProgressColor', '#999'),
            plugins: [
                minimapRegions,
            ]
        }));
        
        setMinimap(minimapInstance);

        const timelineInstance = ws.registerPlugin(TimelinePlugin.create({
            height: getValueFromProps('timelineHeight', 30),
            secondaryLabelInterval: 600,
            primaryLabelInterval: getValueFromProps('timelinePrimaryLabelInterval', 10),
            style: {
                fontSize: getValueFromProps('timelineFontSize', '10px'),
                color: getValueFromProps('timelineFontColor', '#6A3274'),
            },
        }));
        setTimeline(timelineInstance);

        const shouldLoadPeaks = !options.loadByUrl && options.peaks;
        ws.load(options.url, shouldLoadPeaks);
        setWavesurfer(ws);

        return () => {
            ws.destroy()
        }
    }, [containerRef, options.peaks]);    

    return { wavesurfer, wsRegions, minimap, minimapRegions, timeline, changeZoom, toNextRegion, toPreviousRegion, addRegion, findRegionGaps, setZoomOnGap }
}

const setRegionFullWidth = (region, totalDuration) =>{
    setStartEndRegion(region, region.start, totalDuration);
};

function setRegionBorderStyle(newRegion: any, wavesurfer: WaveSurfer) {
    var elementoPai = newRegion.element;
    var elementoFilhoEsquerdo = elementoPai.querySelector('[data-resize="left"]');
    elementoFilhoEsquerdo.style.backgroundColor = newRegion.color.slice(0, -2);
    elementoFilhoEsquerdo.style.width = '5px';
    elementoFilhoEsquerdo.style.borderLeft = '0px solid red';

    var elementoFilhoDireito = elementoPai.querySelector('[data-resize="right"]');
    elementoFilhoDireito.style.backgroundColor = newRegion.color.slice(0, -2);
    elementoFilhoDireito.style.width = '5px';
    elementoFilhoDireito.style.borderRight = '0px solid red';

    elementoFilhoDireito.addEventListener('dblclick', () => {
        setRegionFullWidth(newRegion, wavesurfer.getDuration());
    });
}

function setBorderToFullWidth(newRegion: any, newMinimapRegion, wavesurfer: WaveSurfer) {
    var elementoPai = newRegion.element;    
    var elementoFilhoDireito = elementoPai.querySelector('[data-resize="right"]');    

    elementoFilhoDireito.addEventListener('dblclick', () => {
        setRegionFullWidth(newRegion, wavesurfer.getDuration());
        setRegionFullWidth(newMinimapRegion, wavesurfer.getDuration());
    });
}