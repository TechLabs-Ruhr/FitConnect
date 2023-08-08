import React from 'react';
import './editWindow.scss'; 

const EditWindow = ({ selected, setSelected }) => {

    return(
        selected && (
            <div className='edit-marker'>
            <button className='btn btn-view'>View</button>
            <button className='btn btn-edit'>Edit</button>
            <button className='btn btn-delete'>Delete</button>
            <button className='btn btn__edit-close' onClick={() => setSelected(null)}> &times;</button>
        </div>
        )
    )
}

export default EditWindow