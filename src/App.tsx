import { useState, useCallback, useEffect } from 'react';
import "rsuite/dist/rsuite.min.css";
import { WaveSurferPlayer } from './components/wavesurferplayer.component';
import { Slider } from 'rsuite';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MediaControlsComponent from './components/mediacontrols.component';

export const App = () => {

  const urls = ['audio.mp3', 'audio_.mp3'];
  const peakNames = ['audio1', 'audio2'];
  const [audioUrl, setAudioUrl] = useState(urls[0]);
  const [peakUrl, setPeakUrl] = useState(`${peakNames[0]}.json`);
  const [peaks, setPeaks] = useState([0]);
  const [zoom, setZoom] = useState(0);
  const [regions, setRegions] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState(null);

  //Variáveis para manipular o componente WaveSurferPlayer
  let registerEvent = null;

  function getTwoRandomNumbers() {
    //dois algarismos aleatórios
    const random = Math.floor(Math.random() * 100);
    return random.toString().padStart(2, '0');

  }

  //Esta função é responsável por obter a referência do componente WaveSurferPlayer
  function getWavesurferPlayerRef(ref) {
    console.log('Registrado');
    setWavesurfer(ref);
  }

  //esta função é responsável por setar a referencia da função que registra o evento de mouseover, para exibir o tooltip
  function setRegisterEvent(event) {
    registerEvent = event;
  }

  //Função responsável por formatar o tempo para exibição
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    //Carregando os peaks para exibir o waveform    
    fetch(`http://localhost:3001/download/${peakUrl}`)
      .then(response => response.json())
      .then(data => {
        setPeaks(data.data);
      });
  }, [peakUrl]);

  //Usada para alterar o peak/audio utilizado
  const onUrlChange = useCallback(() => {
    urls.reverse();
    peakNames.reverse();
    setAudioUrl(urls[0]);
    setPeakUrl(`${peakNames[0]}.json`);
  }, [urls, peakNames]);

  //Este componente será exibido enquanto estiver carregando o zoom do waveform
  const loadingComponent = (
    <center>
      <div style={{
        display: 'flex',
        width: '100%',
        zIndex: 10,
        height: 70,
        backgroundColor: '#1976d2',
        opacity: 0.95,
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
        position: 'absolute',
        left: 0,
        top: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Typography variant="h6" display="block" gutterBottom style={{ color: 'white', marginTop: 5 }}>Estamos renderizando seu áudio, mas você pode interagir enquanto isso.</Typography>
        <img alt="wavesurfer" style={{ width: 50 }} src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_512.gif" />
      </div>
    </center>
  );

  return (
    /*
      Instanciando o componente WaveSurferPlayer. O props está tipado, 
      verificar o arquivo wavesurferProps.interface.tsx para mais detalhes sobre os atributos.
      Em resumo todas as funcionalidades utilizadas no waveform do ECAD podem ser utilizadas aqui.
      Por exemplo, customização de cores, eventos e etc.    
    */
    peaks.length > 0 &&
    <div style={{ margin: 46 }}>
      <WaveSurferPlayer
        loadByUrl={false}
        getWavesurferPlayerRef={getWavesurferPlayerRef}
        registerOnMouseOverToRegion={setRegisterEvent}
        wavesurferHeight={200}
        wavesurferFillParent={true}
        wavesurferWaveColor="#1976d2"
        wavesurferProgressColor="rgb(100, 0, 100, 0)"
        url={audioUrl}
        peaks={peaks}
        wavesurferCursorColor="#1f1e1e"
        wavesurferMediaControls={false}
        loadingComponent={loadingComponent}
        onTimeUpdate={setCurrentTime}
        showInnerCurrentTime={false}
        onPlay={setIsPlaying}
        wavesurferBarWidth={2}
      />

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" display="block" gutterBottom>
          {formatTime(currentTime)}
        </Typography>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

        <Button variant="contained" style={{ margin: 16 }} onClick={onUrlChange}>Carregar áudio</Button>
        <div style={{ margin: 16 }}>

          <Button variant="contained" onClick={() => {

            const idNewRegion = Math.random();

            /*Este componente jsx será exibido no tooltip
              O componente pode ser qualquer coisa, inclusive outro componente React
              O importante é colocar aqui as informações que estão na documentação do ECAD
              Bem provável que aqui serão exibidas informações da região, como duração, inicio e fim, autor, musica e etc.
            */
            const tooltipContent = (
              <div>
                <h4>Título</h4>
                <p>Este é um parágrafo de exemplo.</p>
                <ul>
                  <li>{idNewRegion}</li>
                  <li>Autor: Nilton Diniz</li>
                  <li>Musica: Teste de musica</li>
                  <li>Ano: {Math.random()}</li>
                </ul>
              </div>
            )

            const newContentRegion = { id: idNewRegion, content: tooltipContent, showTooltip: true };

            setRegions([...regions, newContentRegion]);

            const newRegion = wavesurfer.wsRegions.addRegion({
              id: idNewRegion,
              start: wavesurfer.wavesurfer.getCurrentTime(),
              end: wavesurfer.wavesurfer.getCurrentTime() + 100,
              color: `#${getTwoRandomNumbers()}${getTwoRandomNumbers()}${getTwoRandomNumbers()}B0`,
              drag: false,
              resize: false,
            });

            //Registrando o evento do tooltip.
            //Isto é feito para cada region adicionada.
            //Está na documentação do wavesurfer.
            registerEvent(newRegion, [...regions, newContentRegion]);

            wavesurfer.wsRegions.addRegion({
              start: newRegion.start,
              color: '#000000',
              drag: false,
              resize: false
            });

            const newMinimapRegion = wavesurfer.minimapRegions.addRegion({
              id: newRegion.id,
              start: newRegion.start,
              end: newRegion.end,
              color: newRegion.color,
              drag: newRegion.drag,
              resize: newRegion.resize,
            });

            wavesurfer.minimapRegions.addRegion({
              id: newMinimapRegion.id,
              start: newMinimapRegion.start,
              color: '#000000',
              drag: newMinimapRegion.drag,
              resize: newMinimapRegion.resize,
            });

            //Registrando o evento do tooltip. Agora para o minimap
            registerEvent(newMinimapRegion, [...regions, newContentRegion]);

          }}>Add Region</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            const markerRegion = wavesurfer.wsRegions.addRegion({
              start: wavesurfer.getCurrentTime(),
              color: '#000000',
              drag: false,
              resize: false
            });

            wavesurfer.minimapRegions.addRegion({
              id: markerRegion.id,
              start: markerRegion.start,
              color: '#000000',
              drag: markerRegion.drag,
              resize: markerRegion.resize,
            });
          }}>Add Marker</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            wavesurfer.wsRegions.clearRegions();
            wavesurfer.minimapRegions.clearRegions();
          }}>Remove all regions</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            setZoom(Math.random());
          }}>Atualizando estado {zoom}</Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ margin: 16, width: 500 }}>
          <Slider
            defaultValue={0}
            min={0}
            max={100}
            progress
            style={{ marginTop: 16 }}
            renderMark={mark => {
              return mark;
            }}
            onChange={(value) => {
              wavesurfer.changeZoom(value);
            }}
          />
        </div>
      </div>
      <MediaControlsComponent wavesurfer={wavesurfer} isPlaying={isPlaying} />
    </div >
  );
};

