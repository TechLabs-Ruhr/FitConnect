import React, { useState, useEffect, useContext } from 'react';
import './sidebar.scss';
import { signOut, updateProfile } from "firebase/auth";
import { auth, storage } from '../../firebase';
import Notifications from '../notifications/Notifications';
import event from '../.././ressources/img/notificationBtn.png';
import { changeNewNotifications } from '../../utils/notifications';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import SideBarData from './SideBarData';
import IconButton from '@mui/material/IconButton'; // Material-UI IconButton
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { ref } from "firebase/storage";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";




   

    const SideBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("/img/arnold.png");

    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            const uploadTask = await uploadBytesResumable(storageRef, e.target.files[0]);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            await updateProfile(auth.currentUser, {photoURL: downloadURL});
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

            return () => { };
        }

        if (currentUser?.photoURL) {
            setImageUrl(currentUser.photoURL);
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
            <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
            <IconButton
                className={`toggle-button ${isSidebarOpen ? '' : 'closed'}`}
                onClick={toggleSidebar}
            >
                <ViewSidebarIcon /> 
            </IconButton>
            {isSidebarOpen && (
                <>
                    <input style={{ display:"none" }} type="file" id="file" onChange={handleImageChange}/>
                    <label id="lable" htmlFor="file">
                        <img src={imageUrl} alt="/img/arnold.png" type="file" className="user-photo" />
                    </label>
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
    

export default SideBar