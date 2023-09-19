import React from 'react'
import { Messages } from './Messages'
import { Input } from './Input'

export const Chat = () => {
  return (
    <div className='chat-chat'>
        <div className="chatInfo">
            <span>Jane</span>
            <div className="chatIcons">
                
            </div>
            
        </div>
        <Messages/>
        <Input/>
    </div>
  )
}
