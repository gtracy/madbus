import { Container, Box, Typography } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles({
    containerDetails: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function ArrivalCountdown({route,minutes,destination}) {
    const classes = useStyles();

    return(
        <Box 
            display="flex" 
            flexDirection="column"
            className={classes.containerDetails}
            sx={{ 
                bgcolor: '#0fe00f',
            }}
        >
            <Typography variant="h1">
                {minutes}
            </Typography>

            <Typography variant="body2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
                {route}<ArrowRight fontSize="small"/>{destination}
            </Typography>

        </Box>
    )
}

function UpcomingArrivals({routes}) {
    const classes = useStyles();

    let arrivals = [];
    routes.forEach((r) => {
        const key = r.route+"."+r.minutes;
        arrivals.push(
            <tr key={key}>
                <td>
                    <Typography variant="h5"
                       sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        {r.route} <ArrowRight fontSize="small"/>
                    </Typography>
                </td>
                <td>
                    <Typography variant="h5">
                        {r.dest}
                    </Typography>
                </td>
            </tr>
        );
    });

    return(
        <Box 
            display="flex" 
            flexDirection="column"
            className={classes.containerDetails}
        >
        <table>
            <tbody>
                {arrivals}
            </tbody>
        </table>
        </Box>
    )
}

export default function Arrival({activeStop}) {
    const classes = useStyles();

    // stub the inputs for children components
    const route = 3;
    const arrivalMinutes = activeStop.stopid.slice(0,2);
    const destination = 'Wisconsin Capital';


    const upcoming = [
        {route:"80",minutes:9,dest:"Green Bay"},
        {route:"05",minutes:11,dest:"Airport"},
        {route:"11",minutes:22,dest:"East Town Mall"},
        {route:"02",minutes:33,dest:"Willy Street"}
    ];
    return (
        <Box display="flex" flexDirection="column"

              sx={{ 
                bgcolor: '#0fe8fc',
                marginTop: '10vh',
                
              }}
            >
              <ArrivalCountdown route={route} minutes={arrivalMinutes} destination={destination}/>
              <UpcomingArrivals routes={upcoming}/>
            </Box>
    )
}
