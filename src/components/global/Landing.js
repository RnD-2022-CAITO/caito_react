import React from 'react'
import OfficerLanding from '../officer/landing';
import TeacherLanding from '../teacher/landing';
import { useUserData } from './auth/UserData'

const Landing = () => {
  const {userData} = useUserData();
  // const docExists = async () => (await db.collection("teacher-info").doc(currentUser.uid).get()).exists

  return (
    <div>
      {userData.role === 'teacher' ? 
      <TeacherLanding/> : <OfficerLanding/>}
    </div>
  )
}

export default Landing