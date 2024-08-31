import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_ACCOUNT_API_KEY,
    authDomain: process.env.REACT_APP_ACCOUNT_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_ACCOUNT_PROJECTID,
    storageBucket: process.env.REACT_APP_ACCOUNT_STORAGE_BUCKET,
    databaseURL: process.env.REACT_APP_ACCOUNT_DATABASE_URL,
    messagingSenderId: process.env.REACT_APP_ACCOUNT_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_ACCOUNT_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
export default app;
