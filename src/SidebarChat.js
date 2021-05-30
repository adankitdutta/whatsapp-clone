import React, {useEffect, useState} from 'react';
import {Avatar} from "@material-ui/core";
import './SidebarChat.css';
import db from './firebase';
import {Link} from 'react-router-dom';
import DeleteIcon from '@material-ui/icons/Delete';
import { password } from "./constants";

function SidebarChat({id,name,addNewChat}) {
    const [seed, setSeed] = useState("");
    const [messages, setMessages] = useState("");
    
    useEffect(() => {
        if(id){
            db.collection('rooms').doc(id).collection('messages').orderBy('timestamp','desc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map((doc) => doc.data()))
            })
        }
    }, [id]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));        
    }, []);

    const createChat = () => {
        const roomName = prompt("Please Enter Name for Chat");

        if(roomName){
            db.collection("rooms").add({
                name: roomName,
            })
        }
    };


    const deleteRoom = () => {
        const passwordVerify = prompt("Enter Admin Password to delete Room");
        if (passwordVerify === password) {
          db.collection("rooms")
            .doc(id)
            .delete()
            .then(function () {
              window.location = "/";
            })
            .catch(function (error) {
              console.error("Error removing document: ", error);
            });
        } else {
          alert("You are not authorised to delete rooms");
        }
      };

    return !addNewChat ? (
        <div className="sidebarChat">
        <Link to={`/rooms/${id}`} key={id}>
            <div className="sidebar_details">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className="sidebarChat_info">
                    <h2>{name}</h2>
                    <p className="message_content">{messages[0]?.message}</p>
                </div>
                </div>
        </Link>
        <div className="sidebarChat__delete" onClick={deleteRoom}>
                <DeleteIcon/>
        </div>
        </div>
    ) : (
        <div onClick={createChat} className="sidebarChat">
            <h3 className="add-new-chat-title">Add New Chat</h3>
        </div>
    )
}

export default SidebarChat