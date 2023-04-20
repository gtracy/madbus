import React from 'react';
import { useState, useEffect, setLoading } from 'react';

import TransitAPI from '../transit-api';

import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { makeStyles } from '@mui/styles';

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
            <Typography variant="body2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
                Route {route}<ArrowRight fontSize="small"/>{destination}
            </Typography>

            <Typography variant="h1">
                {minutes}
            </Typography>
            <Typography variant="caption">minutes</Typography>

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
    const [arrivals,setArrivals] = useState({"status":-1});
    const [loading,setLoading] = useState(true);
    const [nextArrival,setNextArrival] = useState('--');
    const [nextRoute,setNextRoute] = useState(' ');
    const [nextDestination,setNextDestination] = useState(' ');

    const classes = useStyles();
    const transit = new TransitAPI('nomar');

    // stub the inputs for children components
    const route = 3;
    const arrivalMinutes = activeStop.stopid.slice(0,2);
    const destination = 'Wisconsin Capital';

    useEffect( () => {
        transit.getArrivals(activeStop.stopid)
          .then(result => {
            setArrivals(result)
            if( result.length > 0 ) {
                //nextArrival = result[0].minutes;
                if( result[0].minutes === 0 ) {
                    setNextArrival('here!');
                } else {
                    setNextArrival(result[0].minutes);
                }
                setNextRoute(result[0].routeID);
                setNextDestination(result[0].destination);
            }
          })
          .catch(error => {
            console.error("error loading arrival data");
            console.dir(error);
          })
          .finally(() => {
            setLoading(false);
            console.log('loaded!');
          })
    },[])


    const upcoming = [
        {route:"80",minutes:9,dest:"Green Bay"},
        {route:"05",minutes:11,dest:"Airport"},
        {route:"11",minutes:22,dest:"East Town Mall"},
        {route:"02",minutes:33,dest:"Willy Street"}
    ];
    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                bgcolor: '#0fe8fc',
                marginTop: '10vh',
            }}
        >
            {loading ? (
                <LinearProgress className={classes.containerDetails}/>
            ) : (<div>
            <ArrivalCountdown route={nextRoute} minutes={nextArrival} destination={nextDestination}/>
            <UpcomingArrivals routes={upcoming}/>
            </div>)}
        </Box>
    )
}
