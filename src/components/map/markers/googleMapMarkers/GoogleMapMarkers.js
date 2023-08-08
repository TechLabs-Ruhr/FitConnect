import React, { useEffect, useState, useContext, useCallback } from 'react';
import MarkerInfoWindow from "../markerInfoWindow/MarkerInfoWindow";
import { Timestamp } from 'firebase/firestore';
import { AuthContext } from "../../../../context/AuthContext";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Marker } from "@react-google-maps/api";
import { MapForm } from "../../mapForm/MapForm";
import { db } from "../../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import '../../map.scss';

const GoogleMapMarkers = ({ mapClick }) => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [tempMarker, setTempMarker] = useState(null);
  const [plusBtn, setPlusBtn] = useState(false);

  useEffect(() => {
    loadAllMarkers();
  }, []);

  useEffect(() => {
    onMapClick();
  }, [mapClick]);

  const loadAllMarkers = async () => {
    const allMarkers = [];
    const querySnapshot = await getDocs(collection(db, "userMarkers"));
    querySnapshot.forEach((doc) => {
      allMarkers.push(...doc.data().markers);
    });
    setMarkers(allMarkers);
  };

  const onFormSubmit = (values) => {
    const newMarker = {
      ...tempMarker,
      ...values,
      owner: currentUser.uid,
      time: Timestamp.fromDate(new Date()),
      trainingTime: Timestamp.fromDate(new Date(values.trainingTime))
    };

    setMarkers((current) => [
      ...current,
      newMarker
    ]);

    save(newMarker);

    setShowForm(false);
    setPlusBtn(false);
  };

  const save = (marker) => {
    updateDoc(doc(db, "userMarkers", currentUser.uid), {
      markers: arrayUnion({
        id: uuid(),
        owner: currentUser.uid,
        people: [],
        time: new Date(),
        ...marker,
      }),
    });
  }

  const onMapClick = useCallback(() => {
    (plusBtn) && (
      setTempMarker({ lat: mapClick.latLng.lat(), lng: mapClick.latLng.lng() }),
      setShowForm(true)
    )
  }, [plusBtn, mapClick]);

  return (
    <>
      <button className={`btn btn-plus ${plusBtn ? 'btn-active' : ''}`} onClick={() => setPlusBtn(!plusBtn)}>+</button>

      {markers.map((marker, index) => (
        <Marker
          key={marker.id + index}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={{
            url: "img/logo_black.png",
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15)
          }}
          onClick={() => {
            setSelected(!selected || selected.id !== marker.id ? marker : null);
          }}
        />
      ))}

      {selected && <MarkerInfoWindow
        selected={selected}
        setSelected={setSelected}
      />}

      {showForm && <MapForm onSubmit={onFormSubmit} onClose={() => setShowForm(false)} />}
    </>
  )
}

export default GoogleMapMarkers