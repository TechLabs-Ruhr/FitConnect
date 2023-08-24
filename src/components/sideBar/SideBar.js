import React, {useState} from 'react';
import './sidebar.scss';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';

const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    const onClose = () => {
        setShowNotifications(false); 
    }

    return (
        <>  
            {showNotifications && <Notifications onClose={onClose}/>}
            <div className="sidebar">
                <img src="img/arnold.png" alt="userPhoto" className="user-photo" />
                <p className="user-name">Arnold Schwarznegger</p>

                <img className="notifications" src={event} onClick={() => setShowNotifications(!showNotifications)} alt="notifications" />

                <nav className="nav">
                    <ul className="sidebar-menu">
                        <li className="sidebar-item">
                            <a href='#' className="sidebar-link">
                                <img src="img/sidebar/search.png" alt="Suchen" />
                                <p>Suchen</p>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href='#' className="sidebar-link">
                                <img src="img/sidebar/chat.png" alt="Chat" />
                                <p>Chat</p>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href='#' className="sidebar-link">
                                <img src="img/sidebar/groups.png" alt="Gruppen" />
                                <p>Gruppen</p>
                            </a>
                        </li>
                        <li className="sidebar-item">
                            <a href='#' className="sidebar-link">
                                <img src="img/sidebar/settings.png" alt="Einstellungen" />
                                <p>Einstellungen</p>
                            </a>
                        </li>
                    </ul>
                </nav>

                <button className="btn btn-red log-out" onClick={() => signOut(auth)}>Ausloggen</button>
            </div>
        </>
    )
}

export default SideBar;
