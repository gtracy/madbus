import React, {useState,useEffect,useCallback} from 'react';

import RefreshTimer from './components/RefreshTimer';
import StopList from './components/StopList';
import Arrival from './components/Arrival';

import { makeStyles } from '@mui/styles';
import { AppBar, Box, Toolbar } from '@mui/material';
import { IconButton } from '@mui/material';

const useStyles = makeStyles({
    timer: {
    },
})

export default function App()  {

    const [activeStopID,setActiveStopID] = useState('0100');
    const [refreshFlag, setRefreshFlag] = useState(false);

    const handleRefresh = useCallback(() => {
        setRefreshFlag(!refreshFlag);
        console.log('setting refresh flag?!?');
      }, [refreshFlag]);
        
    useEffect(() => {
      // put any code that needs to be executed on refresh here
      console.log('trigger App refresh!');
    }, [refreshFlag]);
  
    const classes = useStyles();

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
            feedback
          </Toolbar>
        </AppBar>

    </div>)

}