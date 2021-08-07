import firebase from "firebase";
import "firebase/storage";
import {APIKEY,MESSAGEID,AUTHDOMAIN, APPID} from "./constants";

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain:AUTHDOMAIN,
    projectId: "whatsapp-clone-7f7f9",
    storageBucket: "whatsapp-clone-7f7f9.appspot.com",
    messagingSenderId: MESSAGEID,
    appId: APPID
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig);

  const db=firebase.firestore();

  const auth=firebase.auth();

  const provider=new firebase.auth.GoogleAuthProvider();

  export {auth,provider};

  export default db;