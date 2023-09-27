import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { WavesurferProps } from "../interfaces/wavesurferProps.interface";
import { log } from "../utils/log";

export const useWavesurfer = (containerRef, options: WavesurferProps) => {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [wsRegions, setWsRegions] = useState(null);
    const [minimapRegions, setMinimapWsRegions] = useState(null);
    const [minimap, setMinimap] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [zoom, setZoom] = useState(0);

    const changeZoom = (zoom) => {
        setZoom(zoom);
    }

    const getValueFromProps = (propName, defaultValue) => {

        if (options[propName] !== undefined) {
            return options[propName];
        }

        return defaultValue;
    }

    const getTooltipContent = (region, regionsArray) => {
        const contentRegion = regionsArray.find(r => r.id === region.id);
        if (contentRegion) {
            return contentRegion;
        }
    };

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

    useEffect(() => {
        if (!wavesurfer) return
        log('Setando zoom');
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
    }, [options.peaks])

    return { wavesurfer, wsRegions, minimap, minimapRegions, timeline, changeZoom, getTooltipContent, toNextRegion, toPreviousRegion }
}