//authenticate a user
import React, {useContext, useState, useEffect} from 'react'
import app, {func, auth} from '../../../utils/firebase'
import 'firebase/compat/app-check';

const Authenciation = React.createContext();
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

export const useAuth = () => {
    return useContext(Authenciation);
}

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    //call the auth function from firebase
    function signUp(user){
        auth.createUserWithEmailAndPassword(user.email,user.password)
        .then(async u => {
            console.log(u);
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

    /*async function updateTeacherDatabase(userID, user){
        return await db.collection('teacher-info').doc(userID).set({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: 'teacher'
        }).catch(error => console.log(error))
    }*/

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
