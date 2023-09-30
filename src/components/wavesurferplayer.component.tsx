import { useRef, useState, useEffect, useCallback } from "react"
import { useWavesurfer } from "../hooks/use-wavesurfer.hook"
import { WavesurferProps } from "../interfaces/wavesurferProps.interface";
import { log } from "../utils/log";
import { TooltipComponent } from "./tooltip.component";
import { TooltipPropsInterface } from "../interfaces/tooltip-props.interface";
import { formatTime } from "../utils/helpers";

export const WaveSurferPlayer = (props: WavesurferProps) => {
    const containerRef = useRef<HTMLDivElement>();
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipProps, setTooltipProps] = useState<TooltipPropsInterface>(null);
        
    const wavesurfer = useWavesurfer(
        containerRef,
        props,
        props.regionInfo,
        props.setRegionInfo,
        tooltipPosition,        
        setTooltipVisible,
        tooltipProps,
        setTooltipProps
    );
    const [peakCounter, setPeakCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    const observeCanvasCreation = useCallback(() => {
        const targetNode = document.querySelector('.waveformContainer');
        try {
            const shadowRootNode = targetNode.querySelector('div').shadowRoot
                .querySelector('div')
                .querySelector('.wrapper')
                .querySelector('.canvases');

            if (shadowRootNode) {
                const node = shadowRootNode.querySelector('div');
                let peaker = 0;
                const observer = new MutationObserver((mutationsList) => {
                    setIsLoading(true);
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            const canvasTags = node.querySelectorAll('canvas');
                            if (canvasTags.length > 0) {
                                peaker = peaker + 1
                                setPeakCounter(peaker);
                                clearTimeout(timerRef.current);
                                timerRef.current = setTimeout(() => {
                                    setIsLoading(false);
                                }, 500);
                            }
                        }
                    }
                });

                const config = { childList: true, subtree: true };
                observer.observe(node, config);

                return () => {
                    observer.disconnect();
                };
            }
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        setTooltipPosition({ x: mouseX, y: mouseY });
    }, []);

    useEffect(() => {
        if (!wavesurfer.wavesurfer) return;

        wavesurfer.wavesurfer.on('zoom', (zoom) => {            
            observeCanvasCreation();
        });

        const subscriptions = eventSubscriptions(wavesurfer, props, setPeakCounter, observeCanvasCreation, setCurrentTime);

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer, props, observeCanvasCreation]);

    return (
        <div style={{ justifyContent: "center", alignItems: "center", width: '100%' }} >
            <div>
                <div className="waveformContainer" ref={containerRef} style={{ minHeight: '220px', zIndex: 1, margin: 16 }} onMouseMove={handleMouseMove} />
                {isLoading && props.loadingComponent}
            </div>
            <TooltipComponent tooltipProps={tooltipProps} tooltipPosition={tooltipPosition} />
            <span style={{ marginLeft: 16 }}>{
                props.showInnerCurrentTime ?
                    formatTime(currentTime) : <div></div>

            }</span>
        </div>
    )
}

function eventSubscriptions(wavesurfer: { wavesurfer: any; wsRegions: any; minimap: any; minimapRegions: any; timeline: any; changeZoom: (zoom: any) => void; }, props: any, setPeakCounter, observeCanvasCreation: () => () => void, setCurrentTime: any) {

    return [
        wavesurfer.wavesurfer.on('play', () => {
            log('on play');
            props.onPlay && props.onPlay(true);
        }),
        wavesurfer.wavesurfer.on('pause', () => {
            log('on pause');
            props.onPlay && props.onPlay(false);
            props.onPause && props.onPause();
        }),
        wavesurfer.wavesurfer.on('timeupdate', (currentTime) => {
            log('on time update');
            setCurrentTime(currentTime);
            props.onTimeUpdate && props.onTimeUpdate(currentTime);
        }),
        wavesurfer.wavesurfer.on('loading', (percent) => {
            log('on loading');
            props.onLoading && props.onLoading(percent);
        }),
        wavesurfer.wavesurfer.on('ready', (duration) => {
            log('on ready');
            wavesurfer.wsRegions.enableDragSelection({
                color: 'rgb(173,216,230,0.5)',
            });
            props.getWavesurferPlayerRef(wavesurfer);
            props.onReady && props.onReady(duration);
        }),
        wavesurfer.wavesurfer.on('zoom', (zoom) => {
            log('Disparou o zoom');
            observeCanvasCreation();
        }),
        wavesurfer.wavesurfer.on('finish', () => {
            log('on finish');
            props.onPlay && props.onPlay(false);
            props.onFinish && props.onFinish();
        }),
        wavesurfer.wsRegions.on('region-created', function (region) {
            log('region-created');
            props.onRegionCreated && props.onRegionCreated(region);
        }),
        wavesurfer.wsRegions.on('region-in', function (region) {
            log('region-in');
            props.onRegionIn && props.onRegionIn(region);
        }),
    ];
}

