import React from 'react';
import { useState, useEffect } from 'react';

import { Box, Typography, LinearProgress } from '@mui/material';
import ArrowRight from '@mui/icons-material/ArrowRight';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import TransitAPI from '../transit-api';
const transit = new TransitAPI();

const MAX_ARRIVALS_SHOWN = 20;
const MAX_MiNUTES_SHOWN = 45;

const prettyDestination = (destination) => {
    let new_destination = destination.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    if (new_destination.includes("Via")) {
        const index = new_destination.indexOf("Via");
        new_destination = new_destination.slice(0, index) + "via" + new_destination.slice(index + 3);
    }
            
    return new_destination;

}

function ArrivalCountdown({routes}) {
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


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {minutes
                ? <Box
                    sx={{
                        mt: 0,
                        mb: 2,
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    <Typography variant="body2"
                        sx={{ display: 'flex', alignItems: 'center', maxWidth:'60vw' }}
                    >
                        Route {routeid}<ArrowRight fontSize="small" sx={{ mx: 0.5 }}/>{prettyDestination(destination)}
                    </Typography>

                    <Typography variant="h1">{minutes}</Typography>
                    <Typography variant="caption">{minuteLabel}</Typography>
                </Box>
                : <Box
                    sx={{
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                  >
                    <SentimentVeryDissatisfiedIcon sx={{ height: 96, width: 96 }}/>
                    <Typography variant="subtitle1">no routes coming at this stop currently</Typography>
                </Box>
            }
        </Box>
    )
}

function UpcomingArrivals({routes}) {
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
                            <DirectionsBusIcon fontSize="small" sx={{ mr: 0.5 }}/> {r.routeID}
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
                            <Typography variant="body2"
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
            sx={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginTop: 2,
                width: '100%',
            }}
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
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '3vh',
                width: '100%',
            }}
        >
            {loading ? (
                <LinearProgress sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}/>
            ) : (<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <ArrivalCountdown routes={arrivals}/>
                <UpcomingArrivals routes={arrivals}/>
            </Box>)}
        </Box>
    )
}
