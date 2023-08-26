import React, { useState, useEffect, useContext } from 'react';
import './sidebar.scss';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';
import { changeNewNotifications } from '../../utils/notifications';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const docRef = doc(db, "userNotifications", currentUser.uid);
            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setNewNotifications(data.notifications.newNotifications);
                }
            });

            return () => { };
        }
    }, [currentUser]);

    const onClose = () => {
        setShowNotifications(false);
    }

    const onNotificationsClick = () => {
        setShowNotifications(!showNotifications);
        if(!showNotifications){
            changeNewNotifications(0, currentUser.uid);
        }
    }

    return (
        <>
            {showNotifications && <Notifications onClose={onClose} />}
            <div className="sidebar">
                <img src="img/arnold.png" alt="userPhoto" className="user-photo" />
                <p className="user-name">Arnold Schwarznegger</p>

                <div className="notifications">
                    <img className="notifications" src={event} onClick={onNotificationsClick} alt="notifications" />
                    {(newNotifications !== null && newNotifications > 0) && (
                        <div className='new_notifications'>
                            <p className='new_notifications-value'>{newNotifications < 9 ? newNotifications : '9+'}</p>
                        </div>
                    )}
                </div>

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
