import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCiIm7o7ABW0dpakGU2cRHB-iqGz6To6g4",
    authDomain: "whatsapp-clone-7f7f9.firebaseapp.com",
    projectId: "whatsapp-clone-7f7f9",
    storageBucket: "whatsapp-clone-7f7f9.appspot.com",
    messagingSenderId: "698813236310",
    appId: "1:698813236310:web:b6147dec8788b7e40527f7"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig);

  const db=firebase.firestore();

  const auth=firebase.auth();

  const provider=new firebase.auth.GoogleAuthProvider();

  export {auth,provider};

  export default db;