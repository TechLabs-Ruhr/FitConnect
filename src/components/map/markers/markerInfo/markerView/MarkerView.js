import React, { useState, useEffect } from 'react';
import './markerView.scss';
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import { formatRelative } from "date-fns";
import { findPercentage } from '../../../../../utils/time';
import { v4 as uuid } from 'uuid';
import {
    arrayUnion,
    doc,
    updateDoc,
    getDoc,
} from "firebase/firestore";
import { db } from '../../../../../firebase';
import Spinner from '../../../../spinner/Spinner';

const MarkerView = ({ selected, currentUser }) => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setRequestStatus(null); 
        const fetchRequestStatus = async () => {
            const existingRequest = await checkRequestExists();
            if (existingRequest) {
                setRequestStatus(existingRequest.status);
            }
            setLoading(false);
        }

        fetchRequestStatus();
    }, [selected]);

    const { activityType, maxPeople, description, time, trainingTime } = selected;
    const percentage = findPercentage(time, trainingTime);

    const join = async () => {
        await addRequestToDB(selected.uid, currentUser.uid);
        setRequestStatus('active');
    }

    const addRequestToDB = async () => {
        updateDoc(doc(db, "userRequests", selected.id), {
            requests: arrayUnion({
                id: uuid(),
                user: currentUser.uid,
                marker: selected,
                status: 'active',
                Time: new Date()
            }),
        });
    }

    const checkRequestExists = async () => {
        const docRef = doc(db, "userRequests", selected.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return false;
        }

        console.log(selected.id);

        const requests = docSnap.data().requests;
        const matchingRequest = requests.find(request => request.user === currentUser.uid);

        return matchingRequest || null;
    }

    return (
        <div className='marker-info'>
            <p className='info-activity'>{activityType}</p>
            <div className="info">
                <div className="info__block-left">
                    <p className='info-description'>{description}</p>
                </div>
                <div className="info__block-right">
                    <CircularProgressbar
                        className='info-progress'
                        value={percentage}
                        strokeWidth={50}
                        styles={buildStyles({
                            strokeLinecap: "butt",
                            pathColor: "orange",
                            trailColor: "grey",
                        })}
                    />
                    <p className='info-time'>{formatRelative(new Date(trainingTime.seconds * 1000), new Date())}</p>
                </div>
            </div>
            <p className='info-people'>People: 0/{maxPeople}</p>
            {isLoading ?
                (<div className="spinner-container">
                    <Spinner />
                </div>) :
                (() => {
                    switch (requestStatus) {
                        case null:
                            return <button className="btn btn-join" onClick={join}>Join</button>;
                        case 'active':
                            return <p>Thank you. Your request is waiting for confirmation</p>;
                        case 'rejected':
                            return <p>Sorry. Your request was rejected</p>;
                        case 'confirmed':
                            return <p>Nice! Your request was accepted</p>;
                        default:
                            return null;
                    }
                })()
            }

            <button className='btn btn-close'> &times;</button>
        </div>
    )
}

export default MarkerView