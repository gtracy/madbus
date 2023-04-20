import React, {useState,useEffect} from 'react';

import RefreshTimer from './components/RefreshTimer';
import StopList from './components/StopList';
import Arrival from './components/Arrival';
import UserSettings from './components/UserSettings';

import { makeStyles } from '@mui/styles';
import { AppBar, Box, Toolbar, Container } from '@mui/material';
import TimelapseIcon from '@mui/icons-material/Timelapse';


const useStyles = makeStyles({
    timer: {
    },
})

export default function App()  {
    const [bookmarks,updateBookmarks] = useState([
        {stopid:"0100",intersection:"Main & West"},
        {stopid:"1100",intersection:"Main & East"},
        {stopid:"1505",intersection:"Chuch & Main"},
        {stopid:"1878",intersection:"Prospect & Church"}
    ]);
    const [activeStopIndex,setActiveStopIndex] = useState(0);


    const classes = useStyles();

    return(<div>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar 
                position="static"
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <StopList
                        bookmarks={bookmarks}
                        activeStopIndex={activeStopIndex}
                        handleSelection={setActiveStopIndex}
                    />
                    <TimelapseIcon 
                      fontSize="large"
                    />
                </Toolbar>
            </AppBar>
        </Box>

        <Arrival activeStop={bookmarks[activeStopIndex]}/>

        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            feedback
          </Toolbar>
        </AppBar>

    </div>)

}