// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use

// Your web app's Firebase configuration
const openerfirebaseConfig = {
    apiKey: process.env.REACT_APP_COMMUNITY_API_KEY,
    authDomain: process.env.REACT_APP_COMMUNITY_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_COMMUNITY_PROJECTID,
    storageBucket: process.env.REACT_APP_COMMUNITY_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_COMMUNITY_MESSAGINGSENDERID,
    databaseURL : process.env.REACT_APP_COMMUNITY_DATABASE_URL,
    appId: process.env.REACT_APP_COMMUNITY_APPID
};

// Initialize Firebase
const openerapp = initializeApp(openerfirebaseConfig, 'opener');
const openerdb = getFirestore(openerapp);
const openerstorage = getStorage(openerapp);
export { openerdb, openerstorage, openerapp };