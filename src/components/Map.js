
import React from 'react';
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { mapStyle } from "../map_style";

// AIzaSyBkV6li0Y-jN20Hb4zqprY0fsrogRX5LiM

async function fetchStopDetails(placeId) {
  }
  
export default function Map(user) {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBkV6li0Y-jN20Hb4zqprY0fsrogRX5LiM",
    });

    const transitClick = (event) => {
        const place = fetchStopDetails(event.placeId);
        console.dir(place);
        if( place.types.indexOf('transit_station') !== -1) {
            console.log(place.place_id);
        }
    };

    const mapOptions = {
        disableDefaultUI: true,
        zoomControl:true,
        styles: mapStyle
    }
    if(!isLoaded) return <div>loading...</div>;
    return(
        <div>
            <GoogleMap 
                zoom={15} 
                center={{lat:43.0731,lng:-89.3911}}
                mapContainerClassName='map-container'
                options={mapOptions}
                clickableIcons={false}
                onClick={transitClick}
            >

            </GoogleMap>
        </div>
    )
}
