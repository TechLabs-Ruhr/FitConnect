import React, { useState, useEffect, useContext } from 'react';
import './sidebar.scss';
import { signOut } from "firebase/auth";
import { auth } from '../../Firebase';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';
import { changeNewNotifications } from '../../utils/notifications';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";
import SideBarData from './SideBarData';
import IconButton from '@mui/material/IconButton'; // Material-UI IconButton
import MenuIcon from '@mui/icons-material/Menu';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';


const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
        if (!showNotifications) {
            changeNewNotifications(0, currentUser.uid);
        }
    }

    return (
        <>
            {showNotifications && <Notifications onClose={onClose} />}
            <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                <IconButton
                    className={`toggle-button ${isSidebarOpen ? '' : 'closed'}`}
                    onClick={toggleSidebar}
                >
                    <ViewSidebarIcon />
                </IconButton>
                {isSidebarOpen && (
                    <>
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
                        <ul className="SideBarList">
                            {SideBarData.map((val, key) => (
                                <li
                                    key={key}
                                    className={`row ${window.location.pathname === val.link ? 'active' : ''}`}
                                    onClick={() => {
                                        console.log(window.location.pathname)
                                        console.log(val.link);
                                        window.location.pathname = val.link;
                                    }}
                                >
                                    <div id="icon">{val.icon}</div>
                                    <div id="title">{val.title}</div>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-red log-out" onClick={() => signOut(auth)}>Ausloggen</button>

                    </>
                )}
            </div>




        </>
    )
}

export default SideBar;
