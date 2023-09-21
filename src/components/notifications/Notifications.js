import React, { useEffect, useContext, useState } from 'react';
import './notifications.scss';
import { AuthContext } from "../../context/AuthContext";
import Notification from './notification/Notification';
import { getRequests } from '../../service/RequestService';

const Notifications = ({setShowNotifications, notificationsAnimation, setNotificationsAnimation }) => {
    const [notifications, setNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        loadAllNotifications();
    }, []);

    const loadAllNotifications = async () => {
        setNotifications(await getRequests(currentUser));
        setNotificationsAnimation(true);
    };

    const onClose = () => {
        setNotificationsAnimation(false); 
        setTimeout(() => {
            setShowNotifications(false); 
        }, 500)
    }

    if (notifications) {
        const sortedNotifications = notifications.sort((a, b) => b.time.seconds - a.time.seconds);

        return (
            <div className={`requests ${notificationsAnimation ? 'appear' : 'disappear'}`}>
                {sortedNotifications.length === 0 ? (
                    <p className="no-requests">You do not have any updates</p>
                ) : (
                    sortedNotifications.map((request, index) => (
                        <Notification key={index} request={request} />
                    ))
                )}
                <button className='btn notifications-close' onClick={() => onClose()}> &times;</button>
            </div>
        );
    }

    return null;

}

export default Notifications; 