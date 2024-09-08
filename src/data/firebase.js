import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCTu5f_tTX76Dx5QF5Djvd5t9HntvJa2Fg",
    authDomain: "tetrislogin-abc4b.firebaseapp.com",
    projectId: "tetrislogin-abc4b",
    storageBucket: "tetrislogin-abc4b.appspot.com",
    databaseURL:"https://tetrislogin-abc4b-default-rtdb.asia-southeast1.firebasedatabase.app/",
    messagingSenderId: "102691718025",
    appId: "1:102691718025:web:95d27180566a96a4d1d758"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app