import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CorePage from './CorePage';
import MapPage from './MapPage';


export default function MadBus() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<CorePage/>}/>

          <Route path="/map" element={<MapPage/>}/>

        </Routes>
    </BrowserRouter>
  );
}
