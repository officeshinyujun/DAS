// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXnzSmO7W3hrVFPcaPWO6dNPaD3xkN3oo",
    authDomain: "tetristonew.firebaseapp.com",
    projectId: "tetristonew",
    storageBucket: "tetristonew.appspot.com",
    messagingSenderId: "61625736754",
    databaseURL:"https://tetristonew-default-rtdb.asia-southeast1.firebasedatabase.app/",
    appId: "1:61625736754:web:03577aa0335e97b02b262b"
};

// Initialize Firebase
const toNewapp = initializeApp(firebaseConfig, 'toNew');
const toNewdb = getFirestore(toNewapp);
const toNewstorage = getStorage(toNewapp);
export {toNewstorage, toNewapp, toNewdb};