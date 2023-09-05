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
                {type === 'delete' &&
                    <View
                        onCancel={onDeleteCancel}
                        onConfirm={onDeleteConfirm}
                        message={"Do you really want to delete the training?"} />}
                {type === 'join' &&
                    <View
                        onCancel={onJoinCancel}
                        onConfirm={onJoinConfirm}
                        message={"Do you really want to join the training?"} />}
            </div>
        </div>
    )
};

const View = ({ onCancel, onConfirm, message }) => {
    return (
        <>
            <p className="confirmation-modal__text">{message}</p>
            <div className="confirmation-modal__buttons">
                <button className="confirmation-modal__button cancel" onClick={onCancel}>Cancel</button>
                <button className="confirmation-modal__button confirm" onClick={onConfirm}>Confirm</button>
            </div>
        </>)
}

export default ConfirmationModal