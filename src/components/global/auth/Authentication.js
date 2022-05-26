/*
This useContext authenticate a user by using Firebase Authentication
To get user's information such as email, username, userID,...
import {useAuth} and deconstruct it:
    const {currentUser} = useAuth();
*/
import React, {useContext, useState, useEffect} from 'react'
import app, {func, auth} from '../../../utils/firebase'
import firebase from 'firebase/compat/app';
import 'firebase/compat/app-check';

const Authenciation = React.createContext();
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';


//Authenticate a user: get their current info, sign in, sign up, sign out
export const useAuth = () => {
    return useContext(Authenciation);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    //call the auth function from firebase
    async function signUp(user){
        return auth.createUserWithEmailAndPassword(user.email,user.password)
        .then(async u => {
            // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
            // key is the counterpart to the secret key you set in the Firebase console.
            app.appCheck().activate(site_key, true);
            const addTeacher = func.httpsCallable('teacher-addTeacher');
            try {
                const response = await addTeacher({
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
                console.log(response);
            } catch (e) {
                console.error(e);
            }
        });
    }

    function signIn(email, password){
        return auth.signInWithEmailAndPassword(email, password)
    }

    function signOut(){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email);
    }

    function updateEmail(email){
        return auth.currentUser.updateEmail(email);
    }

    async function updatePassword(oldPass, newPass){
        await reauthenticate(oldPass)
        return auth.currentUser.updatePassword(newPass);
    }
    //reauthenticate the user to update details
    const reauthenticate = currentPassword => {
        const cred = firebase.auth.EmailAuthProvider.credential(
            auth.currentUser.email, currentPassword);
        return auth.currentUser.reauthenticateWithCredential(cred);
    }

    //only runs when the component mounts
    useEffect(() => {
        //Firebase notify if a user is created
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false); //user has signed up
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateEmail,
        updatePassword,
    }

    return (
        <Authenciation.Provider value = {value}>
            {!loading && children /* Don't render the app until a user is defined*/} 
        </Authenciation.Provider>
    )
}
