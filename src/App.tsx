import { useState, useCallback, useEffect } from 'react';
import "rsuite/dist/rsuite.min.css";
import { WaveSurferPlayer } from './components/wavesurferplayer.component';
import { Slider } from 'rsuite';

export const App = () => {

  const urls = ['audio.mp3', 'audio_.mp3'];
  const peakNames = ['audio1', 'audio2'];
  const [audioUrl, setAudioUrl] = useState(urls[0]);
  const [peakUrl, setPeakUrl] = useState(`${peakNames[0]}.json`);
  const [peaks, setPeaks] = useState([0]);
  const [zoom, setZoom] = useState(0);
  const [regions, setRegions] = useState([]);

  //Variáveis para manipular o componente WaveSurferPlayer
  var wavesurferRef = null;
  var registerEvent = null;

  function setRef(ref) {
    wavesurferRef = ref;
  }

  function setRegisterEvent(event) {
    registerEvent = event;
  }

  useEffect(() => {
    fetch(`http://localhost:3001/download/${peakUrl}`)
      .then(response => response.json())
      .then(data => {
        setPeaks(data.data);
      });
  }, [peakUrl]);

  const onUrlChange = useCallback(() => {
    urls.reverse();
    peakNames.reverse();
    setAudioUrl(urls[0]);
    setPeakUrl(`${peakNames[0]}.json`);
  }, [urls, peakNames]);

  const loadingComponent = (
    <center>
      <div style={{
        display: 'flex',
        width: '100%',
        zIndex: 10,
        height: 70,
        backgroundColor: 'blue',
        opacity: 0.7,
        position: 'absolute',
        left: 0,
        top: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1 style={{ color: 'white', fontSize: 20, marginTop: 5 }}>Estamos renderizando seu áudio, mas você pode interagir enquanto isso. </h1>
        <img alt="wavesurfer" style={{ width: 50 }} src="https://cdn.pixabay.com/animation/2023/03/20/02/45/02-45-27-186_512.gif" />
      </div>
    </center>
  );

  return (
    peaks.length > 0 &&
    <div style={{ margin: 46 }}>
      <WaveSurferPlayer
        loadByUrl={false}
        innerRef={setRef}
        registerEvent={setRegisterEvent}
        wavesurferHeight={200}
        wavesurferFillParent={true}
        wavesurferWaveColor="#ff5500"
        wavesurferProgressColor="rgb(100, 0, 100, 0)"
        url={audioUrl}
        peaks={peaks}
        wavesurferCursorColor="#1f1e1e"
        wavesurferMediaControls={false}
        loadingComponent={loadingComponent}
      />

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <button style={{ margin: 16 }} onClick={onUrlChange}>Carregar áudio</button>
        <div style={{ margin: 16 }}>
          <button onClick={() => {

            const idNewRegion = Math.random();

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
              color: 'hsla(100, 100%, 30%, 0.5)',
              drag: false,
              resize: false,
            });

            registerEvent(newRegion, [...regions, newContentRegion]);

            const newMinimapRegion = wavesurferRef.minimapRegions.addRegion({
              id: newRegion.id,
              start: newRegion.start,
              end: newRegion.end,
              color: newRegion.color,
              drag: newRegion.drag,
              resize: newRegion.resize,
            });

            registerEvent(newMinimapRegion, [...regions, newContentRegion]);

          }}>Add Region</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wsRegions.addRegion({
              start: wavesurferRef.wavesurfer.getCurrentTime(),
              color: '#000000',
              drag: false,
              resize: false
            });
          }}>Add Marker</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            setZoom(Math.random());
          }}>Atualizando estado</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
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

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wsRegions.clearRegions();
            wavesurferRef.minimapRegions.clearRegions();
          }}>Remove all regions</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wsRegions.wavesurfer.play();
          }}>Play</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wsRegions.wavesurfer.pause();
          }}>Pause</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.toNextRegion();
          }}>Next</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.toPreviousRegion();
          }}>Previous</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.seekTo(0);
          }}>Inicio</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.seekTo(1);
          }}>Fim</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() + 10);
          }}>+10</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.setTime(wavesurferRef.wavesurfer.getCurrentTime() - 10);
          }}>-10</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() + 0.1);
          }}>Speed +</button>
        </div>

        <div style={{ margin: 16 }}>
          <button onClick={() => {
            wavesurferRef.wavesurfer.setPlaybackRate(wavesurferRef.wavesurfer.getPlaybackRate() - 0.1);
          }}>Speed -</button>
        </div>

      </div>
    </div >
  );
};