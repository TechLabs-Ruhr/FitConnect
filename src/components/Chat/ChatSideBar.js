import React from 'react'
import { Navbar } from './Navbar'
import { ChatSearch } from './ChatSearch'
import { Chats } from './Chats'

export const ChatSideBar = () => {
  return (
    <div className='chatsidebar'>
        <Navbar />
        <ChatSearch />
        <Chats />
        </div>
  )
}
