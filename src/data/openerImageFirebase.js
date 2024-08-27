// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3of4v-9nmvN49Ux8zHUYtSSym-TeppHY",
    authDomain: "study-560a5.firebaseapp.com",
    projectId: "study-560a5",
    storageBucket: "study-560a5.appspot.com",
    messagingSenderId: "1025421995808",
    appId: "1:1025421995808:web:e76a9205d9dfa3b84d7145",
    measurementId: "G-NL54GMQZHK"
};

// Initialize Firebase
const openerImageapp = initializeApp(firebaseConfig,'openerImage');
const openerImagestorage = getStorage(openerImageapp);
const openerImageDb = getFirestore(openerImageapp);
export {openerImageapp, openerImagestorage, openerImageDb};
