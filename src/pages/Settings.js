import { useNavigate } from "react-router-dom";
import SideBar from "../components/sideBar/SideBar";
import React, { useState, useEffect, useContext } from 'react';
import userPhoto from '../ressources/img/user.png'
import { AuthContext } from '../context/AuthContext';
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import './settings.scss';
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth, storage, db } from '../config/firebase';
import { updatePassword } from "firebase/auth";
import 'firebase/auth';
import 'firebase/storage';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";








const Settings = () => {
    const [imageUrl, setImageUrl] = useState(userPhoto);
    const { currentUser } = useContext(AuthContext);
  const [DisplayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [Email, setEmail] = useState(currentUser?.email || '');
  const [err, setErr] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdatePassword = async () => {
    try {
      // Reauthentifiziere den Benutzer mit dem aktuellen Passwort
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Ändere das Passwort auf das neue Passwort
      await updatePassword(user, newPassword);

      // Erfolgsmeldung anzeigen und Passwort-Felder zurücksetzen
      alert('Passwort erfolgreich geändert!');
      setCurrentPassword('');
      setNewPassword('');

      // Optional: Hier kannst du den Benutzer ausloggen
    } catch (error) {
      console.error('Fehler beim Ändern des Passworts:', error);
      setPasswordChangeError('Fehler beim Ändern des Passworts. Stellen Sie sicher, dass das aktuelle Passwort korrekt ist.');
    }
  };

  

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  

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
    console.log('10')
    if (e.target.files[0]) {
      
        const storageRef = ref(storage, `avatars/${currentUser.uid}`);
        const uploadTask = await uploadBytesResumable(storageRef, e.target.files[0]);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        console.log('1')
        
        // Aktualisieren Sie die Firestore-Daten des Benutzers, einschließlich 'photoURL'
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          photoURL: downloadURL

        });
        console.log('2')
  
        // Aktualisieren Sie das Benutzerprofil in Firebase Authentication
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
  
        // Aktualisieren Sie das Bild-URL im State oder wo auch immer Sie es verwenden
        setImageUrl(downloadURL);
     
    }
  };
  

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
            <input style={{ display: "none" }} type="file" id="cs" onChange={(e) => handleImageChange(e)} />
                        <label id="cs" htmlFor="cs">
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
            <label htmlFor="currentPassword">Aktuelles Passwort</label>
            <input type={showPassword ? 'text' : 'password'} id="currentPassword" name="currentPassword" placeholder="Aktuelles Passwort" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <label htmlFor="newPassword">Neues Passwort</label>
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" placeholder="Neues Passwort" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <button className="toggle" onClick={handleTogglePassword}>
              {showPassword ? 'Hide' : 'Show'} Password
            </button>
            <button className="button-updatepassword" onClick={handleUpdatePassword}>Passwort ändern</button>
          </div>
          <button type="submit">Änderungen speichern</button>
        </form>
        </div>
        <button className="signout"onClick={() => {signOut(auth); navigate("/");}}>Ausloggen</button>
        </div>
      
            
     );
}
 
export default Settings;