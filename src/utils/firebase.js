import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; //authentication for firebase
import "firebase/compat/firestore";

const app = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
})

export const db =firebase.firestore();

export const auth = app.auth(); //authentication

export default app;

/* FIREBASE_API_KEY=AIzaSyA3bFrp0rwSJWKVi1oTPbJAN-EDkYaErvw
FIREBASE_AUTH_DOMAIN=caito-dev.firebaseapp.com
FIREBASE_PROJECT_ID=caito-dev
FIREBASE_STORAGE_BUCKET=caito-dev.appspot.com
FIREBASE_MESSAGING_SENDERID=212508955155
FIREBASE_APP_ID=1:212508955155:web:32e6dd9004da66989165e6
FIREBASE_MEASUREMENT_ID=G-Z98HH5NJ6R */