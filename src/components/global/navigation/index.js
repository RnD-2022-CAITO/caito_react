import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Authentication'
import './Nav.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../auth/UserData';

const NavBar = () => {
    const {currentUser, signOut} = useAuth();
    const {userData} = useUserData();
    const [error, setError] = useState('');

    const navigate = useNavigate();



    const handleLogOut = async () => {

        try {
            if(!error){
                await signOut();
                navigate('/login');
            }
        }catch{
            setError('Something went wrong..');
        }
    }


    const TeacherNav = () => (
        <div className='nav'>
            <ul>
                <li>
                    <NavLink activeClassName='active' to="/">
                    home
                    </NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to="/profile">
                    profile
                    </NavLink>
                </li>
                <li>
                    <button className='logout-btn-nav' onClick={handleLogOut}>
                        Log out
                    </button>
                </li>
            </ul>
        </div>
    )

    const OfficerNav = () => (
        <div className='nav'>
            <ul>
                    <NavLink activeClassName='active' to="/">
                    home
                    </NavLink>
                <li>
                    survey
                </li>
                <li>
                    <NavLink activeClassName='active' to="/summary">
                    summary
                    </NavLink>
                </li>
                <li>
                    <button className='logout-btn-nav' onClick={handleLogOut}>
                        Log out
                    </button>
                </li>
            </ul>
        </div>
    )

    return (
        currentUser ? userData.role==='teacher'? <TeacherNav />: <OfficerNav/> : null
    )
}


export default NavBar