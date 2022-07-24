import React from 'react'
import OfficerLanding from '../officer/analysis';
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
      <TeacherLanding/> : <OfficerLanding/>}
    </div>
  )
}

export default Landing