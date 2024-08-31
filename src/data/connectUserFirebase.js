// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8WZgDwt3hjvzTj9oeDGSGwk9XtMv4kyE",
    authDomain: "tetristoconnectuser.firebaseapp.com",
    projectId: "tetristoconnectuser",
    storageBucket: "tetristoconnectuser.appspot.com",
    messagingSenderId: "978012164642",
    appId: "1:978012164642:web:d9392cbfe884985c43307b"
};

// Initialize Firebase
const chatapp = initializeApp(firebaseConfig, 'chat');
const chatdb = getFirestore(chatapp);
const chatstorage = getStorage(chatapp);
export {chatapp, chatdb, chatstorage};