import React, { useEffect, useContext, useState } from 'react';
import './notifications.scss';
import {
    getDocs,
    collection
} from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from "../../context/AuthContext";
import Notification from './notification/Notification';
import Spinner from '../spinner/Spinner';

const Notifications = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setLoading] = useState(true);

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
        setLoading(false); 
    };

    const sortedNotifications = notifications.sort((a, b) => b.time.seconds - a.time.seconds);

    if(isLoading){
        return (
            <div className="notifications-spinner">
                <Spinner/>
            </div>
        )
    }

    return (
        <div className='requests'>
            {sortedNotifications.length === 0 ?
                <p className="no-requests">You do not have any updates</p> :
                sortedNotifications.map((request, index) => (
                    <Notification key={index} request={request} />
                ))
            }
            <button className='btn btn-close' onClick={() => onClose()}> &times;</button>
        </div>
    )

}

export default Notifications; 