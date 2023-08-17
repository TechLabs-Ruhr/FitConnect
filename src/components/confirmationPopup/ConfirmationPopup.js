import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import './confirmationPopup.scss'; 
import greenCheck from '../../ressources/img/check-green.png';

const ConfirmationPopup = ({ id, setShowPopup }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsVisible(false);
        setShowPopup(false); 
    }, 1000);

    return () => clearTimeout(timer);
}, [isVisible]);

  const popups = [
    {
      id: "create",
      text: "Success! New Training was created!",
      src: greenCheck
    },
    {
      id: "update",
      text: "Success! Your Training was updated!",
      src: greenCheck
    },
    {
      id: "delete",
      text: "Success! Your Training was deleted!",
      src: greenCheck
    }
  ];

  const pop = popups.find(popup => popup.id === id);

  return isVisible ? ReactDOM.createPortal(
    <div className={`popup ${isVisible ? '' : 'hidden'}`} onClick={() => setIsVisible(false)}>
        <img src={pop.src} alt={pop.id} className='popup-img'/>
        <p className="popup-text">{pop.text}</p>
    </div>,
    document.getElementById('root')
) : null;
}

export default ConfirmationPopup