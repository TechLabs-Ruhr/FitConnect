import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import GeoLocation from './geoLocation/GeoLocation';
import Spinner from '../spinner/Spinner'
import { GOOGLE_MAPS_API_KEY } from '../../config/config';
import { libraries, mapContainerStyle, options } from '../../config/mapConfig';
import './map.scss';
import GoogleMapMarkers from "./markers/GoogleMapMarkers";
import LocationSearch from './locationSearch/LocationSearch';

const Map = () => {
    const [center, setCenter] = useState({
        lat: 51.5134,
        lng: 7.4686
    });
    const [isLoading, setLoading] = useState(true);
    const [mapClick, setMapClick] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [plusBtn, setPlusBtn] = useState(false);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries,
    });
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);
    const panTo = useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, [])
    useEffect(() => {
        getGeoLocation();
    }, []);
    useEffect(() => {
        if (userLocation) {
            setMapReady(true);
        }
    }, [userLocation]);

    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLoading(false);
            }, (error) => {
                console.error(error);
                setLoading(false);
            });
        } else {
            console.warn('Geolocation is not supported by your Browser');
            setLoading(false);
        }
    }

    if (loadError) return "Error loading maps";   // TODO: error
    if (!isLoaded || isLoading)
        return (<div className="spinner-container">
            <Spinner />
        </div>);

    return (
        <>
            {mapReady && <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={center}
                options={options}
                onClick={(event) => { setMapClick(event) }}
                onLoad={onMapLoad}
            >
                <GeoLocation panTo={panTo} />
                <GoogleMapMarkers mapClick={mapClick} plusBtn={plusBtn} setPlusBtn={setPlusBtn} />
                {userLocation && <Marker
                    position={userLocation}
                    icon={{
                        url: "img/geolocation.png",
                        scaledSize: new window.google.maps.Size(30, 30)
                    }}
                />}
                <LocationSearch panTo={panTo} />
                <button className={`btn btn-add ${plusBtn ? 'btn-active' : ''}`} onClick={() => setPlusBtn(!plusBtn)}>Add Training</button>
                <button className={`btn btn-add-media ${plusBtn ? 'btn-active' : ''}`} onClick={() => setPlusBtn(!plusBtn)}>+</button>

            </GoogleMap>}
        </>
    );
}

export default Map;