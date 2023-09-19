import React from 'react'

export const ChatSearch = () => {
  return (
    <div className='chatsearch'>
        <div className="searchForm">
            <input type="text" placeholder='find user'/>
        </div>
        <div className="userChat">
            <img src="https://img.welt.de/img/sport/fitness/mobile246350898/8501626877-ci23x11-w1136/Athletic-man-doing-pushups-exercise-at-gym.jpg" alt="" />
            <div className="userChatInfo">
                <span>Jane</span>
            </div>
        </div>
    </div>
  )
}
