import React, { useState, useCallback, useRef, useEffect } from "react";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from "@react-google-maps/api";
import mapsStyles from "./mapStyles/mapStyles";
import { formatRelative } from "date-fns";
import GeoLocation from './geoLocation/GeoLocation';
import Spinner from '../spinner/Spinner';
import { MapForm } from "./mapForm/MapForm";
import { GOOGLE_MAPS_API_KEY } from '../config';
import './map.scss';

const libraries = ["places"];

const mapContainerStyle = {
    width: "100vw",
    height: "100vh"
}

const options = {
    styles: mapsStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const percentage = 66;


const Map = () => {
    const [center, setCenter] = useState({
        // Dortmund coordinates if Geolocation is not supported
        lat: 51.5134,
        lng: 7.4686
    });
    const [isLoading, setLoading] = useState(true);
    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [tempMarker, setTempMarker] = useState(null);
    const [plusBtn, setPlusBtn] = useState(false);

    useEffect(() => {
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
    }, []);

    const onMapClick = useCallback((event) => {
        plusBtn && (
            setTempMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() }),
            setShowForm(true)
        )
    }, [plusBtn]);

const onFormSubmit = (values) => {
    setMarkers((current) => [
        ...current,
        {
            ...tempMarker,
            ...values,
            time: new Date(values.time)
        }
    ]);
    setShowForm(false);
    setPlusBtn(false);
};


const mapRef = useRef();
const onMapLoad = useCallback((map) => {
    mapRef.current = map;
}, []);

const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
});

const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
}, [])

if (loadError) return "Error loading maps";   // TODO: error
if (!isLoaded)
    return (<div className="spinner-container">
        <Spinner />
    </div>);

return (
    <div>
        {isLoading ? (
            <div className="spinner-container">
                <Spinner />
            </div>
        ) : (
            <>
                {showForm && <MapForm onSubmit={onFormSubmit} onClose={() => setShowForm(false)} />}
                <button className={`btn btn-plus ${plusBtn ? 'btn-active' : ''}`} onClick={() => setPlusBtn(!plusBtn)}>+</button>
                <GeoLocation panTo={panTo} />
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={center}
                    options={options}
                    onClick={onMapClick}
                    onLoad={onMapLoad}
                >
                    {markers.map((marker) => (
                        <Marker
                            key={marker.time.toISOString()}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            icon={{
                                url: "img/logo_black.png",
                                scaledSize: new window.google.maps.Size(30, 30),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(15, 15)
                            }}
                            onClick={() => {
                                setSelected(marker);
                            }}
                        />
                    ))}

                    {selected && <InfoWindow
                        position={{ lat: selected.lat, lng: selected.lng }}
                        onCloseClick={() => { setSelected(null) }}>
                        <div>
                            <p>Time: {formatRelative(selected.time, new Date())}</p>
                            <p>Activity: {selected.activityType}</p>
                            <p>Max People: {selected.maxPeople}</p>
                            <p>Description: {selected.description}</p>
                        </div>
                    </InfoWindow>}
                </GoogleMap>
            </>
        )}
    </div>
);
}

export default Map;