export interface WavesurferProps {
    //Indica se a waveform vai ser carregada por url ou por array de peaks
    loadByUrl: boolean,
    //Altura da waveform
    wavesurferHeight: number,
    //Referencia do container que vai renderizar a waveform
    container?: any,
    //Indica se a waveform vai ser renderizada em tela cheia
    wavesurferFillParent?: boolean,
    //Indica se a waveform vai ser renderizada com scroll
    wavesurferHideScrollbar?: boolean,
    //Cor da waveform
    wavesurferWaveColor?: string,
    //Cor da waveform indicando a parte que já foi reproduzida
    wavesurferProgressColor?: string,
    //Cor do cursor
    wavesurferCursorColor?: string,
    //Largura do cursor
    wavesurferCursorWidth?: number,
    //Indica se a waveform vai acompanhando o cursor na reprodução
    wavesurferAutoScroll?: boolean,
    //Indica se a waveform vai centralizar o cursor na reprodução
    wavesurferAutoCenter?: boolean,
    //Indica se a waveform vai renderizar os controles de reprodução
    wavesurferMediaControls?: boolean,
    //Largura das barras da waveform
    wavesurferBarWidth?: number,
    //Callback para obter a referencia do wavesurfer
    getWavesurferPlayerRef?: any,
    //Callback para registrar o evento de tooltip
    registerOnMouseOverToRegion?: any,
    //Callback para registrar o evento de update end
    registerOnUpdateEnd?: any,
    //Url do audio
    url?: string,
    //Array de peaks
    peaks?: any,
    //Componente que será exibido enquanto a waveform estiver carregando o zoom
    loadingComponent?: any,
    //Altura do minimap
    minimapHeight?: number
    //Cor do minimap
    minimapWaveColor?: string
    //Cor do minimap indicando a parte que já foi reproduzida
    minimapProgressColor?: string,
    //Altura do timeline
    timelineHeight?: number,
    //Intervalo entre os labels do timeline
    timelinePrimaryLabelInterval?: number,
    //Tamanho da fonte do timeline
    timelineFontSize?: string,
    //Cor da fonte do timeline
    timelineFontColor?: string,
    //Callback do evento timeUpdate do wavesurfer
    onTimeUpdate?: any,
    //Indica se será exibido o contador do WavesurferPlayer, caso contrário, poderá ser customizado, se inscrevendo no evento onTimeUpdate, e aplicando a logica em qualquer componente
    showInnerCurrentTime: boolean,
    //Callback do evento onPlay
    onPlay?: any,
    //Callback do evento onPause
    onPause?: any,
    //Callback do evento onLoading
    onLoading?: any,
    //Callback do evento onReady
    onReady?: any,
    //Callback do evento onFinish
    onFinish?: any,
    //Callback do evento onRegionCreated, é acionado toda vez que uma região é criada, e retorna a região criada.
    onRegionCreated?: any,
    //Callback do evento onRegionIn, é acionado toda vez que uma região é clicada, e retorna a região clicada.
    onRegionIn?: any,
}
