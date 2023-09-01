import React from 'react';
import './сonfirmationModal.scss';


const ConfirmationModal = ({ onDeleteBtnClick, setSelected, selected, setView, type, setShowConfirmModal, join }) => {

    const onDeleteConfirm = () => {
        onDeleteBtnClick(selected.id);
        setSelected(null);
    }

    const onDeleteCancel = () => {
        setView('options');
    }

    const onJoinConfirm = () => {
        join();
        setShowConfirmModal(false); 
    }

    const onJoinCancel = () => {
        setShowConfirmModal(false); 
    }

    return (
        <div className='confirmation-modal'>
            <button className='btn btn-close'> &times;</button>
            <div className="confirmation-modal__content">
                {type === 'delete' && (
                    <>
                        <p className="confirmation-modal__text">Do you really want to delete the training</p>
                        <div className="confirmation-modal__buttons">
                            <button className="confirmation-modal__button cancel" onClick={onDeleteCancel}>Cancel</button>
                            <button className="confirmation-modal__button confirm" onClick={onDeleteConfirm}>Confirm</button>
                        </div>
                    </>)}
                    {type === 'join' && (
                    <>
                        <p className="confirmation-modal__text">Do you really want to join the training?</p>
                        <div className="confirmation-modal__buttons">
                            <button className="confirmation-modal__button cancel" onClick={onJoinCancel}>Cancel</button>
                            <button className="confirmation-modal__button confirm" onClick={onJoinConfirm}>Confirm</button>
                        </div>
                    </>)}
            </div>
        </div>
    )
};

export default ConfirmationModal