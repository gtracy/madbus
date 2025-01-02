
import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Typography, Button } from '@mui/material';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

import { useBookmarks } from '../bookmarks';
import { gaEvents } from '../analytics';

import { mapStyle } from "../map_style";

import TransitAPI from '../transit-api';
const transit = new TransitAPI('madbus');
const MADISON_MAP_CENTER = { lat:43.0731,lng:-89.3911 };


export default function Map(user) {
    const markerIcon = "/img/black-outline.png";
    const activeIcon = "/img/red-outline.png";      
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl:true,
        mapId: "cfc5ed8b557fa102"
        //styles: mapStyle
    };      

    const { bookmarks, setBookmarks } = useBookmarks();
    const [stops,setStops] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [center, setCenter] = useState(MADISON_MAP_CENTER);
    const [blueDotIcon, setBlueDotIcon] = useState({
        url: `data:image/svg+xml;utf-8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196f3" width="24" height="24"><path d="M0 0h24v24H0V0z" fill="none" /><circle cx="12" cy="12" r="8" /></svg>`
        )}`});

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBkV6li0Y-jN20Hb4zqprY0fsrogRX5LiM",
    });

    const handleMarkerClick = (marker) => {
        gaEvents.buttonClick("map marker open");

        setSelectedMarker(marker);
    };
    
    const handleCloseInfoWindow = () => {
        gaEvents.buttonClick("map marker close");

        setSelectedMarker(null);
    };

    const updateBookmarks = (stopList) => {
        gaEvents.buttonClick("map bookmark edit");

        setBookmarks(stopList);
    };
    
    useEffect( () => {
        transit.getStops()
            .then(result => {
                setStops(result);
            })
            .catch(error => {
                console.log('ERROR: unable to load stop data');
                gaEvents.eventOccurred('stop data load fail');
            })

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error retrieving user location:", error);
                }
            );
        }
        if( isLoaded ) {
            setBlueDotIcon({
                url: `data:image/svg+xml;utf-8,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2196f3" width="24" height="24"><path d="M0 0h24v24H0V0z" fill="none" /><circle cx="12" cy="12" r="8" /></svg>`
                )}`,
                scaledSize: new window.google.maps.Size(22, 22)
            });
        }    
          
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
                {center !== MADISON_MAP_CENTER && (
                    <Marker position={center} icon={blueDotIcon} />
                )}

                {stops.map((s) => {
                    const iconImage = bookmarks.find((bookmark) => bookmark.stopID === s.stopID) 
                        ? activeIcon 
                        : markerIcon;

                    return(
                        <Marker
                            onClick={() => handleMarkerClick(s)}
                            key={s.stopID}
                            position={{lat:parseFloat(s.lat),lng:parseFloat(s.lon)}}
                            icon={{url:iconImage,scaledSize:new window.google.maps.Size(32,21.65)}}
                        />
                    )
                })}

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
                                Stop #{selectedMarker.stop_code}
                            </Typography>

                            {bookmarks.find((bookmark) => bookmark.stopID === selectedMarker.stopID) ? (<div>
                                <Button
                                    sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                    color="primary"
                                    onClick={() => updateBookmarks(bookmarks.filter(bookmark => bookmark.stopID !== selectedMarker.stopID))}
                                >
                                    <BookmarkAddedIcon
                                        fontSize="medium"
                                        color="success"
                                    />
                                    <Typography variant="caption" ml={.5}>
                                        <span style={{ color: 'grey' }}>remove</span>
                                    </Typography>
                                </Button>
                            </div>) : (<div>
                                <Button
                                    sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                    color="primary"
                                    onClick={() => updateBookmarks([...bookmarks, selectedMarker])}
                                >
                                    <BookmarkAddIcon
                                        fontSize="medium"
                                        color="action"
                                    />
                                    <Typography variant="caption" ml={.5}>
                                        add
                                    </Typography>
                                </Button>
                            </div>)}
                        </div>
                    </InfoWindow>
                )}

            </GoogleMap>
        </div>
    )
}
