import { useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

export const useWavesurfer = (containerRef, options) => {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [wsRegions, setWsRegions] = useState(null);
    const [minimapRegions, setMinimapWsRegions] = useState(null);
    const [minimap, setMinimap] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [zoom, setZoom] = useState(0);

    const changeZoom = (zoom) => {
        console.log('Chamou changeZoom', zoom);
        setZoom(zoom);
    }

    useEffect(() => {
        console.log('trabalhando o useEffect do zoom', zoom);
        if (!wavesurfer) return
        wavesurfer.zoom(zoom);
    }, [zoom]);

    useEffect(() => {
        console.log('options peaks', options.peaks);
        if(options.peaks.length === 1) {
            console.log('Não tem peaks');
            return;
        }else{
            console.log('Tem peaks');
        }

        if(!options) return        
        if (!containerRef.current) return 

        console.log(options);

        //Crio as regiões
        const regions = RegionsPlugin.create()
        setWsRegions(regions);

        const minimapRegions = RegionsPlugin.create()
        setMinimapWsRegions(minimapRegions);        

        //Crio o wavesurfer
        const ws = WaveSurfer.create({
            height: options.height,
            //url: options.url,
            container: containerRef.current,
            fillParent: options.fillParent !== undefined ? options.fillParent : false,
            hideScrollbar: options.hideScrollbar !== undefined ? options.hideScrollbar : false,
            waveColor: options.waveColor !== undefined ? options.waveColor : '#ff4e00',
            progressColor: options.progressColor !== undefined ? options.progressColor : 'rgb(100, 0, 100, 0.1)',
            cursorColor: options.cursorColor !== undefined ? options.cursorColor : '#ddd5e9',
            cursorWidth: options.cursorWidth !== undefined ? options.cursorWidth : 2,
            autoScroll: options.autoScroll !== undefined ? options.autoScroll : true,
            autoCenter: options.autoCenter !== undefined ? options.autoCenter : true,
            mediaControls: options.mediaControls !== undefined ? options.mediaControls : true,
            barWidth: options.barWidth !== undefined ? options.barWidth : 2,
            //minPxPerSec: options.minPxPerSec !== undefined ? options.minPxPerSec : 100,
            plugins: [                
                regions,
            ],

        });

        const minimapInstance = ws.registerPlugin(MinimapPlugin.create({
            height: 40,
            waveColor: '#ddd',
            progressColor
                : '#999',
            plugins: [
                minimapRegions,
            ]
        }));
        setMinimap(minimapInstance);

        //Crio o timeline
        const timelineInstance = ws.registerPlugin(TimelinePlugin.create({
            height: 20,
            //timeInterval: 30,
            primaryLabelInterval: 10,
            style: {
                fontSize: '10px',
                color: '#6A3274',
            },
        }));
        setTimeline(timelineInstance);

        console.log('options url', options.url);
        ws.load(options.url, options.peaks);
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
            console.log(region, 'region-created');
        });        

        console.log('WS', ws);

        return () => {
            ws.destroy()
        }
    }, [options.peaks])    

    return {wavesurfer, wsRegions, minimap, minimapRegions, timeline, changeZoom}
}