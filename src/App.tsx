import { useState, useCallback, useEffect } from 'react';
import "rsuite/dist/rsuite.min.css";
import { WaveSurferPlayer } from './components/wavesurferplayer.component';

import { Slider } from 'rsuite';


// Componente principal que renderiza dois players de áudio
export const App = () => {

  const urls = ['audio.mp3', 'audio_.mp3'];
  const peakNames = ['audio1', 'audio2'];
  const [audioUrl, setAudioUrl] = useState(urls[0]);
  const [peakUrl, setPeakUrl] = useState(`${peakNames[0]}.json`);
  const [peaks, setPeaks] = useState([0]);
  const [zoom, setZoom] = useState(0);
  const [regions, setRegions] = useState([]);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState('');

  var wavesurferRef = null;

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setTooltipPosition({ x: mouseX, y: mouseY });
  };

  const showToolTip = (x, y, isVisible, content?) => {
    console.log('showToolTip', x, y, isVisible);
    setTooltipContent(content);
    setTooltipPosition({ x, y });
    setTooltipVisible(isVisible);
  }

  function obterPosicaoAbsoluta(elemento) {
    let posicaoX = 0;
    let posicaoY = 0;

    while (elemento) {
      posicaoX += elemento.offsetLeft;
      posicaoY += elemento.offsetTop;
      elemento = elemento.offsetParent;
    }

    return { x: posicaoX, y: posicaoY };
  }

  function setRef(ref) {
    wavesurferRef = ref;
  }

  useEffect(() => {
    fetch(`http://localhost:3001/download/${peakUrl}`)
      .then(response => response.json())
      .then(data => {
        console.log('Peaks carregados: ', data.data);
        setPeaks(data.data);
      });
  }, [peakUrl]);

  // Alterna a URL do arquivo de áudio
  const onUrlChange = useCallback(() => {
    urls.reverse();
    peakNames.reverse();
    setAudioUrl(urls[0]);
    setPeakUrl(`${peakNames[0]}.json`);
  }, [urls, peakNames]);

  const getTooltipContent = (region, regionsArray) => {
    const contentRegion = regionsArray.find(r => r.id === region.id);
    if (contentRegion) {
      return contentRegion.content;
    }
  };

  const registerOverEvent = (region, regionsArray) => {
    // Registre o evento 'over' para a região fornecida
    region.on('over', () => {
      const content = getTooltipContent(region, regionsArray);
      console.log('Encontrou o conteudo ', content);
      const posicao = obterPosicaoAbsoluta(region.element);
      showToolTip(posicao.x, posicao.y + 200, true, content);
    });
    region.on('leave', () => {
      console.log(region, 'leave');
      showToolTip(100, 100, false);
    });
  };

  // Renderiza os players de áudio e o botão de troca de URL
  //console.log('Vai renderizar player', peaks);
  return (
    peaks.length > 0 &&
    <div style={{ margin: 46 }} onMouseMove={handleMouseMove}>
      <WaveSurferPlayer
        innerRef={setRef}
        getTooltipContent={getTooltipContent}
        height={200}
        fillParent={true}
        waveColor="#ff5500"
        progressColor="rgb(100, 0, 100, 0)"
        url={audioUrl}
        peaks={peaks}
        cursorColor="#1f1e1e"
        mediaControls={false}

      />
      <button onClick={onUrlChange}>Carregar áudio</button>

      <div style={{ marginBottom: 36, marginTop: 36 }}>
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
                <li>Ano: Teste de ano</li>
              </ul>
            </div>
          )

          const newContentRegion = { id: idNewRegion, content: tooltipContent };

          setRegions([...regions, newContentRegion]);

          const newRegion = wavesurferRef.wsRegions.addRegion({
            id: idNewRegion,
            start: wavesurferRef.wavesurfer.getCurrentTime(),
            end: wavesurferRef.wavesurfer.getCurrentTime() + 10,
            color: 'hsla(100, 100%, 30%, 0.5)',
            drag: false,
            resize: false,
          });

          console.log('Nova regiao', [[...regions, newContentRegion]]);

          registerOverEvent(newRegion, [...regions, newContentRegion]);

        }}>Add Region</button>
      </div>

      <div style={{ marginBottom: 36, marginTop: 36 }}>
        <button onClick={() => {
          wavesurferRef.wsRegions.addRegion({
            start: wavesurferRef.wavesurfer.getCurrentTime(),
            color: '#000000',
            drag: false,
            resize: false
          });
        }}>Add Marker</button>

      </div>

      <div style={{ marginBottom: 36, marginTop: 36 }}>
        <button onClick={() => {
          setZoom(Math.random());
        }}>Atualizando estado</button>

      </div>

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

      <div style={{ marginBottom: 36, marginTop: 36 }}>
        <button onClick={() => {
          console.log('wavesurferRef', wavesurferRef)
          wavesurferRef.wsRegions.clearRegions();
          wavesurferRef.minimapRegions.clearRegions();
        }}>Remove all regions</button>
      </div>

      <div style={{ marginBottom: 36, marginTop: 36 }}>
        <button onClick={() => {
          wavesurferRef.wsRegions.wavesurfer.play();
        }}>Play</button>

      </div>

      <div style={{ marginBottom: 36, marginTop: 36 }}>
        <button onClick={() => {
          wavesurferRef.wsRegions.wavesurfer.pause();
        }}>Pause</button>

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

    </div>
  );
};