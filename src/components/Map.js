
import React from 'react';
import { useEffect, useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker, TransitLayer, InfoWindow } from "@react-google-maps/api";
import { mapStyle } from "../map_style";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

import TransitAPI from '../transit-api';
const transit = new TransitAPI('nomar');


async function fetchStopDetails(placeId) {
}
  
export default function Map(user) {
    const markerIcon = "/img/black-outline.png";
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl:true,
        styles: mapStyle
    }
    const [stops,setStops] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [center, setCenter] = useState({ lat:43.0731,lng:-89.3911 }); // initial center location

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBkV6li0Y-jN20Hb4zqprY0fsrogRX5LiM",
    });

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
      };
    
      const handleCloseInfoWindow = () => {
        setSelectedMarker(null);
      };
  
    useEffect( () => {
        transit.getStops()
            .then(result => {
                setStops(result);
            })
            .catch(error => {
                // no-op
            })
    },[stops])

    if(!isLoaded) return <div>loading...</div>;

    return(
        <div>
            <GoogleMap 
                zoom={15} 
                center={center}
                mapContainerClassName='map-container'
                options={mapOptions}
                clickableIcons={false}
            >
                {stops.map((s) => (
                    <Marker
                      onClick={() => handleMarkerClick(s)}
                      key={s.stopID}
                      position={{lat:parseFloat(s.lat),lng:parseFloat(s.lon)}}
                      icon={{url:markerIcon,scaledSize:new window.google.maps.Size(25,15)}}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={{lat:parseFloat(selectedMarker.lat),lng:parseFloat(selectedMarker.lon)}}
                        onCloseClick={handleCloseInfoWindow}
                    >
                        <div>
                            <h2>{selectedMarker.stopID}</h2>
                            <p>{selectedMarker.intersection}</p>
                            <p>{selectedMarker.direction}</p>
                        </div>
                    </InfoWindow>
                )}

                {/* <InfoWindow
                    onClick={stopClick}
                /> */}

            </GoogleMap>
        </div>
    )
}
