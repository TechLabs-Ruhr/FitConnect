import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    GoogleMap,
    useLoadScript,
} from "@react-google-maps/api";
import GeoLocation from './geoLocation/GeoLocation';
import Spinner from '../spinner/Spinner'
import { GOOGLE_MAPS_API_KEY, libraries, mapContainerStyle, options } from '../../config';
import './map.scss';
import GoogleMapMarkers from "./markers/GoogleMapMarkers";

const Map = () => {
    const [center, setCenter] = useState({
        lat: 51.5134,
        lng: 7.4686
    });
    const [isLoading, setLoading] = useState(true);
    const [mapClick, setMapClick] = useState(null);
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

    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
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
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={center}
                options={options}
                onClick={(event) => {setMapClick(event)}}
                onLoad={onMapLoad}
            >
                
                <GeoLocation panTo={panTo} />
                <GoogleMapMarkers mapClick={mapClick}/>

            </GoogleMap>
        </>
    );
}

export default Map;