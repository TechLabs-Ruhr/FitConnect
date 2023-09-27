import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import {db} from '../../config/firebase'
import { ChatContext } from '../../context/ChatContext';
import userImg from '../../ressources/img/user.png'; 

export const Chats = () => {

    const [chats, setChats] = useState([])

    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    useEffect(()=>{
        
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
            setChats(doc.data() || {});
        });

        return () => {
            unsub();
        };
    };

    currentUser.uid && getChats()
    }, [currentUser.uid]);


    const handleSelect = (u) => {
        dispatch({type:"CHANGE_USER", payload: u});
    };
  return (
    <div className='chats'>
        {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
            <img src={chat[1].userInfo.photoURL ? chat[1].userInfo.photoURL : userImg  } alt="user-photo" />
            <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
            </div>
        </div>
        ))}
    </div>
  )
}
