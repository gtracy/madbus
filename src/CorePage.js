import React, {useState,useEffect,useCallback} from 'react';

import RefreshTimer from './components/RefreshTimer';
import StopList from './components/StopList';
import Arrival from './components/Arrival';

import { AppBar, Box, Toolbar, IconButton, Typography } from '@mui/material';

export default function CorePage()  {

    const [activeStopID,setActiveStopID] = useState('0100');
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleRefresh = useCallback(() => {
        setRefreshFlag(!refreshFlag);
      }, [refreshFlag]);
        
    useEffect(() => {
    }, [refreshFlag]);
  
    return(<div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static"
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <StopList
                        handleSelection={setActiveStopID}
                    />
                    <IconButton>
                      <RefreshTimer handleRefresh={handleRefresh}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>

        <Arrival activeStopID={activeStopID} refresh={refreshFlag}/>

        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            <Typography variant="subtitle2">
              please send me your feedback <span>&#x1F64F;</span>
            </Typography>
          </Toolbar>
        </AppBar>

    </div>)

}