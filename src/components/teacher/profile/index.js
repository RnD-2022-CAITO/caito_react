import React from 'react'
import { useUserData } from '../../global/auth/UserData'
import { useAuth } from '../../global/auth/Authentication'
import { useNavigate } from 'react-router-dom'
import AccountInfo from './AccountInfo'
import AddProfileSection from './AddProfileSection/AddProfileSection'


import "./Profile.css"
import { Button, Classes } from '@blueprintjs/core'
import { Footer } from '../../global/Footer'



const TeacherProfile = () => {
  const {currentUser} = useAuth();
  const {userData} = useUserData();
  const navigate = useNavigate();

  return (
    <div>
        <div className='profile-wrapper'>
            <div className='profile-container'>
                <div className='profile-item profile'>
                    <div style={{textAlign:'center'}}>
                    <img 
                    className='profile-image'
                    src="https://freerangestock.com/sample/120140/business-man-profile-vector.jpg" 
                    alt="profile pic"/>
                    </div>
                    <h2>
                        {userData && 
                        userData.firstName + ' ' + userData.lastName}
                    </h2>
                    <h3>
                    <Button icon="envelope" className={Classes.MINIMAL}></Button>    
                    {currentUser.email}</h3>
                    <br></br>
                    <hr></hr>
                    <br></br>
                    <button onClick={() => navigate('/edit-password')}>Change password</button>
                </div>
                <div className='profile-item profile-actions'>
                        <h3>Role</h3>
                        <div className='profile-section'>
                          <p>Teacher</p>
                        </div>
                        <h3>Personal information</h3>
                        <div className='profile-section'>
                          <p>This section stores basic information from the user</p>
                          <p>Under development...</p>
                        </div>

                        <h3>Your profiling tasks</h3>
                        <div className='profile-section'>
                          <p>This section allows user to view their previous profiling task,
                            and edit them if they want to.</p>
                          <p>Under development...</p>
                        </div>
                </div>


            </div>
        </div>

        <Footer />
    </div>
  )
}

export default TeacherProfile