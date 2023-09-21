import { ChatSideBar } from "../components/Chat/ChatSideBar";
import SideBar from "../components/sideBar/SideBar";
import { Chat } from "../components/Chat/Chat";
import './ChatPage.scss';



const ChatPage = () => {
    return ( 
        <div className="chatPage">
            <SideBar />
            <div className="container">
                <ChatSideBar />
                <Chat />
            </div>
            

        </div>
     );
}
 
export default ChatPage;