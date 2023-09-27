import { getDoc, setDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export const createChat = async (currentUser, user) => {
    const combinedId =
      currentUser.uid > user.id
        ? currentUser.uid + user.id
        : user.id + currentUser.uid;
    
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.id,
            displayName: user.name,
            photoURL: user.photo,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.id), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
  };