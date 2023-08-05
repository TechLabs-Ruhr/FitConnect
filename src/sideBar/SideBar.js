import React from 'react';
import './sidebar.scss';
import SideBarData from './SideBarData';

const SideBar = () => {
    return (
            
            <div className="sidebar">
                <img src="img/arnold.png" alt="userPhoto" className="user-photo" />
                <p className="user-name">Arnold Schwarznegger</p>
                <ul className="SideBarList">
                {SideBarData.map((val, key)=> {
                    return (<li
                        className='row'
                        id={window.location.pathname == val.link ? "active" : ""} 
                        onClick={()=> 
                        {window.location.pathname = val.link;
                        }}>
                        {" "}
                        <div id="icon">{val.icon}</div>{" "}
                        <div id="title">
                            {val.title}
                        </div>
                        </li>
                
                    );
            })}
            </ul> 
            </div>
            );
}

export default SideBar;


 {/* <img src="img/arnold.png" alt="userPhoto" className="user-photo" />
            <p className="user-name">Arnold Schwarznegger</p>

            <nav className="nav">
                <ul className="sidebar-menu">
                    <li className="sidebar-item">
                        <a href='#' className="sidebar-link">
                            <img src="img/sidebar/search.png" alt="Suchen" />
                            <p>Suchen</p>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href='#' className="sidebar-link">
                            <img src="img/sidebar/chat.png" alt="Chat" />
                            <p>Chat</p>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href='#' className="sidebar-link">
                            <img src="img/sidebar/groups.png" alt="Gruppen" />
                            <p>Gruppen</p>
                        </a>
                    </li>
                    <li className="sidebar-item">
                        <a href='#' className="sidebar-link">
                            <img src="img/sidebar/settings.png" alt="Einstellungen" />
                            <p>Einstellungen</p>
                        </a>
                    </li>
                </ul>
            </nav>

            <button className="btn btn-red log-out">Ausloggen</button> */}