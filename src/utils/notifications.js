import {
    doc,
    updateDoc,
    getDoc
} from "firebase/firestore";
import { db } from "../Firebase";


export const changeNewNotifications = async (notificationsNumber, userId) => {
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