import React from 'react';
import { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AutoModeIcon from '@mui/icons-material/AutoMode';

import { gaEvents } from '../analytics';

const REFRESH_RATE = 30; // 30 seconds

function prettyProgressLabel(progress) {
  // progress is a value between 0 - 100
  // invert it so it appears like a countdown timer
  // with REFRESH_RATE at the top
  return (REFRESH_RATE - Math.round((progress/100)*REFRESH_RATE));
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress 
        variant="determinate"
        color="secondary"
        {...props} 
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        { (props.value > 99 ) ?
          <AutoModeIcon color="secondary"/>
        :
          <Typography variant="caption" component="div" color="text.secondary">
            {prettyProgressLabel(props.value)}
          </Typography>
        } 
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function RefreshTimer({handleRefresh}) {
  const [progress, setProgress] = useState(0);

  // the refresh rate is a clock value, but the progress
  // circle is based on a "percentage complete" 0-100
  const computeProgress = (prevProgress) => {
    return (prevProgress >= 100) ? 0 : prevProgress + 1;
  }

  useEffect(() => {
    const timer = setInterval(() => {
        let newProgress = computeProgress(progress);
        if( newProgress === 0 ) {
          gaEvents.eventOccurred("arrival refresh");
          handleRefresh(true);
        }
        setProgress(newProgress);
      }, 1000);
    return () => {
      clearInterval(timer);
    };
  });

  return <CircularProgressWithLabel value={progress} icon="check"/>;
}