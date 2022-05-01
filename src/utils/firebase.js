import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; //authentication for firebase
import "firebase/compat/firestore";

const app = firebase.initializeApp({
    //caito-dev doesn't work
    // apiKey: 'AIzaSyA3bFrp0rwSJWKVi1oTPbJAN-EDkYaErvw',
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.FIREBASE_PROJECT_ID,
    // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
    // appId: process.env.FIREBASE_APP_ID,
    // measurementId: process.env.FIREBASE_MEASUREMENT_ID

    //This one works - caito-dev2
    apiKey: "AIzaSyA5WQSZqhiP4mrrIuLYuvSATTeXjI11wdk",
    authDomain: "caito-dev2.firebaseapp.com",
    projectId: "caito-dev2",
    storageBucket: "caito-dev2.appspot.com",
    messagingSenderId: "787897113351",
    appId: "1:787897113351:web:d748466f79a2cb9ce103a2",
    measurementId: "G-NLXFPJW5YN"
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