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
import { useEffect } from 'react';

interface MediaControlsComponentProps {
    isPlaying: boolean;
    wavesurfer: any;
}

export default function MediaControlsComponent(props: MediaControlsComponentProps) {

    const { isPlaying, wavesurfer } = props;

    useEffect(() => {
    },[isPlaying, wavesurfer]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

            <div style={{ margin: 16 }}>
                <FirstPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.seekTo(0); }} />
            </div>

            <div style={{ margin: 16 }}>
                <FastRewindIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.toPreviousRegion(); }} />
            </div>

            <div style={{ margin: 16 }}>
                {!isPlaying ?
                    <PlayArrowIcon style={{ cursor: 'pointer' }} onClick={() => wavesurfer.wavesurfer.play()} /> :
                    <PauseIcon style={{ cursor: 'pointer' }} onClick={() => wavesurfer.wavesurfer.pause()} />}
            </div>

            <div style={{ margin: 16 }}>
                <FastForwardIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.toNextRegion(); }} />
            </div>

            <div style={{ margin: 16 }}>
                <LastPageIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.seekTo(1); }} />
            </div>

            <div style={{ margin: 16 }}>
                <Replay10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.setTime(wavesurfer.wavesurfer.getCurrentTime() - 10); }} />
            </div>

            <div style={{ margin: 16 }}>
                <Forward10Icon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.setTime(wavesurfer.wavesurfer.getCurrentTime() + 10); }} />
            </div>

            <div style={{ margin: 16 }}>
                <AddIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.setPlaybackRate(wavesurfer.wavesurfer.getPlaybackRate() + 0.1); }} />
            </div>

            <div style={{ margin: 16 }}>
                <RemoveIcon style={{ cursor: 'pointer' }} onClick={() => { wavesurfer.wavesurfer.setPlaybackRate(wavesurfer.wavesurfer.getPlaybackRate() - 0.1); }} />
            </div>

        </div>);
}
