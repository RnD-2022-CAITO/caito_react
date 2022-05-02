//Main page for the components
import React, { useState } from 'react'
import { useAuth } from '../../global/auth/Authentication'
import { useNavigate } from 'react-router-dom'
import { useUserData } from '../../global/auth/UserData'

const TeacherLanding = () => {
    // eslint-disable-next-line
    const [error, setError] = useState('');

    const {currentUser,  signOut} = useAuth();
    const {userData} = useUserData();

    const navigate = useNavigate();

    const handleLogOut = async () => {

        try {
            await signOut();
            navigate('/login');
        }catch{
            setError('Something went wrong..');
        }
    }

    return (
        <div>
            <h1>Landing Page - Teacher</h1>
            <p>Name: {userData.firstName} {userData.lastName}</p>
            <p>Role: {userData.role}</p>
            <p>{currentUser.email}</p>
            <button onClick={handleLogOut}>
                Log out
            </button>
        </div>

    )
}

export default TeacherLanding