import React, { useEffect, useContext, useState } from 'react';
import './notifications.scss';
import { AuthContext } from "../../context/AuthContext";
import Notification from './notification/Notification';
import Spinner from '../spinner/Spinner';
import { getRequests } from '../../service/RequestService';

const Notifications = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        loadAllNotifications();
    }, []);

    const { currentUser } = useContext(AuthContext);

    const loadAllNotifications = async () => {
        setNotifications(await getRequests(currentUser));
        setLoading(false);
    };

    const sortedNotifications = notifications.sort((a, b) => b.time.seconds - a.time.seconds);

    if (isLoading) {
        return (
            <div className="notifications-spinner">
                <Spinner />
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
            <button className='btn notifications-close' onClick={() => onClose()}> &times;</button>
        </div>
    )

}

export default Notifications; 