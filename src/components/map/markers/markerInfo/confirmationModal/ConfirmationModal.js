import React from 'react';
import './сonfirmationModal.scss';


const ConfirmationModal = ({ onDeleteBtnClick, setSelected, selected, setView }) => {
    const onConfirm = () => {
        onDeleteBtnClick(selected.id);
        setSelected(null);
    }

    const onCancel = () => {
        setView('options');
    }

    return (
        <div className='confirmation-modal'>
            <button className='btn btn-close'> &times;</button>
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

export default ConfirmationModal