//Fetch user info from the database Firestore
import React, {useContext, useState, useEffect} from 'react'
import { db, auth} from '../../../utils/firebase'
import { useAuth } from './Authentication';

//Retrieve the  user data from the firestore database
const UserData = React.createContext();

export const useUserData = () => {
    return useContext(UserData);
}

export const UserDataProvider = ({children}) => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);

    const {currentUser} = useAuth();

    //only runs when the component mounts
    useEffect(() => {

        if(currentUser){
            const data = async () => {

                const  docExists = (await db.collection("teacher-info").doc(currentUser.uid).get()).exists

                if(docExists){
                    await db.collection("teacher-info").doc(currentUser.uid).get().then((querySnapshot) => {
                        console.log(querySnapshot.data())
                        setUserData(querySnapshot.data());
                    })
                } else {
                    await db.collection("officer-info").doc(currentUser.uid).get().then((querySnapshot) => {
                        console.log(querySnapshot.data())
                        setUserData(querySnapshot.data());
                    })
                }
                
                
    
                setLoading(false);
            }
    
            data()
        }

    }, [currentUser])

    const value = { userData };

    return (
        <UserData.Provider value = {value}>
            { !loading && children /* Don't render the app until a user is defined*/} 
        </UserData.Provider>
    )

}