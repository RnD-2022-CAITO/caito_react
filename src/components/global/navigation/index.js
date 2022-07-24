import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Authentication'
import { db } from '../../../utils/firebase';
import './Nav.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {ReactComponent as Logo} from '../../../assets/logo.svg';
import {FiLogOut} from 'react-icons/fi';

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

      //only runs when the component mounts
      useEffect(() => {
            const data = async () => {

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

            data();
            data();


    }, [currentUser])


    const TeacherNav = () => (
        <div className='navigation-bar'>
    `       <div style={{textAlign:'center'}}>
                <Logo className='brand-logo'/>
            </div>
            <div className='nav'>
                <ul>
                    <li>
                        <NavLink activeclassname='active' to="/">
                        home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/profile">
                        profile
                        </NavLink>
                    </li>
                    <li>
                        <button className='logout-btn-nav' onClick={handleLogOut}>
                            <FiLogOut/>
                        </button>
                    </li>
                </ul>
            </div>`
        </div>
    )

    const OfficerNav = () => (
        <div className='navigation-bar'>
            <div style={{textAlign:'center'}}>
                <Logo className='brand-logo'/>
            </div>
            <div className='nav'>
                <ul>
                    <li>
                        <NavLink activeclassname='active' to="/">
                        home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/surveyMaking">
                        create survey
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/surveyDistribution">
                        distribute survey
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/deleteAccount">
                        delete account
                        </NavLink>
                    </li>
                    <li>
                        <button className='logout-btn-nav' onClick={handleLogOut}>
                            <FiLogOut/>
                        </button>
                    </li>
                </ul>
            </div>
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