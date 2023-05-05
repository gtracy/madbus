import React from 'react';
import { useState, useEffect } from 'react';

import { Box, Typography, LinearProgress } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import { makeStyles } from '@mui/styles';

import TransitAPI from '../transit-api';
const transit = new TransitAPI('nomar');

const MAX_ARRIVALS_SHOWN = 6;

const useStyles = makeStyles({
    containerDetails: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        padding: 0,
        margin: 0,
        lineHeight: .5
    }
});

const prettyDestination = (destination) => {
    let new_destination = destination.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    if (new_destination.includes("Via")) {
        const index = new_destination.indexOf("Via");
        new_destination = new_destination.slice(0, index) + "via" + new_destination.slice(index + 3);
    }
            
    return new_destination;

}

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
    let more_coming = false;
    routes.forEach((r,index) => {
        // skip the first entry which is already displayed
        // in ArrivalCountdown component
        if( index === 0 ) return;
        if( index >= MAX_ARRIVALS_SHOWN ) {
            more_coming = true;
            return;
        }
        if( r.minutes > 50 ) return;

        const key = r.routeID+"."+r.minutes;
        arrivals.push(
            <React.Fragment key={key}>
            <tr sx={{ padding:'0px',margin:'0px'}}>
                <td>
                    <Typography variant="h7"
                       sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        route {r.routeID}
                    </Typography>
                    <Typography variant="h5"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {r.minutes}min
                    </Typography>
                </td>
                <td>
                    <ArrowRight fontSize="small"
                    sx={{ minWidth: '20px'}}
                    />
                </td>
                <td>
                    <Typography variant="body2">
                        {prettyDestination(r.destination)}
                    </Typography>
                </td>
            </tr>
            <tr sx={{ padding:'0px',margin:'0px'}}>
                <td colSpan={3}>
                    <hr style={{padding:0,margin:0}}/>
                </td>
            </tr>
            </React.Fragment>
        );
    });
    if( more_coming ) {
        arrivals.push(
            <tr key={'more-coming'} sx={{ padding:'0px',margin:'0px'}}>
                <td colSpan={3}>
                    <Typography variant="subtitle2"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        ... more coming ...
                    </Typography>
                </td>
            </tr>
        )
    }

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

export default function Arrival({activeStopID,refresh}) {
    const [arrivals,setArrivals] = useState({"status":-1});
    const [loading,setLoading] = useState(true);

    const classes = useStyles();

    useEffect( () => {
        setLoading(true);
        transit.getArrivals(activeStopID)
          .then(result => {
            setArrivals(result)
          })
          .catch(error => {
            console.error("error loading arrival data");
            console.dir(error);
          })
          .finally(() => {
            setLoading(false);
          });
    },[activeStopID,refresh])

    return (
        <Box
            display="flex"
            flexDirection="column"
            sx={{
                bgcolor: '#0fe8fc',
                marginTop: '5vh',
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
