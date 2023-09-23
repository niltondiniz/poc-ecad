import { Slider } from "rsuite";
import { WaveSurferPlayer } from "./components/wavesurferplayer.component";
import "rsuite/dist/rsuite.min.css";
import { Typography } from "@mui/material";
import { useState } from "react";
import MediaControlsComponent from "./components/mediacontrols.component";


export default function MinimalComponent() {

    let wavesurferRef = null;
    const [isPlaying, setIsPlaying] = useState(false);
    const [wavesurfer, setWavesurfer] = useState(null);

    const setWavesurferRef = (ref) => {
        wavesurferRef = ref;
        setWavesurfer(ref);
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

            <MediaControlsComponent wavesurfer={wavesurfer} isPlaying={isPlaying} />

        </div>

    )
}