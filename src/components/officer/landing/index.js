//Main page for the components
import React from 'react'
import { useAuth } from '../../global/auth/Authentication'
import { useUserData } from '../../global/auth/UserData'

const OfficerLanding = () => {

    const {currentUser} = useAuth();
    const {userData} = useUserData();

    return (
        <div>
            <h1>Welcome, {userData.firstName} </h1>
            <p>Name: {userData.firstName} {userData.lastName}</p>
            <p>Role: {userData.role}</p>
            <p>Email: {currentUser.email}</p>
            <p>You can
                 <a href='/surveyMaking'> create</a>, 
                 <a href='/surveyDistribution'> distribute</a>, and 
                 <a href='/summary'> view</a> your surveys.</p>
        </div>

    )
}

export default OfficerLanding