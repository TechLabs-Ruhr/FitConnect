import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import userPhoto from '../../ressources/img/user.png';
import { db } from '../../config/firebase';

export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(userPhoto);

  useEffect(() => {
    // Check if there is a currentUser and if they have a UID
    if (currentUser && currentUser.uid) {
      // Reference to the Firestore document for the current user
      const userDocRef = doc(db, 'users', currentUser.uid);

      // Subscribe to changes in the user document
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData.photoURL) {
            // Update the state with the fetched photoURL
            setImageUrl(userData.photoURL);
          }
        }
      });

      // Clean up the subscription when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  return (
    <div className='navbar'>
      <span className="logo">FitConnect</span>
      <div className="user">
        <img src={imageUrl} alt="" />
        <span>{currentUser.displayName}</span>
      </div>
    </div>
  );
};
