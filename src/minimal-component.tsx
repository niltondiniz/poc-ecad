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

    let wavesurferRef = null;
    const [isPlaying, setIsPlaying] = useState(false);

    const setWavesurferRef = (ref) => {
        wavesurferRef = ref;
    }

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