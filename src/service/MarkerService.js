import {
  arrayUnion,
  doc,
  updateDoc,
  collection,
  getDoc,
  setDoc,
  arrayRemove,
  deleteDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

export const load = (onUpdate) => {
  return onSnapshot(collection(db, "userMarkers"), async (querySnapshot) => {
    const allMarkers = [];
    const now = Timestamp.now();

    for (const document of querySnapshot.docs) {
      const markers = document.data().markers;
      const markersToDelete = [];
      const validMarkers = markers.filter(marker => {
        const markerTime = marker?.trainingTime;
        if (markerTime && markerTime.seconds < now.seconds) {
          console.log(markerTime.seconds + ' ' + now.seconds);
          markersToDelete.push(marker);
          return false;
        }
        return true;
      });

      for (let marker of markersToDelete) {
        await deleteDoc(doc(db, "userRequests", marker.id));
      }

      if (validMarkers.length !== markers.length) {
        await updateDoc(doc(db, "userMarkers", document.id), {
          markers: validMarkers
        });
      }

      allMarkers.push(...validMarkers);
    }

    onUpdate(allMarkers);
  });
};


  export const save = async (marker, currentUser) => {
    await updateDoc(doc(db, "userMarkers", currentUser.uid), {
      markers: arrayUnion({
        time: new Date(),
        ...marker,
      }),
    });

    await setDoc(doc(db, "userRequests", marker.id), { requests: [] });
  }

  export const remove = async (markerId, currentUser) => {
    const userMarkersDoc = await getDoc(doc(db, "userMarkers", currentUser.uid));
    const userMarkers = userMarkersDoc.data().markers;

    const markerToDelete = userMarkers.find(marker => marker.id === markerId);

    await updateDoc(doc(db, "userMarkers", currentUser.uid), {
      markers: arrayRemove(markerToDelete),
    });

    await deleteDoc(doc(db, "userRequests", markerId));
  };

  export const update = async (values, id, currentUser) => {
    const markerRef = doc(db, "userMarkers", currentUser.uid);
    const docSnapshot = await getDoc(markerRef);
    const markers = docSnapshot.data().markers;
    const indexToUpdate = markers.findIndex(marker => marker.id === id);
  
    const oldMarker = markers[indexToUpdate];
    if (!didMarkerChange(oldMarker, values)) {
      return null; 
    }
  
    const updatedMarker = {
      ...oldMarker,
      trainingTime: Timestamp.fromDate(new Date(values.trainingTime)),
      maxPeople: values.maxPeople,
      description: values.description,
      activityType: values.activityType
    };
  
    markers[indexToUpdate] = updatedMarker;
    await updateDoc(markerRef, { markers });
    return updatedMarker; 
  };

  export const updateParticipants = async (marker, user) => {
    const userMarkersRef = doc(db, "userMarkers", marker.owner.id);
    const userRequestSnap = await getDoc(userMarkersRef);

    const markers = userRequestSnap.data().markers;

    const updatedMarkers = markers.map(trainingMarker => {
        if (trainingMarker.id === marker.id) {
            return {
                ...trainingMarker,
                people: [...trainingMarker.people, user]
            };
        }
        return trainingMarker;
    });

    await updateDoc(userMarkersRef, { markers: updatedMarkers });
}

 export const getParticipants = async (selected) => {
    const docSnap = await getDoc(doc(db, "userMarkers", selected.owner.id));
    const markers = docSnap.data().markers;
    const marker = markers.find(marker => marker.id === selected.id);
    return marker.people;
}

  const didMarkerChange = (oldMarker, newValues) => {
    const newTrainingTime = Timestamp.fromDate(new Date(newValues.trainingTime));
    
    return (
      oldMarker.trainingTime.seconds !== newTrainingTime.seconds + 7200 ||
      oldMarker.maxPeople !== newValues.maxPeople ||
      oldMarker.description !== newValues.description ||
      oldMarker.activityType !== newValues.activityType
    );
  };
  