import {
    arrayUnion,
    doc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import { db } from '../firebase';
import { v4 as uuid } from 'uuid';
import { changeNewNotifications } from './NotificationsService';

export const save = async (selected, currentUser) => {
    updateDoc(doc(db, "userRequests", selected.id), {
        requests: arrayUnion({
            id: uuid(),
            user: {
                id: currentUser.uid,
                name: currentUser.displayName,
                photo: currentUser.photoURL
            },
            marker: selected,
            status: 'active',
            time: new Date()
        }),
    });

    changeNewNotifications(1, selected.owner.id);
}

export const getRequest = async (selected, currentUser) => {
    const docRef = doc(db, "userRequests", selected.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return false;
    }

    const requests = docSnap.data().requests;
    const matchingRequest = requests.find(request => request.user.id === currentUser.uid);

    return matchingRequest || null;
}