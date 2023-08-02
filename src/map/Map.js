import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import mapsStyles from "./mapStyles";
import { formatRelative } from "date-fns";
import "@reach/combobox/styles.css";
import "../style.css";
import GeoLocation from './GeoLocation'; 
import Search from "./Search";
import { GOOGLE_MAPS_API_KEY } from '../config';

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

const Map = () => {
  const [center, setCenter] = useState({
    // Dortmund coordinates if Geolocation is not supported
    lat: 51.5134, 
    lng: 7.4686  
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }, (error) => {
        console.error(error);
      });
    } else {
      console.warn('Geolocation is not supported by your Browser');
    }
  }, []);

  const onMapClick = useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date()
      }
    ])
  }, []);

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
  if (!isLoaded) return "Loading Maps";   // TODO: loading maps 

  return (
    <div className="App">

      <Search panTo={panTo} />
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
              url: "/logo_black.png",
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
          </div>
        </InfoWindow>}
      </GoogleMap>
    </div>
  );
}

export default Map;