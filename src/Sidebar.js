import React,{useEffect,API, useState} from 'react';
import "./Sidebar.css";
import {Avatar, IconButton} from "@material-ui/core";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';

  
function Sidebar(props) {

    const [count, setCount] = useState(false);
    const [{ user, toggle },dispatch] = useStateValue();
    const [rooms,setRooms]=useState([]);

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
        console.log(`clicked ${count} times`)
      },[]);


      const handleClick=()=>(
        dispatch({
            type: actionTypes.SET_TOGGLE,
            toggle: true,
        })
    )

    return (
        <div className={toggle ?"hide_sidebar_mobile":"sidebar"}> 
            <div className="sidebar_header">
                <Avatar src={user?.photoURL}/>
                <div className="sidebar_header_right">
                    <IconButton>
                        <DonutLargeIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>  
                </div>

            </div>
            <div className="sidebar_search">
                <div className="sidebar_search_container">
                    <SearchOutlined/>
                    <input placeholder="Search or Start new Chat" type="text" className="text" />
                </div>
            </div>
            <div className="sidebar_chats" onClick={handleClick}>
                <SidebarChat addNewChat/>
                {rooms.map(room=>(
                    <SidebarChat key={room.id} id={room.id } name={room.data.name} />
                ))}
            </div>
            
        </div>
    );
}

export default Sidebar;