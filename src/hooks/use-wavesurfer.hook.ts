import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { WavesurferProps } from "../interfaces/wavesurferProps.interface";

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
        console.log('Setando zoom');
        wavesurfer.zoom(zoom);
    }, [zoom]);

    useEffect(() => {
        if (!options.loadByUrl) {
            if (options.peaks.length === 1) {
                return;
            }
        }

        if (!options) return
        if (!containerRef.current) return

        const regions = RegionsPlugin.create()
        setWsRegions(regions);

        const minimapRegions = RegionsPlugin.create()
        setMinimapWsRegions(minimapRegions);

        const ws = WaveSurfer.create({
            height: options.wavesurferHeight,
            container: containerRef.current,
            fillParent: options.wavesurferFillParent !== undefined ? options.wavesurferFillParent : false,
            hideScrollbar: options.wavesurferHideScrollbar !== undefined ? options.wavesurferHideScrollbar : false,
            waveColor: options.wavesurferWaveColor !== undefined ? options.wavesurferWaveColor : '#ff4e00',
            progressColor: options.wavesurferProgressColor !== undefined ? options.wavesurferProgressColor : 'rgb(100, 0, 100, 0.1)',
            cursorColor: options.wavesurferCursorColor !== undefined ? options.wavesurferCursorColor : '#ddd5e9',
            cursorWidth: options.wavesurferCursorWidth !== undefined ? options.wavesurferCursorWidth : 2,
            autoScroll: options.wavesurferAutoScroll !== undefined ? options.wavesurferAutoScroll : true,
            autoCenter: options.wavesurferAutoCenter !== undefined ? options.wavesurferAutoCenter : true,
            mediaControls: options.wavesurferMediaControls !== undefined ? options.wavesurferMediaControls : true,
            barWidth: options.wavesurferBarWidth !== undefined ? options.wavesurferBarWidth : 2,
            plugins: [
                regions,
            ],

        });

        const minimapInstance = ws.registerPlugin(MinimapPlugin.create({
            height: options.minimapHeight !== undefined ? options.minimapHeight : 40,
            waveColor: options.minimapWaveColor !== undefined ? options.minimapWaveColor : '#ddd',
            progressColor
                : options.minimapProgressColor !== undefined ? options.minimapProgressColor : '#999',
            plugins: [
                minimapRegions,
            ]
        }));
        setMinimap(minimapInstance);


        const timelineInstance = ws.registerPlugin(TimelinePlugin.create({
            height: options.timelineHeight !== undefined ? options.timelineHeight : 20,
            primaryLabelInterval: options.timelinePrimaryLabelInterval !== undefined ? options.timelinePrimaryLabelInterval : 10,
            style: {
                fontSize: options.timelineFontSize !== undefined ? options.timelineFontSize : '10px',
                color: options.timelineFontColor !== undefined ? options.timelineFontColor : '#6A3274',
            },
        }));
        setTimeline(timelineInstance);
        
        ws.load(options.url, !options.loadByUrl && options.peaks);
        setWavesurfer(ws);

        regions.on('remove', function (region) {
            //Ao criar uma região, adiciono ela no minimap
            minimapRegions.addRegion({
                id: region.id,
                start: region.start,
                end: region.end,
                color: region.color,
                drag: region.drag,
                resize: region.resize,
            });            
        });        

        return () => {
            ws.destroy()
        }
    }, [options.peaks])

    return { wavesurfer, wsRegions, minimap, minimapRegions, timeline, changeZoom, getTooltipContent, toNextRegion, toPreviousRegion }
}