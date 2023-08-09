import React from 'react';
import './optionWindow.scss';

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

export default OptionWindow