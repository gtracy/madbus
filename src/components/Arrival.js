import React from 'react';
import { useState, useEffect, setLoading } from 'react';

import TransitAPI from '../transit-api';

import { Box, Typography, LinearProgress } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    containerDetails: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

function ArrivalCountdown({routes}) {
    const classes = useStyles();

    let routeid = ' ';
    let destination = ' ';
    let minutes = '--'

    if( routes.length > 0 ) {
        //nextArrival = result[0].minutes;
        if( routes[0].minutes === 0 ) {
            minutes = 'here!';
        } else {
            minutes = routes[0].minutes;
        }
        routeid = routes[0].routeID;
        destination = routes[0].destination;
    }


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
                Route {routeid}<ArrowRight fontSize="small"/>{destination}
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
    routes.forEach((r,index) => {
        // skip the first entry which is already displayed
        // in ArrivalCountdown component
        if( index === 0 ) return;
        if( r.minutes > 50 ) return;

        const key = r.routeID+"."+r.minutes;
        arrivals.push(
            <tr key={key}>
                <td>
                    <Typography variant="subtitle1"
                       sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        Route {r.routeID} in {r.minutes}min <ArrowRight fontSize="small"/>
                    </Typography>
                </td>
                <td>
                    <Typography variant="body2">
                        {r.destination}
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

    const classes = useStyles();
    const transit = new TransitAPI('nomar');

    useEffect( () => {
        transit.getArrivals(activeStop.stopid)
          .then(result => {
            setArrivals(result)
          })
          .catch(error => {
            console.error("error loading arrival data");
            console.dir(error);
          })
          .finally(() => {
            setLoading(false);
            console.log('loaded!');
          })
    },[activeStop])

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
            <ArrivalCountdown routes={arrivals}/>
            <UpcomingArrivals routes={arrivals}/>
            </div>)}
        </Box>
    )
}
