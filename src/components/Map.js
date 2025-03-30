import { useEffect, useState, useRef } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Typography, Button } from '@mui/material';

import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

import { useBookmarks } from '../bookmarks';
import { gaEvents } from '../analytics';

import TransitAPI from '../transit-api';
const transit = new TransitAPI();
const MADISON_MAP_CENTER = { lat: 43.0731, lng: -89.3911 };

export default function MapComponent(user) {
    const markerIcon = "/img/black-outline.png";
    const activeIcon = "/img/red-outline.png";
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        mapId: process.env.REACT_APP_GOOGLE_MAPS_STYLE_ID
    };

    const { bookmarks, setBookmarks } = useBookmarks();
    const [stops, setStops] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [center, setCenter] = useState(MADISON_MAP_CENTER);
    const [userMoved, setUserMoved] = useState(false);
    const mapRef = useRef(null);

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

    useEffect(() => {
        transit.getStops()
            .then(result => setStops(result))
            .catch(error => {
                console.log('ERROR: unable to load stop data');
                gaEvents.eventOccurred('stop data load fail');
            });

        if (navigator.geolocation && !userMoved) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => console.error("Error retrieving user location:", error)
            );
        }
    }, [stops,userMoved]);

    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <div>
                <Map 
                    defaultZoom={15}
                    defaultCenter={center}
                    style={{ width: "100%", height: "95vh" }}
                    options={mapOptions}
                    onLoad={(map) => {
                        console.log("Map loaded:", map);
                        mapRef.current = map;
                    }}
                    onDrag={() => setUserMoved(true)} // Set userMoved on drag
                    onZoomChanged={() => setUserMoved(true)} // Set userMoved on zoom
                >
                    {center !== MADISON_MAP_CENTER && (
                        <AdvancedMarker position={center}>
                            <img src={`data:image/svg+xml;utf-8,${encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#2196f3' width='24' height='24'><circle cx='12' cy='12' r='8' /></svg>`
                            )}`} width={22} height={22} alt="Blue dot" />
                        </AdvancedMarker>
                    )}

                    {stops.map((s) => {
                        const iconImage = bookmarks.some(bookmark => bookmark.stop_code === s.stop_code) 
                            ? activeIcon 
                            : markerIcon;
                        
                        return (
                            <AdvancedMarker
                                key={s.stop_code}
                                position={{ lat: parseFloat(s.lat), lng: parseFloat(s.lon) }}
                                onClick={() => handleMarkerClick(s)}
                            >
                                <img src={iconImage} width={32} height={22} alt="Stop Marker" />
                            </AdvancedMarker>
                        );
                    })}

                    {selectedMarker && (
                        <InfoWindow
                            position={{ lat: parseFloat(selectedMarker.lat), lng: parseFloat(selectedMarker.lon) }}
                            onCloseClick={handleCloseInfoWindow}
                        >
                            <div>
                                <Typography variant="h6">{selectedMarker.intersection}</Typography>
                                <Typography variant="subtitle1">{selectedMarker.direction}</Typography>
                                <Typography variant="subtitle2">Stop #{selectedMarker.stop_code}</Typography>

                                {bookmarks.some(bookmark => bookmark.stop_code === selectedMarker.stop_code) ? (
                                    <Button
                                        sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                        color="primary"
                                        onClick={() => updateBookmarks(bookmarks.filter(bookmark => bookmark.stop_code !== selectedMarker.stop_code))}
                                    >
                                        <BookmarkAddedIcon fontSize="medium" color="success" />
                                        <Typography variant="caption" ml={.5}><span style={{ color: 'grey' }}>remove</span></Typography>
                                    </Button>
                                ) : (
                                    <Button
                                        sx={{ minWidth: 0, paddingLeft: 0, marginLeft: 0 }}
                                        color="primary"
                                        onClick={() => updateBookmarks([...bookmarks, selectedMarker])}
                                    >
                                        <BookmarkAddIcon fontSize="medium" color="action" />
                                        <Typography variant="caption" ml={.5}>add</Typography>
                                    </Button>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );

}
