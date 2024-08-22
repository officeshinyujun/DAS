// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const openerfirebaseConfig = {
    apiKey: "AIzaSyAAdqNRSfVngij-PO0ALDTTfsP5uZLuB1M",
    authDomain: "tetrisopener.firebaseapp.com",
    projectId: "tetrisopener",
    storageBucket: "tetrisopener.appspot.com",
    messagingSenderId: "875551200845",
    databaseURL : "https://tetrisopener-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:875551200845:web:3ed611438bc2dc4d26ee04"
};

// Initialize Firebase
const openerapp = initializeApp(openerfirebaseConfig, 'opener');
const openerdb = getFirestore(openerapp);
const openerstorage = getStorage(openerapp);
export { openerdb, openerstorage, openerapp };