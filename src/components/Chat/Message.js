import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { fromUnixTime, format, isToday } from 'date-fns';
import userImg from '../../ressources/img/user.png';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const formattedDate = formatChatTimestamp(message.date);
  const profileImg = (message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL) || userImg; 

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img src={profileImg} alt="profile img"/>
        <span className="message-date">{formattedDate}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

const formatChatTimestamp = (timestamp) => {
  const date = fromUnixTime(timestamp.seconds);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
};

export default Message;