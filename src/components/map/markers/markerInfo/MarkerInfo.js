import React, { useState, useEffect } from 'react';
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import { formatRelative } from "date-fns";
import { InfoWindow } from "@react-google-maps/api";
import './markerInfoView.scss';
import './optionWindow.scss';
import './сonfirmationModal.scss';
import { MapForm } from '../../mapForm/MapForm';


const MarkerInfo = ({ selected, setSelected, deleteMarker, updateMarker }) => {
    const [showView, setShowView] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [form, setForm] = useState(false);
    const { lat, lng } = selected;

    useEffect(() => {
        console.log(selected);
        selected !== null && (
            setShowView(false),
            setConfirmationModal(false),
            setShowOptions(true),
            setForm(false)
        )
    }, [selected]);

    const onViewBtnClick = () => {
        setShowView(true);
        setShowOptions(false);
    }

    return (
        <>
            {selected && (<InfoWindow
                position={{ lat: lat, lng: lng }}
                onCloseClick={() => { setSelected(null) }}>
                <>
                    {showOptions &&
                        (<OptionWindow
                            onViewBtnClick={onViewBtnClick}
                            setConfirmationModal={setConfirmationModal}
                            setShowOptions={setShowOptions}
                            setForm={setForm}
                        />)}

                    {showView && (<MarkerView selected={selected} />)}

                    {confirmationModal &&
                        (<ConfirmationModal
                            onDeleteBtnClick={deleteMarker}
                            selected={selected}
                            setSelected={setSelected}
                            setConfirmationModal={setConfirmationModal}
                            setShowOptions={setShowOptions} />)}

                    {form &&
                        (<MapForm onSubmit={updateMarker}
                            onClose={() => setShowForm(false)}
                            selected={selected}
                            setSelected={setSelected}
                        />)}
                </>
            </InfoWindow>)}
        </>
    )
}

export default MarkerInfo;

const OptionWindow = ({ onViewBtnClick, setConfirmationModal, setShowOptions, setForm }) => {
    const onDeleteBtn = () => {
        setConfirmationModal(true);
        setShowOptions(false);
    }

    const onEditBtn = () => {
        setForm(true);
        setShowOptions(false);
    }

    return (
        <>
            <div className='edit-marker'>
                <button className='btn btn-view' onClick={onViewBtnClick}>View</button>
                <button className='btn btn-edit' onClick={onEditBtn}>Edit</button>
                <button className='btn btn-delete' onClick={onDeleteBtn}>Delete</button>
            </div>
        </>
    )
}

const ConfirmationModal = ({ onDeleteBtnClick, setSelected, selected, setConfirmationModal, setShowOptions }) => {
    const onConfirm = () => {
        onDeleteBtnClick(selected.id);
        setSelected(null);
    }

    const onCancel = () => {
        setConfirmationModal(false);
        setShowOptions(true);
    }

    return (
        <div className='confirmation-modal'>
            <div className="confirmation-modal__content">
                <p className="confirmation-modal__text">Möchten Sie das Training wirklich löschen?</p>
                <div className="confirmation-modal__buttons">
                    <button className="confirmation-modal__button cancel" onClick={onCancel}>Abbrechen</button>
                    <button className="confirmation-modal__button confirm" onClick={onConfirm}>Bestätigen</button>
                </div>
            </div>
        </div>
    );
};

const MarkerView = ({ selected }) => {
    const { activityType, maxPeople, description, time, trainingTime } = selected;

    const startTime = new Date(time.toDate());
    const endTime = new Date(trainingTime.toDate());
    const currentTime = new Date();
    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;
    const percentage = (elapsedTime / totalTime) * 100;

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
            <button className="btn btn-join">Join</button>
            <button className='btn btn-close'> &times;</button>
        </div>
    )
}