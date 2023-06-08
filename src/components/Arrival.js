import React from 'react';
import { useState, useEffect } from 'react';

import { Box, Typography, LinearProgress } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { makeStyles } from '@mui/styles';

import TransitAPI from '../transit-api';
const transit = new TransitAPI('madbus');

const MAX_ARRIVALS_SHOWN = 20;
const MAX_MiNUTES_SHOWN = 45;

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
    },
    largeIcon: {
        height: 96,
        width: 96
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
    let minutes = undefined;
    let minuteLabel = 'minutes';

    if( routes.length > 0 ) {
        if( routes[0].minutes === 0 ) {
            minutes = 'here!';
            minuteLabel = '';
        } else {
            minutes = routes[0].minutes;
            if( minutes === 1 ) {
                minuteLabel = 'minute';
            }
        }
        routeid = routes[0].routeID;
        destination = routes[0].destination;
    }


    return(<Box>
        {minutes
            ? <Box mt={0} mb={2}
                display="flex" 
                flexDirection="column"
                className={classes.containerDetails}
                >
                <Typography variant="body2"
                    sx={{ display: 'flex', alignItems: 'center', maxWidth:'60hw' }}
                >
                    Route {routeid}<ArrowRight fontSize="small"/>{prettyDestination(destination)}
                </Typography>

                <Typography variant="h1">{minutes}</Typography>
                <Typography variant="caption">{minuteLabel}</Typography>
            </Box>
            : <Box
                display="flex" 
                flexDirection="column"
                className={classes.containerDetails}
              >
                <SentimentVeryDissatisfiedIcon className={classes.largeIcon}/>
                <Typography variant="subtitle1">no routes coming at this stop currently</Typography>
            </Box>
        }
    </Box>)
}

function UpcomingArrivals({routes}) {
    const classes = useStyles();

    let arrivals = [];
    let more_coming = false;
    
    routes.forEach((r,index) => {
        let show_clock = false;

        // skip the first entry which is already displayed
        // in ArrivalCountdown component
        if( index === 0 ) return;
        if( index >= MAX_ARRIVALS_SHOWN ) {
            more_coming = true;
            return;
        }
        if( r.minutes > MAX_MiNUTES_SHOWN ) {
            show_clock = true;
        }

        const key = r.routeID+"."+r.minutes;
        arrivals.push(
            <React.Fragment key={key}>
                <tr>
                    <td colSpan={4}>
                        <hr />
                    </td>
                </tr>
                <tr>
                    <td>
                        <Typography variant="h6"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <DirectionsBusIcon size="small"/> {r.routeID}
                        </Typography>
                    </td>
                    <td>
                        <ArrowRight
                            fontSize="medium"
                            sx={{ minWidth: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                        />
                    </td>
                    <td>
                        <Typography variant="body2" sx={{maxWidth:'40vw'}}>
                            {prettyDestination(r.destination)}
                        </Typography>
                    </td>
                    <td>
                        {show_clock ?
                            <Typography variant="body"
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {r.arrivalTime}
                            </Typography>
                        :
                            <Typography variant="h5"
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {r.minutes} min
                            </Typography>
                }
                    </td>
                </tr>
            </React.Fragment>
        );
    });

    if( more_coming ) {
        arrivals.push(
            <React.Fragment key={more_coming}>
            <tr>
                <td colSpan={4}>
                    <hr />
                </td>
                </tr>
            <tr key={'more-coming'} sx={{ padding:'0px',margin:'0px'}}>
                <td colSpan={4}>
                    <Typography variant="subtitle2"
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        ... more coming ...
                    </Typography>
                </td>
            </tr>
            </React.Fragment>
        )
    }

    return(
        <Box 
            display="flex" 
            flexDirection="column"
            className={classes.containerDetails}
            sx={{marginTop:2}}
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
                marginTop: '3vh',
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
