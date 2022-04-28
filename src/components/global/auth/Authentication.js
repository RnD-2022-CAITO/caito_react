//authenticate a user
import React, {useContext, useState, useEffect} from 'react'
import {auth, db, func} from '../../../utils/firebase'

const Authenciation = React.createContext();

export const useAuth = () => {
    return useContext(Authenciation);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    //call the auth function from firebase
    function signUp(user){
        return auth.createUserWithEmailAndPassword(user.email,user.password)
        // .then(async res => {           
        //    await updateTeacherDatabase(res.user.uid, user)
            // const data = {
            //     uid: res.user.uid,
            //     firstName: user.firstName,
            //     lastName: user.lastName,
            //     email: res.user.email
            // }
            // const updateDb = func.httpsCallable('addTeacher');
            // updateDb(data).then(res => console.log(res));
        // })
        // .catch(error => console.log('error found: ',error))
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

    async function updateTeacherDatabase(userID, user){
        return await db.collection('teacher-info').doc(userID).set({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: 'teacher'
        }).catch(error => console.log(error))
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
