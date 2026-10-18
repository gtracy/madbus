import React, { Suspense, lazy } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrivalPage from './ArrivalPage';
const MapPage = lazy(() => import('./MapPage'));
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
        default: '#1f355a',
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
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<ArrivalPage/>}/>
              <Route path="/map" element={<MapPage/>}/>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </BookmarkProvider>

    </ThemeProvider>
  );
}
