import React, { useState, useEffect, useContext } from 'react';
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
    setDoc
} from "firebase/firestore";
import { db } from '../../../../../firebase';
import Spinner from '../../../../spinner/Spinner';
import { AuthContext } from '../../../../../context/AuthContext';
import { changeNewNotifications } from '../../../../../utils/notifications';
import { capitalizeFirstLetter } from '../../../../../utils/utils';
import ConfirmationModal from '../../markerInfo/confirmationModal/ConfirmationModal';
import defaultUserPhoto from '../../../../../ressources/img/user.png'
import waiting from '../../../../../ressources/img/waiting.png';
import accept from '../../../../../ressources/img/check-green.png';
import reject from '../../../../../ressources/img/reject.png';

const MarkerView = ({ selected }) => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        setRequestStatus(null);
        if (currentUser.uid === selected.owner.id) {
            setRequestStatus('view-only');
        } else {
            const fetchRequestStatus = async () => {
                const existingRequest = await checkRequestExists();
                if (existingRequest) {
                    setRequestStatus(existingRequest.status);
                } else {
                    if (selected.people.length === selected.maxPeople + 1) {
                        setRequestStatus('full');
                    } else {
                        setRequestStatus('classic');
                    }
                }
            }
            fetchRequestStatus();
        }
    }, [selected]);

    const { people, activityType, maxPeople, description, time, trainingTime } = selected;
    const percentage = findPercentage(time, trainingTime);

    const join = async () => {
        await addRequestToDB();
        setRequestStatus('active');
    }

    const addRequestToDB = async () => {
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

    const checkRequestExists = async () => {
        const docRef = doc(db, "userRequests", selected.id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return false;
        }

        const requests = docSnap.data().requests;
        const matchingRequest = requests.find(request => request.user.id === currentUser.uid);

        return matchingRequest || null;
    }

    return (
        showConfirmModal ? (<ConfirmationModal setShowConfirmModal={setShowConfirmModal} join={join} type={'join'} />) :

            <div className='marker-info'>
                <p className='info-activity'>{capitalizeFirstLetter(activityType)}</p>
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
                <p className='info-people'>Participants: {people.length}/{maxPeople + 1}</p>
                <div className="info-people-imgs">
                    {selected.people.map((participant, index) => {
                        const src = participant.photo ? participant.photo : defaultUserPhoto;
                        console.log(src);
                        if (index > 9) {
                            return;
                        }
                        return (<img key={index} alt={participant.displayName} src={src} title={participant.name} className='info-people-img' />)
                    })}
                </div>
                {(() => {
                    switch (requestStatus) {
                        case null:
                            return (
                                <div className="spinner-container">
                                    <Spinner />
                                </div>
                            );
                        case 'classic':
                            return <button className="btn btn-join" onClick={() => setShowConfirmModal(true)}>Join</button>;
                        case 'view-only':
                            return <button className="btn btn-join">Join</button>;
                        case 'active':
                            return (<div className="info-status">
                                <p className='info-message'>Thank you! Your request is waiting for confirmation</p>
                                <img src={waiting} alt="waiting" className='info-status-img' />
                            </div>);
                        case 'rejected':
                            return (<div className="info-status">
                                <p className='info-message'>Sorry, your request was rejected</p>
                                <img src={reject} alt="reject" className='info-status-img' />
                            </div>);
                        case 'confirmed':
                            return (<div className="info-status">
                                <p className='info-message'>Nice! Your request was accepted</p>
                                <img src={accept} alt="accept" className='info-status-img' />
                            </div>);
                        case 'full':
                            return (<div className="info-status">
                                <p className='info-message'>Unfortunatelly the training is already full</p>
                                <img src={reject} alt="reject" className='info-status-img' />
                            </div>);
                    }
                })()}

                <button className='btn btn-close'> &times;</button>
            </div >
    )

}

export default MarkerView