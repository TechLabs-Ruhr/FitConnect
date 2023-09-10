import React, { useEffect, useState, useContext, useCallback } from 'react';
import MarkerInfo from "./markerInfo/MarkerInfo";
import { AuthContext } from "../../../context/AuthContext";
import { Marker } from "@react-google-maps/api";
import { MapForm } from "../mapForm/MapForm";
import ConfirmationPopup from '../../confirmationPopup/ConfirmationPopup';
import { trainings, getSize } from '../../../utils/trainings';
import '../map.scss';
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";
import {
  save as saveMarkerToDatabase,
  load as loadMarkersFromDatabase,
  remove as removeMarkerFromDatabase,
  update as updateMarkerInTheDataBase
} from '../../../service/MarkerService'

const GoogleMapMarkers = ({ mapClick, plusBtn, setPlusBtn }) => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [tempMarker, setTempMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = loadMarkersFromDatabase((updatedMarkers) => {
      setMarkers(updatedMarkers);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onMapClick();
  }, [mapClick]);

  const deleteMarker = async (markerId) => {
    await removeMarkerFromDatabase(markerId, currentUser);

    setMarkers((markers) => markers.filter(marker => marker.id !== markerId));
    setShowPopup('delete');
  }

  const updateMarker = async (values, id) => {
    const updatedMarker = await updateMarkerInTheDataBase(values, id, currentUser);

    if (updatedMarker) {
      setMarkers(currentMarkers => {
        const updatedMarkers = [...currentMarkers];
        const indexToUpdate = updatedMarkers.findIndex(marker => marker.id === id);
        updatedMarkers[indexToUpdate] = updatedMarker;
        return updatedMarkers;
      });

      setShowPopup('update');
    } else {
      setShowForm(false);
    }
  }

  const onFormSubmit = (values) => {
    const markerId = uuid();

    const userInfo = {
      id: currentUser.uid,
      name: currentUser.displayName,
      photo: currentUser.photoURL
    };

    const newMarker = {
      id: markerId,
      ...tempMarker,
      ...values,
      owner: userInfo,
      people: [userInfo],
      time: Timestamp.fromDate(new Date()),
      trainingTime: Timestamp.fromDate(new Date(values.trainingTime))
    };

    setMarkers((current) => [
      ...current,
      newMarker
    ]);
    saveMarkerToDatabase(newMarker, currentUser);
    setShowForm(false);
    setPlusBtn(false);
    setShowPopup('create');
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
              scaledSize: new window.google.maps.Size(getSize(marker.people.length), getSize(marker.people.length)),
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