import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Authentication'
import { db } from '../../../utils/firebase';
import './Nav.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const {currentUser, signOut} = useAuth();
    const [error, setError] = useState('');

    const [role, setRole] = useState('');

    const navigate = useNavigate();

    const handleLogOut = async () => {

        try {
            await signOut();
            navigate('/login');
        }catch{
            setError('Something went wrong..');
        }
    }

      //only runs when the component mounts
      useEffect(() => {

        if(currentUser){
            const data = async () => {

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
    
            data()
        }

    }, [currentUser])


    const TeacherNav = () => (
        <div className='nav'>
            <ul>
                <li>
                    <Link to="/">
                    home
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                    profile
                    </Link>
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
                    <Link to="/">
                    home
                    </Link>
                <li>
                    survey
                </li>
                <li>
                    <Link to="/summary">
                    summary
                    </Link>
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
        currentUser ? role=='teacher'? <TeacherNav />: <OfficerNav/> : null
    )
}


export default NavBar