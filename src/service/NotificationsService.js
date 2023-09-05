import {
    doc,
    updateDoc,
    getDoc,
    getDocs,
    collection
} from "firebase/firestore";
import { db } from "../firebase";

export const getAllNotifications = async (currentUser) => {
    const notifications = [];
    const querySnapshot = await getDocs(collection(db, "userRequests"));
    querySnapshot.forEach((doc) => {
        doc.data().requests.forEach((request) => {
            if (request.marker.owner.id === currentUser.uid) {
                notifications.push({ ...request, isRequest: true });
            }
            if (request.user.id === currentUser.uid && request.status !== 'active') {
                notifications.push({ ...request, isRequest: false });
            }
        });
    });
    return notifications;
}


export const updateNotifications = async (notificationsNumber, userId) => {
    if (notificationsNumber === 0) {
        await updateDoc(doc(db, "userNotifications", userId), {
            notifications: {
                newNotifications: 0
            }
        });
    }

    if (notificationsNumber === 1) {
        const docRef = doc(db, "userNotifications", userId);
        const docSnap = await getDoc(docRef);

        const currentNewNotifications = docSnap.data().notifications.newNotifications;

        const updatedNewNotifications = +currentNewNotifications + 1;

        await updateDoc(docRef, {
            notifications: {
                newNotifications: updatedNewNotifications
            }
        });
    }
}

