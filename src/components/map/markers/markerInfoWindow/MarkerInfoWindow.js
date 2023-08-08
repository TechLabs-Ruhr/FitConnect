import React, { useContext } from 'react';
import { InfoWindow } from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import { AuthContext } from "../../../../context/AuthContext";
import './markerInfoWindow.scss';
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import EditWindow from '../editWindow/EditWindow';



const MarkerInfoWindow = ({ selected, setSelected }) => {
    const { currentUser } = useContext(AuthContext);
    const { lat, lng, owner } = selected;

    return (
        /* <InfoWindow
             position={{ lat: lat, lng: lng }}
             onCloseClick={() => { setSelected(null) }}>
             <View selected={selected} />
         </InfoWindow> */
        <EditWindow selected={selected}
            setSelected={setSelected}
         />
    )
}

const View = ({ selected }) => {
    const { activityType, maxPeople, description, time, trainingTime } = selected;

    const startTime = new Date(time.toDate());
    const endTime = new Date(trainingTime.toDate());
    const currentTime = new Date();
    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;
    const percentage = (elapsedTime / totalTime) * 100;

    return (
        <div>
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

export default MarkerInfoWindow