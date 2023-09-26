import { ChatSideBar } from "../components/Chat/ChatSideBar";
import SideBar from "../components/sideBar/SideBar";
import { Chat } from "../components/Chat/Chat";
import './ChatPage.scss';
import { useState } from "react";




const ChatPage = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const containerStyle = {
    width: isSidebarOpen ? '85%' : '95%', // Adjust the widths as needed
  };
    
    return ( 
        <div className="chatPage">
            <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
            <div className="container" style={containerStyle}>
                <ChatSideBar />
                <Chat />
            </div>
            

        </div>
     );
}
 
export default ChatPage;