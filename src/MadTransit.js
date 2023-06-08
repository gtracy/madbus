import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrivalPage from './ArrivalPage';
import MapPage from './MapPage';
import { BookmarkProvider } from './bookmarks';


const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1f355a',
      },
      secondary: {
        main: '#BDF7C1',
      },
      background: {
        default: '#1D2D44',
      },
      error: {
        main: '#c6d21a',
      },
      text: {
        primary: '#f0ebd8',//#ffebee',
        secondary: '#ffebee', //'#81f786',
        disabled: 'rgba(241,166,166,0.38)',
        hint: '#f7e22e',
      },
      },
    typography: {
      h1: {
        fontSize: '8.2rem',
        fontWeight: 700,
        lineHeight: 0.75,
        paddingTop: '16px'
      },
    },
});

export default function MadTransit() {

  return (
    <ThemeProvider theme={theme}>

      <BookmarkProvider>
        <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<ArrivalPage/>}/>
              <Route path="/map" element={<MapPage/>}/>
            </Routes>
        </BrowserRouter>
      </BookmarkProvider>

    </ThemeProvider>
  );
}
