import React, {useState,useEffect,useCallback} from 'react';

import RefreshTimer from './components/RefreshTimer';
import StopList from './components/StopList';
import Arrival from './components/Arrival';
import InstallPWA from './components/InstallPWA';

import { AppBar, Box, Toolbar, IconButton, Typography } from '@mui/material';

export default function ArrivalPage()  {

    const [activeStopID,setActiveStopID] = useState('0100');
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleRefresh = useCallback(() => {
        setRefreshFlag(!refreshFlag);
      }, [refreshFlag]);
        
    useEffect(() => {
    }, [refreshFlag]);
  
    return(  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <AppBar 
                position="fixed"
                elevation={0}
            >
                <Toolbar sx={{ padding:0, margin:0,justifyContent: 'space-between' }}>
                    <StopList
                        handleSelection={setActiveStopID}
                    />
                    <IconButton>
                      <RefreshTimer handleRefresh={handleRefresh}/>
                    </IconButton>
                </Toolbar>
            </AppBar>

        <Box sx={{ flexGrow: 1, maxHeight:'92vh',overflowY: 'auto', paddingTop: '70px' }}>
          <Arrival activeStopID={activeStopID} refresh={refreshFlag}/>
        </Box>

        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar 
            variant="dense"
            sx={{ padding:0, paddingLeft:1, margin:0,justifyContent: 'space-between' }}
          >
            <Typography variant="subtitle2">
              <a href="mailto:gtracy+madtransit@gmail.com?subject=MadTransit feedback">feedback</a> <span>&#x1F64F;</span>
            </Typography>

            <InstallPWA/>
          </Toolbar>
        </AppBar>
      </div>
    )

}