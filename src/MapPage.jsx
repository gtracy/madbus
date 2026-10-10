
import MapComponent from './components/Map';
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { gaEvents } from './analytics';


export default function MapPage()  {
    const navigate = useNavigate();

    const handleDoneClick = (event) => {
        gaEvents.buttonClick("map page exit");
        navigate('/');
    }

    return(<div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static"
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        onClick={handleDoneClick}
                    >
                    <ArrowBackIosNewIcon color="secondary"/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <MapComponent />

    </div>)

}