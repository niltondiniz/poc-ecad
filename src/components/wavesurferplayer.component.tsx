import { useRef, useState, useEffect, useCallback } from "react"
import { useWavesurfer } from "../hooks/use-wavesurfer.hook"
import { WavesurferProps } from "../interfaces/wavesurferProps.interface";
import { log } from "../utils/log";

export const WaveSurferPlayer = (props: WavesurferProps) => {
    const containerRef = useRef<HTMLDivElement>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipContent, setTooltipContent] = useState('');
    const wavesurfer = useWavesurfer(containerRef, props);
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
                                clearTimeout(timerRef.current!);
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

    const registerOverEvent = useCallback((region, regionsArray) => {
        region.on('over', () => {
            const content = wavesurfer.getTooltipContent(region, regionsArray);
            const posicao = tooltipPosition;
            if (content.showTooltip) {
                showToolTip(posicao.x, posicao.y + 200, true, content.content);
            }
        });
        region.on('leave', () => {
            showToolTip(100, 100, false);
        });
    }, [tooltipPosition, wavesurfer]);

    const handleMouseMove = useCallback((e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        setTooltipPosition({ x: mouseX, y: mouseY });
    }, []);

    const showToolTip = useCallback((x, y, isVisible, content?) => {
        setTooltipContent(content);
        setTooltipPosition({ x, y });
        setTooltipVisible(isVisible);
    }, []);

    useEffect(() => {
        if (!wavesurfer.wavesurfer) return;

        props.getWavesurferPlayerRef(wavesurfer);
        props.registerOnMouseOverToRegion && props.registerOnMouseOverToRegion(registerOverEvent);
        setIsPlaying(false);

        wavesurfer.wavesurfer.on('zoom', (zoom) => {
            //setPeakCounter(0);
            log('Disparou o zoom');
            observeCanvasCreation();
        });

        const subscriptions = eventSubscriptions(wavesurfer, setIsPlaying, props, setPeakCounter, observeCanvasCreation, setCurrentTime);

        return () => {
            subscriptions.forEach((unsub) => unsub());
        };
    }, [wavesurfer.wavesurfer, props, registerOverEvent, observeCanvasCreation]);

    const formatTime = useCallback((time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, []);

    return (
        <div style={{ justifyContent: "center", alignItems: "center", width: '100%' }} >
            <div>
                <div className="waveformContainer" ref={containerRef} style={{ minHeight: '220px', zIndex: 1, margin: 16 }} onMouseMove={handleMouseMove} />
                {isLoading && props.loadingComponent}
            </div>
            {isTooltipVisible && (
                <div
                    id="tooltip"
                    className="tooltip"
                    style={{
                        position:
                            'absolute',
                        left: tooltipPosition.x + 16,
                        top: tooltipPosition.y,
                        maxWidth: 250,
                        backgroundColor: '#6a5e5e',
                        opacity: 0.9,
                        borderRadius: 9,
                        zIndex: 1000,
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'left',
                        padding: 16,
                        color: '#f9f7f7',
                        fontWeight: '500',

                    }}
                >
                    {tooltipContent}

                </div>
            )}
            <span style={{marginLeft:16}}>{
                props.showInnerCurrentTime ?
                    formatTime(currentTime) : <div></div>

            }</span>
        </div>
    )
}

function eventSubscriptions(wavesurfer: { wavesurfer: any; wsRegions: any; minimap: any; minimapRegions: any; timeline: any; changeZoom: (zoom: any) => void; getTooltipContent: (region: any, regionsArray: any) => any; }, setIsPlaying, props: any, setPeakCounter, observeCanvasCreation: () => () => void, setCurrentTime: any) {
    return [
        wavesurfer.wavesurfer.on('play', () => {
            log('on play');
            setIsPlaying(true);
            props.onPlay && props.onPlay(true);
        }),
        wavesurfer.wavesurfer.on('pause', () => {
            log('on pause');
            setIsPlaying(false);
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
            props.onReady && props.onReady(duration);
        }),
        wavesurfer.wavesurfer.on('zoom', (zoom) => {
            //setPeakCounter(0);
            log('Disparou o zoom');
            observeCanvasCreation();
        }),
        wavesurfer.wavesurfer.on('finish', () => {
            log('on finish');
            setIsPlaying(false);
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