
import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Typography, Button } from '@mui/material';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

import { useBookmarks } from '../bookmarks';

import { mapStyle } from "../map_style";

import TransitAPI from '../transit-api';
const transit = new TransitAPI('madbus');
const MADISON_MAP_CENTER = { lat:43.0731,lng:-89.3911 };

export default function Map(user) {
    const markerIcon = "/img/black-outline.png";
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl:true,
        styles: mapStyle
    }

    const { bookmarks, setBookmarks } = useBookmarks();
    const [stops,setStops] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [center] = useState(MADISON_MAP_CENTER);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBkV6li0Y-jN20Hb4zqprY0fsrogRX5LiM",
    });

    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };
    
    const handleCloseInfoWindow = () => {
        setSelectedMarker(null);
    };

    const updateBookmarks = (stopList) => {
        console.dir(stopList.length);
        setBookmarks(stopList);
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
                            <Typography variant="h6">
                                {selectedMarker.intersection}
                            </Typography>
                            <Typography variant="subtitle1">
                                {selectedMarker.direction}
                            </Typography>
                            <Typography variant="subtitle2">
                                Stop #{selectedMarker.stopID}
                            </Typography>
                            <Button
                                sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                color="primary"
                                onClick={() => updateBookmarks([...bookmarks, selectedMarker])}
                            >
                                <BookmarkAddIcon
                                    sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                    fontSize="medium"/> Bookmark
                            </Button>
                        </div>
                    </InfoWindow>
                )}

            </GoogleMap>
        </div>
    )
}
