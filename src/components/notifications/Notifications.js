import React, { useEffect, useContext, useState } from 'react';
import './notifications.scss';
import {
    getDocs,
    collection
} from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from "../../context/AuthContext";
import Notification from './notification/Notification';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadAllNotifications();
    }, []);

    const { currentUser } = useContext(AuthContext);

    const loadAllNotifications = async () => {
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
        setNotifications(notifications);
    };

    return (
        <div className='requests'>
            {notifications.length === 0 ?
                <p className="no-requests">You do not have any updates</p> :
                notifications.map((request, index) => (
                    <Notification key={index} request={request} />
                ))
            }
        </div>
    )

}

export default Notifications; 