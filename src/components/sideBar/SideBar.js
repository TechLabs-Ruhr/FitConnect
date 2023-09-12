import React, { useState, useEffect, useContext } from 'react';
import './sidebar.scss';
import { signOut, updateProfile } from "firebase/auth";
import { auth, storage } from '../../firebase';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';
import { updateNotifications } from '../../service/NotificationsService';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import SideBarData from './SideBarData';
import IconButton from '@mui/material/IconButton';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { ref } from "firebase/storage";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import userPhoto from '../../ressources/img/user.png';
import { CSSTransition } from 'react-transition-group';


const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [imageUrl, setImageUrl] = useState(userPhoto);

    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            const uploadTask = await uploadBytesResumable(storageRef, e.target.files[0]);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            setImageUrl(downloadURL);
        }
    }

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

    const onClose = () => {
        setShowNotifications(false);
    }

    const onNotificationsClick = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            updateNotifications(0, currentUser.uid);
        }
    }

    return (
        <>
            <CSSTransition
                in={showNotifications}
                timeout={500}
                classNames="list-transition"
                unmountOnExit
                appear
            >
                <Notifications onClose={onClose} />
            </CSSTransition>

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
                            <input style={{ display: "none" }} type="file" id="file" onChange={handleImageChange} />
                            <label id="lable" htmlFor="file">
                                <img src={imageUrl} alt="userPhoto" type="file" className="user-photo" />
                            </label>
                        </div>
                        <p className="user-name">{currentUser.displayName}</p>
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
                        <button className="btn btn-red log-out" onClick={() => signOut(auth)}>Log out</button>
                    </div>
                )}
            </div>
        </>
    )
}


export default SideBar