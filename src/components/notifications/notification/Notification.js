import { formatRelative } from "date-fns";
import './notification.scss';
import requestImg from '../../../ressources/img/notification.png'
import React, { useState } from 'react';
import { Timestamp } from "firebase/firestore";
import { updateNotifications } from "../../../service/NotificationsService";
import { update as updateRequestInDB } from '../../../service/RequestService';
import { updateParticipants as updateMarkerInDB } from "../../../service/MarkerService";

const Notification = ({ request: { id, marker, time, user, status, isRequest } }) => {
    const [requestStatus, setRequestStatus] = useState(status);
    const [notificationTime, setNotificationTime] = useState(time);

    const onAccept = () => {
        updateRequestInDB('confirmed', marker, id);

        updateMarkerInDB(marker, user);

        setNotificationTime(new Timestamp(Math.floor(new Date().getTime() / 1000), 0));
        setRequestStatus('confirmed');
        updateNotifications(1, user.id);
    }

    const onDecline = () => {
        updateRequestInDB('rejected', marker, id);

        setNotificationTime(new Timestamp(Math.floor(new Date().getTime() / 1000), 0));
        setRequestStatus('rejected');
        updateNotifications(1, user.id);
    }

    return (
        <div className='request'>
            <img src={requestImg} alt="" className="request-img" />
            <div className="request-info">
                {requestStatus === 'active' && (
                    <>
                        <p className='request-title'>
                            <span className='exclamation-mark'>!</span>
                            {` ${user.name} wants to join your ${marker.activityType} training on ${formatRelative(new Date(marker.trainingTime.seconds * 1000), new Date())}`}
                        </p>
                        <button className='btn btn-accept' onClick={onAccept}>Accept</button>
                        <button className="btn btn-decline" onClick={onDecline}>Decline</button>
                    </>
                )}
                {(requestStatus === 'confirmed' && isRequest) && (
                    <p className='request-title'>{`You accepted ${user.name}´s request to join your ${marker.activityType} training`}</p>
                )}
                {(requestStatus === 'rejected' && isRequest) && (
                    <p className='request-title'>{`You declined ${user.name}´s request to join your ${marker.activityType} training`}</p>
                )}
                {(requestStatus === 'confirmed' && !isRequest) && (
                    <p className='request-title'>{`Your request for ${marker.activityType} training was accepted!`}</p>
                )}
                {(requestStatus === 'rejected' && !isRequest) && (
                    <p className='request-title'>{`Your request for ${marker.activityType} training was declined!`}</p>
                )}
                <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
            </div>
        </div>
    );

}

export default Notification; 