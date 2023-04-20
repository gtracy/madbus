import React, {useState,useEffect} from 'react';

import RefreshTimer from './components/RefreshTimer';
import StopList from './components/StopList';
import Arrival from './components/Arrival';
import UserSettings from './components/UserSettings';

import { makeStyles } from '@mui/styles';
import { AppBar, Box, Toolbar, Container } from '@mui/material';
import TimelapseIcon from '@mui/icons-material/Timelapse';


import TransitAPI from './transit-api';
const transit = new TransitAPI('fixme');

const useStyles = makeStyles({
    timer: {
    },
})

export default function App()  {
    const [activeStop,setActiveStop] = useState(7777);

    const classes = useStyles();

    const state = {
        stopid : '1100',
        stop_location : "E Mifflin & N Pinckney (WB)",
        arrivals : {
            status : 0,
            timestamp : "unknown",
            routes : []
        },
        user : {
            bookmarks : [activeStop,"0100","1100","1505","1878"]
        }
    };

    function getStopList() {
        return state.user.bookmarks;
    }

    return(<div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static"
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <StopList
                        bookmarks={state.user.bookmarks}
                        handleSelection={setActiveStop}
                    />
                    <TimelapseIcon 
                      fontSize="large"
                    />
                </Toolbar>
            </AppBar>
        </Box>

        <Arrival value={activeStop}/>

        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            feedback
          </Toolbar>
        </AppBar>

    </div>)

}