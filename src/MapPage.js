
import Map from './components/Map';

import { AppBar, Box, Toolbar, IconButton } from '@mui/material';


export default function MapPage()  {

    return(<div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static"
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton>
                      done
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
        <Map />

    </div>)

}