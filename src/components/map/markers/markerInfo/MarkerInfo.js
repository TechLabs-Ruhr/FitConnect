import React, { useState, useEffect, useContext } from 'react';
import { InfoWindow } from "@react-google-maps/api";
import { MapForm } from '../../mapForm/MapForm';
import OptionWindow from './optionWindow/OptionWindow';
import ConfirmationModal from './confirmationModal/ConfirmationModal';
import MarkerView from './markerView/MarkerView';
import { AuthContext } from "../../../../context/AuthContext";


const MarkerInfo = ({ selected, setSelected, deleteMarker, updateMarker }) => {
    const [showView, setShowView] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [form, setForm] = useState(false);
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { lat, lng } = selected;


    useEffect(() => {
        if (selected !== null) {
            setShowView(false);
            setConfirmationModal(false);
            setShowOptions(true);
            setForm(false);
            setShowInfoWindow(true);
        } else {
            setShowInfoWindow(false);
        }
    }, [selected]);

    const onViewBtnClick = () => {
        setShowView(true);
        setShowOptions(false);
    }

    return (
        <>
            {showInfoWindow && (
                <InfoWindow
                    position={{ lat: lat, lng: lng }}
                    onCloseClick={() => { setSelected(null) }}>
                    <>
                        {currentUser.uid !== selected.owner.id ? (

                            <MarkerView selected={selected}/>

                        ) : (

                            <>
                                {showOptions && (
                                    <OptionWindow
                                        onViewBtnClick={onViewBtnClick}
                                        setConfirmationModal={setConfirmationModal}
                                        setShowOptions={setShowOptions}
                                        setForm={setForm}
                                        setSelected={setSelected}
                                    />
                                )}
    
                                {showView && (<MarkerView selected={selected} />)}
    
                                {confirmationModal && (
                                    <ConfirmationModal
                                        onDeleteBtnClick={deleteMarker}
                                        selected={selected}
                                        setSelected={setSelected}
                                        setConfirmationModal={setConfirmationModal}
                                        setShowOptions={setShowOptions} />
                                )}
    
                                {form && (
                                    <MapForm onSubmit={updateMarker}
                                        onClose={() => setShowForm(false)}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                )}
                            </>
                        )}
                    </>
                </InfoWindow>
            )}
        </>
    )
    
}

export default MarkerInfo;