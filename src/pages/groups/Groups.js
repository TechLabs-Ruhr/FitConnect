import SideBar from "../../components/sideBar/SideBar";
import coomingSoonImg from '../../ressources/img/coming-soon.png';
import './groups.scss'; 


const Groups = () => {
    return (
        <div className="groups">
            <SideBar />
            <div className="cooming-soon">
                <img src={coomingSoonImg} alt="cooming soon" />
            </div>
        </div>
    );
}

export default Groups;