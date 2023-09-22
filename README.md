# Wavesurfer ECAD component

O objetivo desta POC além de validar o componente wavesurfer, é também criar um candidato a componente final.
Os pontos utilizados pelo ECAD foram levados em consideração para a criação desta POC.

## Conteudo da POC

- WavesurferHook
  - Hook que encapsula as funcionalidades basicas, e exporta o componente wavesurfer bem como seus plugins para extensão. Podendo assim ser utilizado todo recurso da biblioteca.
- WavesurferPlayer
  - Componente que utiliza o Wavesurfer. Este componente é um facilitador para utilizar os eventos e propriedades do Wavesurfer, trazendo subscrição nos eventos, propriedades e etc.
- App
  - Componente de exemplo complexo, trazendo a maior parte das funcionalidades presentes nos requisitos do ECAD. Implementa eventos tanto do Wavesurfer quanto de regiões. O componente exemplifica a utilização dos recursos avançados do waveform, como carregamento de picos (peaks), registro em eventos, exibição de dados nas regiões (tooltip) e etc.
- WavesurferProps.Interface
  - Tipagem dos Props utilizados no wavesurfer documentado.
- Minimal Component
  - Exemplo mínimo de utilização do WavesurferPlayer.
 
## Minimal Component

```typescript
import { Slider } from "rsuite";
import { WaveSurferPlayer } from "./components/wavesurferplayer.component";
import "rsuite/dist/rsuite.min.css";
import { Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useState } from "react";

export default function MinimalComponent() {

    //Variável que armazena uma instância da Wavesurfer
    var wavesurferRef = null;

    //Controla o estado do botão Play
    const [isPlaying, setIsPlaying] = useState(false);

    //Callback que é utilizado para obter a referencia da Wavesurfer
    const setWavesurferRef = (ref) => {
        wavesurferRef = ref;
    }

    //Componente que indica a renderização do zoom    
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
        <div>
            <WaveSurferPlayer
                loadByUrl={true}
                getWavesurferPlayerRef={setWavesurferRef}
                wavesurferHeight={200}
                wavesurferFillParent={true}
                wavesurferWaveColor="#1976d2"
                wavesurferProgressColor="rgb(100, 0, 100, 0)"
                url={'audio.mp3'}
                wavesurferCursorColor="#1f1e1e"
                wavesurferMediaControls={false}
                showInnerCurrentTime={true}
                loadingComponent={loadingComponent}
                onPlay={setIsPlaying}
            />

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
                            wavesurferRef.changeZoom(value);
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                <div style={{ margin: 16 }}>
                    <FirstPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.seekTo(0); }} />
                </div>

                <div style={{ margin: 16 }}>
                    <FastRewindIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.toPreviousRegion(); }} />
                </div>

                <div style={{ margin: 16 }}>
                    {
                        !isPlaying ?
                            <PlayArrowIcon style={{ cursor: 'pointer' }} onClick={() => wavesurferRef.wsRegions.wavesurfer.play()} /> :
                            <PauseIcon style={{ cursor: 'pointer' }} onClick={() => wavesurferRef.wsRegions.wavesurfer.pause()} />
                    }
                </div>

                <div style={{ margin: 16 }}>
                    <FastForwardIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.toNextRegion(); }} />
                </div>

                <div style={{ margin: 16 }}>
                    <LastPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.seekTo(1); }} />
                </div>

                <div style={{ margin: 16 }}>
                    <Replay10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() - 10) }} />
                </div>

                <div style={{ margin: 16 }}>
                    <Forward10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() + 10) }} />
                </div>

                <div style={{ margin: 16 }}>
                    <AddIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() + 0.1); }} />
                </div>

                <div style={{ margin: 16 }}>
                    <RemoveIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() - 0.1); }} />
                </div>

            </div>

        </div>
 )
}
```

## App component

