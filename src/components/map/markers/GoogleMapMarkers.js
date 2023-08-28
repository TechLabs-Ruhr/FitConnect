import React, { useEffect, useState, useContext, useCallback } from 'react';
import MarkerInfo from "./markerInfo/MarkerInfo";
import { Timestamp } from 'firebase/firestore';
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  arrayRemove,
  deleteDoc
} from "firebase/firestore";
import { Marker } from "@react-google-maps/api";
import { MapForm } from "../mapForm/MapForm";
import { db } from "../../../firebase";
import ConfirmationPopup from '../../confirmationPopup/ConfirmationPopup';
import { trainings } from '../../../utils/trainings';
import '../map.scss';

const GoogleMapMarkers = ({ mapClick, plusBtn, setPlusBtn }) => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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
    const markerId = uuid();

    const newMarker = {
      id: markerId,
      ...tempMarker,
      ...values,
      owner: {
        id: currentUser.uid,
        name: currentUser.displayName,
      },
      people: [{
        id: currentUser.uid,
        name: currentUser.displayName,
      }],
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
    setShowPopup('create');
  };

  const save = async (marker) => {
    await updateDoc(doc(db, "userMarkers", currentUser.uid), {
      markers: arrayUnion({
        time: new Date(),
        ...marker,
      }),
    });

    await setDoc(doc(db, "userRequests", marker.id), { requests: [] });
  }

  const deleteMarker = async (markerId) => {
    const userMarkersDoc = await getDoc(doc(db, "userMarkers", currentUser.uid));
    const userMarkers = userMarkersDoc.data().markers;

    const markerToDelete = userMarkers.find(marker => marker.id === markerId);

    await updateDoc(doc(db, "userMarkers", currentUser.uid), {
      markers: arrayRemove(markerToDelete),
    });

    await deleteDoc(doc(db, "userRequests", markerId));

    setMarkers((markers) => markers.filter(marker => marker.id !== markerId));
    setShowPopup('delete');
  };

  const updateMarker = async (values, id) => {
    const markerRef = doc(db, "userMarkers", currentUser.uid);
    const docSnapshot = await getDoc(markerRef);
    const markers = docSnapshot.data().markers;
    const indexToUpdate = markers.findIndex(marker => marker.id === id);

    const updatedMarker = {
      ...markers[indexToUpdate],
      trainingTime: Timestamp.fromDate(new Date(values.trainingTime)),
      maxPeople: values.maxPeople,
      description: values.description,
      activityType: values.activityType
    };

    markers[indexToUpdate] = updatedMarker;

    await updateDoc(markerRef, { markers });

    setMarkers(currentMarkers => {
      const updatedMarkers = [...currentMarkers];
      const localIndexToUpdate = updatedMarkers.findIndex(marker => marker.id === id);
      updatedMarkers[localIndexToUpdate] = updatedMarker;
      return updatedMarkers;
    });

    setShowPopup('update');
  };

  const onMapClick = useCallback(() => {
    (plusBtn) && (
      setTempMarker({ lat: mapClick.latLng.lat(), lng: mapClick.latLng.lng() }),
      setShowForm(true)
    )
  }, [plusBtn, mapClick]);

  return (
    <>
      {markers.map((marker, index) => {
        const training = trainings.find(t => t.activityType === marker.activityType);
        const iconUrl = training ? training.icon : null;

        return (
          <Marker
            key={marker.id + index}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: iconUrl,
              scaledSize: new window.google.maps.Size(32, 32),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15)
            }}
            onClick={() => {
              setSelected(!selected || selected.id !== marker.id ? marker : null);
            }}
          />
        );
      })}

      {selected && <MarkerInfo
        selected={selected}
        setSelected={setSelected}
        deleteMarker={deleteMarker}
        updateMarker={updateMarker}
      />}

      {showForm && <MapForm onSubmit={onFormSubmit} onClose={() => setShowForm(false)} />}
      {showPopup ? <ConfirmationPopup id={showPopup} setShowPopup={setShowPopup} /> : null}
    </>
  )
}

export default GoogleMapMarkers