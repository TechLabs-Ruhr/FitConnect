import React, { useState, useEffect } from 'react';
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import { formatRelative } from "date-fns";
import { InfoWindow } from "@react-google-maps/api";
import './markerInfoView.scss';
import './optionWindow.scss';


const MarkerInfo = ({ selected, setSelected }) => {
    const [showView, setShowView] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const { lat, lng } = selected;

    useEffect(() => {
        console.log(1);
        selected !== null && (
            setShowView(false),
            setShowOptions(true)
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
                    {(selected && showOptions) && (<OptionWindow onViewBtnClick={onViewBtnClick} />)}
                    {showView && (<MarkerView selected={selected} />)}
                </>
            </InfoWindow>)}
        </>
    )
}

export default MarkerInfo;

const OptionWindow = ({ onViewBtnClick }) => {
    return (
        <>
            <div className='edit-marker'>
                <button className='btn btn-view' onClick={onViewBtnClick}>View</button>
                <button className='btn btn-edit'>Edit</button>
                <button className='btn btn-delete'>Delete</button>
            </div>
        </>
    )
}

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