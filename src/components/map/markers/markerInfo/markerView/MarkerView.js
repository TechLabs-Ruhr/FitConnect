import React, { useState, useEffect, useContext } from 'react';
import './markerView.scss';
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import { formatRelative } from "date-fns";
import { AuthContext } from '../../../../../context/AuthContext';
import { capitalizeFirstLetter, findPercentage } from '../../../../../utils/utils';
import ConfirmationModal from '../../markerInfo/confirmationModal/ConfirmationModal';
import ParticipantAvatars from './participantAvatars/ParticipantAvatars';
import { getRequestStatusContent } from './markerStatus/MarkerStatus';
import Spinner from '../../../../spinner/Spinner';
import { getParticipants } from '../../../../../service/MarkerService';
import { save, getRequest } from '../../../../././../service/RequestService'

const MarkerView = ({ selected }) => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [windowHeight, setWindowHeight] = useState('220px');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setRequestStatus(null);

            if (currentUser.uid === selected.owner.id) {
                setParticipants(await getParticipants(selected));
                setRequestStatus('view');
                setWindowHeight('220px');
            } else {
                const existingRequest = await getRequest(selected, currentUser);
                setParticipants(await getParticipants(selected));

                if (existingRequest) {
                    setRequestStatus(existingRequest.status);
                    setWindowHeight('205px');
                } else {
                    if (selected.people.length >= selected.maxPeople + 1) {
                        setRequestStatus('full');
                        setWindowHeight('205px');
                    } else {
                        setRequestStatus('classic');
                        setWindowHeight('220px');
                    }
                }
            }
        };

        fetchData();
    }, [selected]);

    const { activityType, maxPeople, description, time, trainingTime } = selected;
    const percentage = findPercentage(time, trainingTime);

    const onJoin = async () => {
        await save(selected, currentUser);
        setRequestStatus('active');
        setWindowHeight('205px');
    }

    const content = getRequestStatusContent(() => setShowConfirmModal(true));

    return (
        showConfirmModal ? (<ConfirmationModal setShowConfirmModal={setShowConfirmModal} join={onJoin} type={'join'} />)

            :

            <div className='marker-info' style={{ height: windowHeight }}>
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

                {requestStatus && participants ?
                    <>
                        <p className='info-people'>Participants: {participants.length}/{maxPeople + 1}</p>
                        <ParticipantAvatars participants={participants} />
                        {content[requestStatus]}
                    </> :
                    (<div className="spinner-container"><Spinner /></div>)
                }

                <button className='btn btn-close'> &times;</button>
            </div >
    )

}

export default MarkerView