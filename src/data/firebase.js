import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBpP5xpAVFfhRa3J_smIzTcw70PU5y_lQ",
    authDomain: "profiletetris.firebaseapp.com",
    projectId: "profiletetris",
    storageBucket: "profiletetris.appspot.com",
    databaseURL: "https://profiletetris-default-rtdb.asia-southeast1.firebasedatabase.app/",
    messagingSenderId: "112400262733",
    appId: "1:112400262733:web:276e1c12a1e465f1a4de04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
