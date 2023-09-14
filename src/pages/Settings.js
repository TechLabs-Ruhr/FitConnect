import { useNavigate, Link } from "react-router-dom";
import SideBar from "../components/sideBar/SideBar";
import React, { useState, useEffect, useContext } from 'react';
import userPhoto from '../ressources/img/user.png'
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import './settings.scss';
import { updateProfile } from "firebase/auth";
import { updatePassword } from "firebase/auth";








const Settings = () => {
    const [imageUrl, setImageUrl] = useState(userPhoto);
    const { currentUser, auth } = useContext(AuthContext);
  const [DisplayName, setDisplayName] = useState(currentUser.displayName || '');
  const [Email, setEmail] = useState(currentUser.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [err, setErr] = useState(false);
  const [firstName, setFirstName] = useState(currentUser.firstName || '');
  const [lastName, setLastName] = useState(currentUser.lastName || '');





  // const handlePasswordChange = async () => {
  //   try {
  //     const newPasswordValue = newPassword;
  //     await updatePassword(auth.currentUser, newPasswordValue);
  //     console.log("Passwort erfolgreich geändert!");
  //   } catch (error) {
  //     console.error("Fehler beim Ändern des Passworts:", error);
  //   }
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target[0].value;
    const lastName = e.target[1].value;
    const displayName = e.target[2].value;
    const email = e.target[3].value;

    try {
      const user = currentUser;

      updateProfile(user, {
        displayName,
      });
      

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        firstName,
        lastName
      });

      
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };


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
            const docRef = doc(db, "users", currentUser.uid);
            const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setFirstName(data.firstName || ''); // Updating firstName
                    setLastName(data.lastName || ''); // Updating lastName
                    setEmail(data.email || ''); // Updating lastName
                    setDisplayName(data.displayName || ''); // Updating lastName

                }
            });

            if (currentUser?.photoURL) {
                setImageUrl(currentUser.photoURL);
            }

            return () => { 
              unsubscribe();
             };
        }

    }, [currentUser]);

    return (
        
        <div className="settings">

            <SideBar />
            <div className="userphoto">
            <input style={{ display: "none" }} type="file" id="file" onChange={handleImageChange} />
                        <label id="lable" htmlFor="file">
                            <img src={imageUrl} alt="userPhoto" type="file" className="user-photo-settings" />
                        </label>
            </div>
            <div className="profile-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">firstName</label>
            <input type="text" id="firstName" name="firstName" placeholder="Neuer Vorname" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="lastName">lastName</label>
            <input type="text" id="lastName" name="lastName" placeholder="Neuer Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="username">displayName</label>
            <input type="text" placeholder="Neuer Benutzername" id="username" name="username" value={DisplayName} onChange={(e) => setDisplayName(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" name="email" placeholder="Neue Email" value={Email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input type="password" id="password" name="password" placeholder="Neues Passwort" />
          </div>
          <button type="submit">Änderungen speichern</button>
        </form>
        </div>
        <button className="signout" onClick={() => signOut(auth)}>Ausloggen</button>

        </div>
      
            
     );
}
 
export default Settings;