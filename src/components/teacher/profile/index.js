import React from 'react'
import { useUserData } from '../../global/auth/UserData'
import { useAuth } from '../../global/auth/Authentication'
import AccountInfo from './AccountInfo'
import AddProfileSection from './AddProfileSection/AddProfileSection'


import "./Profile.css"



const TeacherProfile = () => {
  const {currentUser} = useAuth();
  const {userData} = useUserData();

  return (
    <div>
        <h1 className='profile-title'>My Profile</h1>
        <AccountInfo user = {currentUser} data={userData} />

        <br/>
        
        <AddProfileSection/>

 
    </div>
  )
}

export default TeacherProfile