import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ArrivalPage from './ArrivalPage';
import MapPage from './MapPage';
import { BookmarkProvider } from './bookmarks';


export default function MadBus() {

  return (
    <BookmarkProvider>
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<ArrivalPage/>}/>
            <Route path="/map" element={<MapPage/>}/>
          </Routes>
      </BrowserRouter>
    </BookmarkProvider>
  );
}
