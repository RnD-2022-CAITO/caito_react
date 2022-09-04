import React from 'react'
import { LandingOfficer } from '../officer';
import TeacherLanding from '../teacher/landing';
import { useUserData } from './auth/UserData'

const Landing = () => {
  const {userData} = useUserData();
  // const docExists = async () => (await db.collection("teacher-info").doc(currentUser.uid).get()).exists

  return (
    <div>
      
      {
      //render component based on the user's role
      userData.role === 'teacher' ? 
      <TeacherLanding/> : <LandingOfficer/>}
    </div>
  )
}

export default Landing