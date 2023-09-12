import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';

const SideBarData = [
    {
        title: "Map",
        icon: <MapIcon />,
        link: "/"
    },
    {
        title: "Chat",
        icon: <ChatIcon />,
        link: "/chat"
    },
    {
        title: "Groups",
        icon: <GroupsIcon />,
        link: "/groups"
    },
    {
        title: "Settings",
        icon: <SettingsIcon />,
        link: "/settings"
    }
]
 
export default SideBarData;