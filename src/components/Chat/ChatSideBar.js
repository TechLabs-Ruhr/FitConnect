import React from 'react'
import { Navbar } from './Navbar'
import { ChatSearch } from './ChatSearch'

export const ChatSideBar = () => {
  return (
    <div className='chatsidebar'>
        <Navbar />
        <ChatSearch />
        </div>
  )
}
