import { useNavigate, Link } from "react-router-dom";
import SideBar from "../components/sideBar/SideBar";
import React, { useState, useEffect, useContext } from 'react';
import userPhoto from '../ressources/img/user.png'
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import './settings.scss';






const Settings = () => {
    const [imageUrl, setImageUrl] = useState(userPhoto);
    const { currentUser } = useContext(AuthContext);


    const handleImageChange = async (e) => {
        if (e.target.files[0]) {
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            const uploadTask = await uploadBytesResumable(storageRef, e.target.files[0]);
            const downloadURL = await getDownloadURL(uploadTask.ref);
            await updateProfile(auth.currentUser, { photoURL: downloadURL });
            setImageUrl(downloadURL);
        }
    }

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const docRef = doc(db, "userNotifications", currentUser.uid);
            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                }
            });

            if (currentUser?.photoURL) {
                setImageUrl(currentUser.photoURL);
            }

            return () => { };
        }

    }, [currentUser]);

    return (
        <div className="settings">
            <div className="sidebar">
            <SideBar />
            </div>
            <div className="userphoto">
            <input style={{ display: "none" }} type="file" id="file" onChange={handleImageChange} />
                        <label id="lable" htmlFor="file">
                            <img src={imageUrl} alt="userPhoto" type="file" className="user-photo-settings" />
                        </label>
            </div>
            <div className="profile-form">
        <form>
          <div className="form-group">
            <label htmlFor="firstName">Vorname</label>
            <input type="text" id="firstName" name="firstName" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Nachname</label>
            <input type="text" id="lastName" name="lastName" />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Änderungen speichern</button>
        </form>
        </div>
        </div>
      
            
     );
}
 
export default Settings;