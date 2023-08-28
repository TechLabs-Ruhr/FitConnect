import { formatRelative } from "date-fns";
import './notification.scss';
import requestImg from '../../../ressources/img/notification.png'
import React, { useState } from 'react';
import {
    doc,
    updateDoc,
    getDoc,
    Timestamp
} from "firebase/firestore";
import { db } from "../../../firebase";
import { changeNewNotifications } from "../../../utils/notifications";

const Notification = ({ request: { id, marker, time, user, status, isRequest } }) => {
    const [requestStatus, setRequestStatus] = useState(status);
    const [notificationTime, setNotificationTime] = useState(time); 

    const onAccept = () => {
        updateRequestInDB('confirmed');

        updateMarkerInDB();

        setNotificationTime(new Timestamp(Math.floor(new Date().getTime() / 1000), 0));
        setRequestStatus('confirmed');
        changeNewNotifications(1, user.id); 
    }

    const onDecline = () => {
        updateRequestInDB('rejected');

        setNotificationTime(new Timestamp(Math.floor(new Date().getTime() / 1000), 0));
        setRequestStatus('rejected');
        changeNewNotifications(1, user.id); 
    }

    const updateRequestInDB = async (status) => {
        const userRequestRef = doc(db, "userRequests", marker.id);
        const userRequestSnap = await getDoc(userRequestRef);

        const requests = userRequestSnap.data().requests;

        const updatedRequests = requests.map(request => {
            if (request.id === id) {
                return {
                    ...request,
                    status,
                    time: new Date()
                };
            }
            return request;
        });

        await updateDoc(userRequestRef, { requests: updatedRequests });
    }

    const updateMarkerInDB = async () => {
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

    return (
        <div className='request'>
            <img src={requestImg} alt="" className="request-img" />
            <div className="request-info">
                {requestStatus === 'active' && (
                    <>
                        <p className='request-title'>
                            <span className='exclamation-mark'>!</span>
                            {` ${user.name} wants to join your ${marker.activityType} training ${formatRelative(new Date(marker.trainingTime.seconds * 1000), new Date())}`}
                        </p>
                        <button className='btn btn-accept' onClick={onAccept}>Accept</button>
                        <button className="btn btn-decline" onClick={onDecline}>Decline</button>
                        <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
                    </>
                )}

                {(requestStatus === 'confirmed' && isRequest) && (
                    <>
                        <p className='request-title'>
                            {`You accepted ${user.name}´s request to join your ${marker.activityType} training`}
                        </p>
                        <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
                    </>
                )}

                {(requestStatus === 'rejected' && isRequest) && (
                    <>
                        <p className='request-title'>
                            {`You declined ${user.name}´s request to join your ${marker.activityType} training`}
                        </p>
                        <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
                    </>
                )}

                {(requestStatus === 'confirmed' && !isRequest) && (
                    <>
                        <p className='request-title'>
                            {`Your request for ${marker.activityType} training was accepted!`}
                        </p>
                        <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
                    </>
                )}

                {(requestStatus === 'rejected' && !isRequest) && (
                    <>
                        <p className='request-title'>
                            {`Your request for ${marker.activityType} training was declined!`}
                        </p>
                        <p className='request-time'>{formatRelative(new Date(notificationTime.seconds * 1000), new Date())}</p>
                    </>
                )}
            </div>
        </div>
    );

}

export default Notification; 