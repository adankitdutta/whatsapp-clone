import React, {useState,useEffect,useRef} from 'react';
import {Avatar, IconButton} from '@material-ui/core';
import { MoreVert} from '@material-ui/icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import MicIcon from '@material-ui/icons/Mic';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import './Chat.css';
import { useParams } from 'react-router-dom';
import db,{} from './firebase';
import firebase from 'firebase';
import {useStateValue} from "./StateProvider";
import { actionTypes } from './reducer';
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import SendIcon from '@material-ui/icons/Send';

function Chat() {
    const storage = firebase.storage();
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState("");
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user,toggle}, dispatch] = useStateValue();
    const [emoji, setEmoji] = useState(false);

    const messageEl = useRef(null);

    const addEmoji = (e) => {
        let emoji = e.native;
        setInput(input + emoji);
      };

    useEffect(()=>{
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
                setRoomName(snapshot.data().name);
            });

            db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp","asc").onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        }
    },[roomId]);

    useEffect(() => {
        if (messageEl) {
          messageEl.current.addEventListener('DOMNodeInserted', event => {
            const { currentTarget: target } = event;
            target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
          });
        }
      }, [])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));        
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setInput("");
    }


    const handleClick=()=>(
        dispatch({
            type: actionTypes.SET_TOGGLE,
            toggle: false,
        })
    );
    const hiddenFileInput = useRef(null);

    const uploadImage= (() => {
        console.log("hry");
        hiddenFileInput.current.click();
    });

    const handleChange = async (event) => {
        console.log("I am Clicked");
        const file = event.target.files[0];
        const storageRef=storage.ref();
        const fileRef=storageRef.child(file.name);
        await fileRef.put(file)
        const fileUrl= await fileRef.getDownloadURL()
        db.collection('rooms').doc(roomId).collection('messages').add({
            imageUrl: fileUrl,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    };


    return (
        <div className={toggle ?"chat":"hide_chat_mobile"}>
            <div className='chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className='chat_headerInfo'>
                    <h3 className='chat-room-name'>{roomName}</h3>
                    <p className='chat-room-last-seen'>
                        Last seen {" "}
                        {new Date(new Date(
                            messages[messages.length - 1]?.
                            timestamp?.toDate()
                        ).toUTCString()).toLocaleString()}
                    </p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <ArrowBackIcon onClick={handleClick}/>
                    </IconButton>
                    
                    <IconButton>
                        <MoreVert/>
                    </IconButton>
                    
                </div>
            </div>
            <div className='chat_body' ref={messageEl} >
                {messages.map(message => (
                    <p className={`chat_message ${ message.name === user.displayName && 'chat_receiver'}`}>
                        <span className="chat_name">{message.name}</span>
                        {message.message?<p className="message_content">{message.message}</p>:<img className="image_msg" alt={message.name} src={message.imageUrl}/>}
                        <span className="chat_timestemp"> {new Date(new Date(message.timestamp?.toDate()).toUTCString()).toLocaleString()}</span>
                    </p>
                ))}
            </div>
            <div className='chat_footer'>
            <IconButton>
            <InsertEmoticonIcon
                className="yellow"
                onClick={() => setEmoji(!emoji)}
              />
              {emoji ? <Picker onSelect={addEmoji} /> : null}
            </IconButton>
                    <IconButton>
                        <AddPhotoAlternateIcon onClick={uploadImage}/>
                    </IconButton>
                <form>
                    <input type="file" style={{display:'none'}} ref={hiddenFileInput} onChange={handleChange} />
                    <input className="message_input" value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Type a message"/>
                    <button type="submit" onClick={sendMessage}> Send a Message</button>
                </form>
                <IconButton>
                {input ? <SendIcon onClick={sendMessage}/> : <MicIcon />}
            </IconButton>
            </div>
        </div>
    )
}

export default Chat;