```typescript
import { useState, useCallback, useEffect } from 'react';
import "rsuite/dist/rsuite.min.css";
import { WaveSurferPlayer } from './components/wavesurferplayer.component';
import { Slider } from 'rsuite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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

  //Variáveis para manipular o componente WaveSurferPlayer
  var wavesurferRef = null;
  var registerEvent = null;

  function getTwoRandomNumbers() {
    //dois algarismos aleatórios
    const random = Math.floor(Math.random() * 100);
    return random.toString().padStart(2, '0');

  }

  //Esta função é responsável por obter a referência do componente WaveSurferPlayer
  function getWavesurferPlayerRef(ref) {
    wavesurferRef = ref;
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
    
    //  Instanciando o componente WaveSurferPlayer. O props está tipado, 
    //  verificar o arquivo wavesurferProps.interface.tsx para mais detalhes sobre os atributos.
    //  Em resumo todas as funcionalidades utilizadas no waveform do ECAD podem ser utilizadas aqui.
    //  Por exemplo, customização de cores, eventos e etc.    
    
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

            //Este componente jsx será exibido no tooltip
            //O componente pode ser qualquer coisa, inclusive outro componente React
            //O importante é colocar aqui as informações que estão na documentação do ECAD
            //Bem provável que aqui serão exibidas informações da região, como duração, inicio e fim, autor, musica e etc.
            
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

            const newRegion = wavesurferRef.wsRegions.addRegion({
              id: idNewRegion,
              start: wavesurferRef.wavesurfer.getCurrentTime(),
              end: wavesurferRef.wavesurfer.getCurrentTime() + 10,
              color: `#${getTwoRandomNumbers()}${getTwoRandomNumbers()}${getTwoRandomNumbers()}B0`,
              drag: false,
              resize: false,
            });

            //Registrando o evento do tooltip.
            //Isto é feito para cada region adicionada.
            //Está na documentação do wavesurfer.
            registerEvent(newRegion, [...regions, newContentRegion]);

            const newMinimapRegion = wavesurferRef.minimapRegions.addRegion({
              id: newRegion.id,
              start: newRegion.start,
              end: newRegion.end,
              color: newRegion.color,
              drag: newRegion.drag,
              resize: newRegion.resize,
            });

            //Registrando o evento do tooltip. Agora para o minimap
            registerEvent(newMinimapRegion, [...regions, newContentRegion]);

          }}>Add Region</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            wavesurferRef.wsRegions.addRegion({
              start: wavesurferRef.wavesurfer.getCurrentTime(),
              color: '#000000',
              drag: false,
              resize: false
            });
          }}>Add Marker</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            wavesurferRef.wsRegions.clearRegions();
            wavesurferRef.minimapRegions.clearRegions();
          }}>Remove all regions</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            setZoom(Math.random());
          }}>Atualizando estado</Button>
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
              wavesurferRef.changeZoom(value);
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

        <div style={{ margin: 16 }}>
          <FirstPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.seekTo(0); }} />
        </div>

        <div style={{ margin: 16 }}>
          <FastRewindIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.toPreviousRegion(); }} />
        </div>

        <div style={{ margin: 16 }}>
          {
            !isPlaying ?
              <PlayArrowIcon style={{ cursor: 'pointer' }} onClick={() => wavesurferRef.wsRegions.wavesurfer.play()} /> :
              <PauseIcon style={{ cursor: 'pointer' }} onClick={() => wavesurferRef.wsRegions.wavesurfer.pause()} />
          }
        </div>

        <div style={{ margin: 16 }}>
          <FastForwardIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.toNextRegion(); }} />
        </div>

        <div style={{ margin: 16 }}>
          <LastPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.seekTo(1); }} />
        </div>

        <div style={{ margin: 16 }}>
          <Replay10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() - 10) }} />
        </div>

        <div style={{ margin: 16 }}>
          <Forward10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() + 10) }} />
        </div>

        <div style={{ margin: 16 }}>
          <AddIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() + 0.1); }} />
        </div>

        <div style={{ margin: 16 }}>
          <RemoveIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() - 0.1); }} />
        </div>

      </div>
    </div >
  );
};
```

