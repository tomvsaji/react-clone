// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCRUoP1QNzGrQ8e0EmyiF9X30sHHehPSzE",
  authDomain: "instagram-clone-react-c6b2a.firebaseapp.com",
  projectId: "instagram-clone-react-c6b2a",
  storageBucket: "instagram-clone-react-c6b2a.appspot.com",
  messagingSenderId: "322796681371",
  appId: "1:322796681371:web:64530cb8609653e8eb2e3e",
  measurementId: "G-F5FLR7X1XZ"
});

// Initialize Firebase

const db = firebaseApp.firestore();
const auth  = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};