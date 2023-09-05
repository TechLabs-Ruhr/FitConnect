import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
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
        title: "Gruppen",
        icon: <GroupsIcon />,
        link: "/groups"
    },
    {
        title: "Einstellungen",
        icon: <SettingsIcon />,
        link: "/settings"
    }
]
 
export default SideBarData;