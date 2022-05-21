import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
// import 'dotenv/config';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSANGING_SENDER_ID
};
  
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
export const googleProviderWithCustomDomain = googleProvider.setCustomParameters(
    {hd: process.env.WARM_EMAIL_DOMAIN, prompt: 'select_account'});

