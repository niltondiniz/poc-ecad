import { useRef, useState, useCallback, useEffect } from "react"
import { useWavesurfer } from "../hooks/use-wavesurfer.hook"
import { Slider } from "rsuite";

export const WaveSurferPlayer = (props) => {
    const containerRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const wavesurfer = useWavesurfer(containerRef, props);
    const [peakCounter, setPeakCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const timerRef = useRef(null);
    const observeCanvasCreation = () => {
        console.log('Vai observar a criação de canvas');
        const targetNode = document.querySelector('.treco');

        try {
            const shadowRootNode = targetNode.querySelector('div').shadowRoot
                .querySelector('div')
                .querySelector('.wrapper')
                .querySelector('.canvases');

            if (shadowRootNode) {
                const node = shadowRootNode.querySelector('div');

                var peaker = 0;
                const observer = new MutationObserver((mutationsList) => {
                    setIsLoading(true);
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            const canvasTags = node.querySelectorAll('canvas');
                            if (canvasTags.length > 0) {

                                peaker = peaker + 1
                                setPeakCounter(peaker);

                                // Reiniciar o temporizador quando um novo canvas é detectado
                                clearTimeout(timerRef.current);
                                timerRef.current = setTimeout(() => {
                                    // Ação a ser realizada após 3 segundos sem novos canvas
                                    console.log('Nenhum novo canvas por 3 segundos.');
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
    };

    useEffect(() => {
        if (!wavesurfer.wavesurfer) return

        props.innerRef(wavesurfer);

        setCurrentTime(0)
        setIsPlaying(false)
        
        const subscriptions = [
            wavesurfer.wavesurfer.on('play', () => {
                setIsPlaying(true);
                props.onPlay && props.onPlay();
            }),
            wavesurfer.wavesurfer.on('pause', () => {
                setIsPlaying(false);
                props.onPause && props.onPause();
            }),
            wavesurfer.wavesurfer.on('timeupdate', (currentTime) => {
                setCurrentTime(currentTime);
                props.onTimeUpdate && props.onTimeUpdate(currentTime);
            }),
            wavesurfer.wavesurfer.on('loading', (percent) => {
                console.log(`loading ${percent}%`);
                props.onLoading && props.onLoading(percent);
            }),
            wavesurfer.wavesurfer.on('ready', (duration) => {
                console.log(`ready ${duration}`);
                props.onReady && props.onReady(duration);
            }),
            wavesurfer.wavesurfer.on('zoom', (zoom) => {
                console.log('Vai analisar o zoom');
                setPeakCounter(0);
                observeCanvasCreation();
            }),
            wavesurfer.wavesurfer.on('finish', () => {
                setIsPlaying(false);
                props.onFinish && props.onFinish();
            }),
            wavesurfer.wsRegions.on('region-created', function (region) {
                        
                // region.on('over', () => {
                //     console.log(region, 'over');
                //     const posicao = obterPosicaoAbsoluta(region.element);
                //     console.log('Position', posicao);
                //     showToolTip(posicao.x, posicao.y + 200, true);
                // });
                // region.on('leave', () => {
                //     console.log(region, 'leave');
                //     showToolTip(100, 100, false);
                // });
                props.onRegionCreated && props.onRegionCreated(region);
                wavesurfer.minimapRegions.addRegion({
                    id: region.id,
                    start: region.start,
                    end: region.end,
                    color: region.color,
                    drag: region.drag,
                    resize: region.resize,
                });
                wavesurfer.minimapRegions.addRegion({
                    start: region.start,
                    end: region.end,
                    color: region.color,
                    drag: region.drag,
                    resize: region.resize,
                });
                console.log(region, 'region-created');
            }),
            wavesurfer.wsRegions.on('region-in', function (region) {
                console.log(region, 'region-in');
                props.onRegionIn && props.onRegionIn(region);
            }),

        ]

        return () => {
            subscriptions.forEach((unsub) => unsub())
        }
    }, [wavesurfer.wavesurfer, props])

    return (
        <div style={{ justifyContent: "center", alignItems: "center", width: '100%' }} >
            <div>
                {
                    isLoading ?
                        <center>
                            <div style={{ width: '100%', minHeight: props.height, zIndex: 10, height: 130, backgroundColor: 'blue', opacity: 0.7, position: 'absolute', left: 0, top: 0 }}>
                                <h1 style={{ color: 'white', fontSize: 20, marginTop: 5 }}>Processando...{peakCounter}</h1>
                                <img alt="wavesurfer" style={{ width: 50 }} src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_512.gif" />

                            </div>
                        </center> :
                        <></>
                }
                <div className="treco" ref={containerRef} style={{ minHeight: '220px', zIndex: 1, margin: 16 }} />
                
            </div>
        </div>
    )
}