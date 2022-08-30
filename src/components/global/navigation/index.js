import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/Authentication'
import { db } from '../../../utils/firebase';
import './Nav.css';
import { NavLink } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {ReactComponent as Logo} from '../../../assets/logo-light.svg';
import { Button, Classes, Icon, Navbar } from '@blueprintjs/core';
import { Tooltip2 } from "@blueprintjs/popover2";

const NavBar = () => {
    const {currentUser, signOut} = useAuth();
    const [error, setError] = useState('');

    const [role, setRole] = useState('');

    const [mobileMenu, setMobileMenu] = useState(false);


    const navigate = useNavigate();

    const location = useLocation();

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

        if(mobileMenu){
            setMobileMenu(false);
        }

        scrollToTop('/');
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
        setMobileMenu(!mobileMenu);
    }

    //Scroll to the top of the page
    const scrollToTop = (path) => {
        if(location.pathname === path){
            //Scroll to the top of the page
            window.scroll({top: 0, left: 0, behavior: 'smooth' })
        }
    }

    const renderOfficerMobileMenu = (
        <div className='mobile-menu'>
                <ul className='mobile-list'>
                    <li>
                        <NavLink activeclassname='active' to="/">
                            <Button className={Classes.MINIMAL} 
                            icon={<Icon icon="home" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            text="Home"
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink activeclassname='active' to="/survey-making">
                            <Button className={Classes.MINIMAL} 
                            icon={<Icon icon="add" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            text="Create task"
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/survey-distribution">
                            <Button className={Classes.MINIMAL} 
                            icon={<Icon icon="send-message" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            text="Distribute task"
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeclassname='active' to="/delete-account">
                            <Button className={Classes.MINIMAL} text="Admin"
                            icon={<Icon icon="people" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li>
                        <Button className={`logout-btn-nav ${Classes.MINIMAL}`} onClick={handleLogOut} 
                            style={{color:'white'}}
                            icon = "log-out" text="Log out"/>
                    </li>
                    </ul>
        </div>
    )

    const renderTeacherMobileMenu = (
        <div className='mobile-menu'>
                <ul className='mobile-list'>
                    <li>
                        <NavLink activeclassname='active' to="/">
                            <Button className={Classes.MINIMAL}
                            icon={<Icon icon="home" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            text="Home"
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li >
                        <NavLink activeclassname='active' to="/profile">
                            <Button className={Classes.MINIMAL} 
                            icon={<Icon icon="people" style={{color:'white'}}/>}
                            style={{color:'white'}}
                            text="Profile"
                            onClick={openNavMenu}/>
                        </NavLink>
                    </li>
                    <li>
                        <Button className={`logout-btn-nav ${Classes.MINIMAL}`} onClick={handleLogOut} 
                        icon={<Icon icon="log-out"/>}
                        style={{color:'white'}} text="Log out"/>
                    </li>
                    </ul>
        </div>
        )

    const TeacherNav = () => (
        <div className='wrapper site-header__wrapper'>
            <button className='brand' onClick={navigateHome}>
                    <Logo className='brand-logo'/>
            </button>

            <span class="nav__toggle" aria-expanded="false">
                    <Button  icon={<Icon icon="menu" style={{color:'white'}}/>} className={Classes.MINIMAL} onClick={openNavMenu}/>
            </span>

            <nav className='nav'>
                <ul className='nav__wrapper'>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/">
                            <Tooltip2
                                    content={<span>Home</span>}
                                    openOnTargetFocus={false}
                                    placement="bottom"
                                    usePortal={false}
                            >
                            <Button className={Classes.MINIMAL} icon={<Icon icon="home" style={{color:'white'}}/>}
                             onClick={()=>scrollToTop('/')}/>
                            </Tooltip2>
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/profile">
                            <Tooltip2
                                    content={<span>Profile</span>}
                                    openOnTargetFocus={false}
                                    placement="bottom"
                                    usePortal={false}
                            >
                                <Button className={Classes.MINIMAL} icon={<Icon icon="people" style={{color:'white'}}/>}
                                 onClick={()=>scrollToTop('/profile')}/>
                            </Tooltip2>
                        </NavLink>
                    </li>
                    <li>
                        <Navbar.Divider style={{backgroundColor:'white'}}/>
                    </li>
                    <li className='nav__item'>
                        <Tooltip2
                                    content={<span>Log out</span>}
                                    openOnTargetFocus={false}
                                    placement="left"
                                    usePortal={false}
                        >
                            <Button className={`logout-btn-nav ${Classes.MINIMAL}`} onClick={handleLogOut} icon="log-out" />
                        </Tooltip2>
                    </li>
                </ul>
            </nav>

            {mobileMenu && renderTeacherMobileMenu}
        </div>
    )

    const OfficerNav = () => (
        <div className='wrapper site-header__wrapper'>
            <button className='brand' onClick={(navigateHome)}>
                    <Logo className='brand-logo'/>
            </button>
            <nav className='nav'>
                <span class="nav__toggle" aria-expanded="false">
                    <Button  icon={<Icon icon="menu" style={{color:'white'}}/>} className={Classes.MINIMAL} onClick={openNavMenu}/>
                </span>

                <ul className='nav__wrapper'>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/">
                            <Tooltip2
                                content={<span>Home</span>}
                                openOnTargetFocus={false}
                                placement="bottom"
                                usePortal={false}
                            >
                                <Button className={Classes.MINIMAL} icon={<Icon icon="home" style={{color:'white'}}/>}
                                onClick={()=>scrollToTop('/')}/>
                            </Tooltip2>
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/survey-making">
                        <Tooltip2
                                content={<span>Create new task</span>}
                                openOnTargetFocus={false}
                                placement="bottom"
                                usePortal={false}
                        >
                            <Button className={Classes.MINIMAL} icon={<Icon icon="add" style={{color:'white'}}/>}
                             onClick={()=>scrollToTop('/survey-making')}/>
                        </Tooltip2>
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/survey-distribution">
                        <Tooltip2
                                content={<span>Distribute tasks</span>}
                                openOnTargetFocus={false}
                                placement="bottom"
                                usePortal={false}
                        >
                            <Button className={Classes.MINIMAL} icon={<Icon icon="send-message" style={{color:'white'}}/>}
                            onClick={()=>scrollToTop('/survey-distribution')}/>
                        </Tooltip2>
                        </NavLink>
                    </li>
                    <li className='nav__item'>
                        <NavLink activeclassname='active' to="/admin">
                        <Tooltip2
                                content={<span>Admin</span>}
                                openOnTargetFocus={false}
                                placement="bottom"
                                usePortal={false}
                        >
                        <Button className={Classes.MINIMAL} icon={<Icon icon="people" style={{color:'white'}}/>}/>
                        </Tooltip2>
                        </NavLink>
                    </li>
                    <li>
                        <Navbar.Divider style={{backgroundColor:'white'}}/>
                    </li>
                    <li className='nav__item'>
                        <Tooltip2
                                content={<span>Log out</span>}
                                openOnTargetFocus={false}
                                placement="left"
                                usePortal={false}
                        >
                        <Button className={`logout-btn-nav ${Classes.MINIMAL}`} onClick={handleLogOut} icon="log-out" />
                        </Tooltip2>
                    </li>
                </ul>
            </nav>

            {mobileMenu && renderOfficerMobileMenu}
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