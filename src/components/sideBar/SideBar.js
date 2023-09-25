import React, { useState, useEffect, useContext } from 'react';
import './sidebar.scss';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';
import { updateNotifications } from '../../service/NotificationsService';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import SideBarData from './SideBarData';
import IconButton from '@mui/material/IconButton';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import userPhoto from '../../ressources/img/user.png';
import { db } from "../../config/firebase";


const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [imageUrl, setImageUrl] = useState(userPhoto);
    const [notificationsAnimation, setNotificationsAnimation] = useState(false);

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

            if (currentUser?.photoURL) {
                setImageUrl(currentUser.photoURL);
            }

            return () => { };
        }

    }, [currentUser]);

    const onNotificationsClick = () => {
        if (showNotifications) {
            setNotificationsAnimation(false);
            setTimeout(() => {
                setShowNotifications(false);
            }, 500)
        } else {
            setShowNotifications(true);
        }
        if (!showNotifications) {
            updateNotifications(0, currentUser.uid);
        }
    }

    return (
        <>
            {showNotifications &&
                <Notifications
                    setShowNotifications={setShowNotifications}
                    notificationsAnimation={notificationsAnimation}
                    setNotificationsAnimation={setNotificationsAnimation}
                />}

            <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
                <IconButton
                    className={`toggle-button ${isSidebarOpen ? '' : 'closed'}`}
                    onClick={toggleSidebar}
                >
                    <ViewSidebarIcon />
                </IconButton>
                {isSidebarOpen && (
                    <div className='sidebar-content'>
                        <div className="sidebar-userImg">
                            <label id="lable" htmlFor="file">
                                <img src={currentUser.photoURL ? currentUser.photoURL : imageUrl} alt="userPhoto" type="file" className="user-photo" />
                            </label>
                        </div>
                        <p className="user-name">{currentUser?.displayName}</p>
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
                    </div>
                )}
            </div>
        </>
    )
}


export default SideBar