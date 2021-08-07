import React,{useEffect, useState} from 'react';
import "./Sidebar.css";
import {Avatar, IconButton} from "@material-ui/core";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from "./SidebarChat";
import db from "../firebase";
import { useStateValue } from '../StateProvider';
import { actionTypes } from '../reducer';
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
  
function Sidebar() {

    const [{ user, toggle },dispatch] = useStateValue();
    const [rooms,setRooms]=useState([]);
    const [search, setSearch] = useState(``);
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        
        const unsubscribe=db.collection('rooms').onSnapshot(snapshot=>
            setRooms(snapshot.docs.map((doc)=>({
                id:doc.id,
                data:doc.data(),
            }))
            )
            );
            return ()=>{
                unsubscribe();
            }
       
      },[]);

      const exitApp = () => {
        localStorage.removeItem("uid");
        window.location.reload();
        setLogout(true);
      };


      const handleClick=()=>(
        dispatch({
            type: actionTypes.SET_TOGGLE,
            toggle: true,
        })
    );

    


    const filteredRooms= rooms.filter(room=>{
       return room.data.name.toLowerCase().includes(search.toLowerCase());
    })


    const photoURL =
    localStorage.getItem("photoURL") !== ""
      ? localStorage.getItem("photoURL")
      : null;
  const displayName = localStorage.getItem("displayName");


    return (
        <div className={toggle ?"hide_sidebar_mobile":"sidebar"}> 
            <div className="sidebar_header">
            <div className="sidebar_header_user_details">
                <Avatar className="avatar_image" src={photoURL}/>
                <p>{displayName}</p>
                </div>
                <div className="sidebar_header_right">
                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <ExitToAppIcon  onClick={exitApp}/>
                    </IconButton>  
                </div>

            </div>
            <div className="sidebar_search">
                <div className="sidebar_search_container">
                    <SearchOutlined/>
                    <input placeholder="Search or Start new Chat" type="text" className="text" onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
            <div className="sidebar_chats" >
            { search ?
                (
                <div onClick={handleClick}>
                {filteredRooms.map(room=>(
                    <SidebarChat key={room.id} id={room.id } name={room.data.name} />
                ))}
                </div>
                ):(<div>
                <SidebarChat addNewChat/>
                <div onClick={handleClick}>
                {rooms.map(room=>(
                    <SidebarChat key={room.id} id={room.id } name={room.data.name} />
                ))} 
                </div>
                </div>)
                }
                
            </div>
            
        </div>
    );
}

export default Sidebar;