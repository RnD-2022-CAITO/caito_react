//authenticate a user
import React, {useContext, useState, useEffect} from 'react'
import {auth, db} from '../../../utils/firebase'

const Authenciation = React.createContext();

export const useAuth = () => {
    return useContext(Authenciation);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    //call the auth function from firebase
    async function signUp(user){
        try{
            const res = await auth.createUserWithEmailAndPassword(user.email,user.password);
            const newUser = res.user;
            console.log(user);
            return await db.collection("teacher-info").doc(newUser.uid).set({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: 'teacher'
            });
        }catch(e){
            console.log(e);
        }

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

    function updatePassword(email){
        return auth.currentUser.updatePassword(email);
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
        updatePassword
    }

    return (
        <Authenciation.Provider value = {value}>
            {!loading && children /* Don't render the app until a user is defined*/} 
        </Authenciation.Provider>
    )
}
