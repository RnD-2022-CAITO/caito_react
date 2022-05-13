//Handle routing
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/Authentication'
import { useUserData } from '../auth/UserData'
import ErrorRoute from './ErrorRoute'

export const PrivateRoute = ({children, role}) => {
    const {currentUser} = useAuth();
    const {userData} = useUserData();
    // console.log(userData);
    if(role != "all" && role != userData.role){
        return <ErrorRoute/>
    }
    //render the component if the user signs in, or else redirect them to login path
    return currentUser ? children : <Navigate to="/login" />
}