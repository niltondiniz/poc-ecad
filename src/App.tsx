import { useState, useCallback, useEffect } from 'react';
import "rsuite/dist/rsuite.min.css";
import { WaveSurferPlayer } from './components/wavesurferplayer.component';
import { Slider } from 'rsuite';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MediaControlsComponent from './components/mediacontrols.component';
import CustomizedTables from './components/data-table.component';
import { RegionInfo } from './interfaces/region-info.interface';
import { formatTime } from './utils/helpers';
import { listaDeMusicasRockAnos80 } from './utils/consts';

export const App = () => {

  const [peaks, setPeaks] = useState([0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [regionInfo, setRegionInfo] = useState<RegionInfo[]>([]);
  const [selectedRow, setSelectedRow] = useState(undefined);
  const [mouseOverRegion, setMouseOverRegion] = useState<RegionInfo | null>(null);

  //Esta função é responsável por obter a referência do componente WaveSurferPlayer
  function getWavesurferPlayerRef(ref) {
    setWavesurfer(ref);
  }

  function playRegion(startTime: number) {
    //wavesurfer.wavesurfer.setTime(startTime);
    wavesurfer.wavesurfer.play();
  }

  function setTimeToRegion(startTime: number) {
    wavesurfer.wavesurfer.setTime(startTime);
  }

  useEffect(() => {
    //Carregando os peaks para exibir o waveform    
    fetch(`http://localhost:3001/download/audio2.json`)
      .then(response => response.json())
      .then(data => {
        setPeaks(data.data);
      });
  }, []);

  const registerUpdateRegionEvent = useCallback((region, regionsArray) => {
    region.on('update', () => {
      // Encontrar a região no state regionInfo que está sendo atualizada pelo id
      const regionToUpdate = regionsArray.find(regionData => regionData.id === region.id);

      // Atualizar o inicio e fim da região
      if (regionToUpdate) {
        const updatedRegion = {
          ...regionToUpdate, // Copie todas as propriedades existentes
          start: region.start,
          end: region.end,
          duration: region.end - region.start,
        };

        // Crie uma nova cópia do array com a região atualizada
        const updatedRegionsArray = regionsArray.map(regionData => {
          if (regionData.id === region.id) {
            return updatedRegion;
          }
          return regionData;
        });

        // Atualize o state regionInfo com a nova cópia do array
        setRegionInfo(updatedRegionsArray);

      }
    });

  }, []);

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
        wavesurferHeight={200}
        wavesurferFillParent={true}
        wavesurferWaveColor="#1976d2"
        wavesurferProgressColor="#f0901387"
        url={"audio_.mp3"}
        peaks={peaks}
        wavesurferCursorColor="#1f1e1e"
        wavesurferMediaControls={false}
        loadingComponent={loadingComponent}
        onTimeUpdate={setCurrentTime}
        showInnerCurrentTime={false}
        onPlay={setIsPlaying}
        wavesurferBarWidth={2}
        timelinePrimaryLabelInterval={3600}
        regionInfo={regionInfo}
        mouseOverRegion={mouseOverRegion}
        setMouseOverRegion={setMouseOverRegion}
        setRegionInfo={setRegionInfo}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        onRegionIn={(region) => { setSelectedRow(region.id) }}
      />

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h5" display="block" gutterBottom>
          {formatTime(currentTime)}
        </Typography>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

        {/* <Button variant="contained" style={{ margin: 16 }} onClick={onUrlChange}>Carregar áudio</Button> */}
        <div style={{ margin: 16 }}>

          <Button variant="contained" onClick={() => {

            const idNewRegion = Math.floor(Math.random() * 10);
            const randomNumber = Math.floor(Math.random() * 10);

            const regionData = {
              id: idNewRegion,
              start: wavesurfer.wavesurfer.getCurrentTime(),
              end: wavesurfer.wavesurfer.getCurrentTime() + 10000,
              duration: 10000,
              title: listaDeMusicasRockAnos80[randomNumber].title,
              author: listaDeMusicasRockAnos80[randomNumber].author,
              showTooltip: true
            }

            setRegionInfo([...regionInfo, regionData]);
            wavesurfer.addRegion(regionData);

          }}>Add Region</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            wavesurfer.wsRegions.clearRegions();
            wavesurfer.minimapRegions.clearRegions();
            setRegionInfo([]);
          }}>Remove all regions</Button>
        </div>

        <div style={{ margin: 16 }}>
          <Button variant="contained" onClick={() => {
            const gaps = wavesurfer.findRegionGaps(wavesurfer.wavesurfer.getDuration());
            if (gaps.length > 0) {
              wavesurfer.setZoomOnGap(gaps[0]);
            }
          }}>Find gaps</Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ margin: 16, width: 500 }}>
          <Slider
            defaultValue={0}
            min={0}
            max={20}
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
      <div style={{ marginTop: 16 }}>
        <CustomizedTables regions={regionInfo} playRegion={playRegion} setTimeToRegion={setTimeToRegion} selectedRow={selectedRow} />
      </div>
    </div >
  );
};

