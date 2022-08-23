import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Authentication'
import { db } from '../../../utils/firebase';
import './Nav.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as Logo} from '../../../assets/logo-light.svg';
import {FiLogOut, FiMenu} from 'react-icons/fi';
import { Button, Classes } from '@blueprintjs/core';

const NavBar = () => {
    const {currentUser, signOut} = useAuth();
    const [error, setError] = useState('');

    const [role, setRole] = useState('');

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

    const navigateHome = () => {
        navigate('/');
    }

    const retrieveUserData = async () => {
            if(currentUser){
                const  docExists = (await db.collection("teacher-info").doc(currentUser.uid).get()).exists

                if(docExists){
                    await db.collection("teacher-info").doc(currentUser.uid).get().then((querySnapshot) => {
                        setRole(querySnapshot.data().role)
                    })
                } else {
                    await db.collection("officer-info").doc(currentUser.uid).get().then((querySnapshot) => {
                        setRole(querySnapshot.data().role)
                    })
                }
            }

    }

    //only runs when the component mounts
    useEffect(() => {
        retrieveUserData();
    }, [currentUser])


    //Open the navigation menu
    const openNavMenu = () => {
 
    }

    const TeacherNav = () => (
        <div className='wrapper site-header__wrapper'>
            <button className='brand' onClick={navigateHome}>
                    <Logo className='brand-logo'/>
            </button>

            <button class="nav__toggle" aria-expanded="false" type="button"
            onClick={openNavMenu}
            >
                <FiMenu />
            </button>

            <nav className='nav'>
                <ul className='nav__wrapper'>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/">
                            <Button className={Classes.MINIMAL} icon="home" text="home" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/profile">
                            <Button className={Classes.MINIMAL} icon="people" text="profile" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <button className='logout-btn-nav' onClick={handleLogOut}>
                                <FiLogOut/>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    )

    const OfficerNav = () => (
        <div className='wrapper site-header__wrapper'>
            <button className='brand' onClick={navigateHome}>
                    <Logo className='brand-logo'/>
            </button>
            <nav className='nav'>
                <button class="nav__toggle" aria-expanded="false" type="button"
                    onClick={openNavMenu}
                    >
                        <FiMenu />
                </button>

                <ul className='nav__wrapper'>

                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/">
                            <Button className={Classes.MINIMAL} icon="home" text="home" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/survey-making">
                        <Button className={Classes.MINIMAL} icon="add" text="create task" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/survey-distribution">
                        <Button className={Classes.MINIMAL} icon="send-message" text="distribute task" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/delete-account">
                        <Button className={Classes.MINIMAL} icon="people" text="admin" />
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <Button className={`logout-btn-nav ${Classes.MINIMAL}`} onClick={handleLogOut}>
                            <FiLogOut/>
                        </Button>
                    </li>
                </ul>
            </nav>
        </div>
    )

    return (
        currentUser ? 
            //If role is teacher 
            role === 'teacher'? <TeacherNav /> : 
            //Else if role is officer
            role === 'officer' ? <OfficerNav/> : 
            //Render nothing if role is undefined
            null 
        //User is not authenticated yet
        : null
    )
}


export default NavBar