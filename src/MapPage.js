
import Map from './components/Map';
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Toolbar, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


export default function MapPage()  {
    const navigate = useNavigate();

    const handleDoneClick = (event) => {
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
                    <ArrowBackIosNewIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Map />

    </div>)

}