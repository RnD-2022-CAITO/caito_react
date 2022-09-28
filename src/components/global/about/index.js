import React from 'react'
import { useUserData } from '../auth/UserData'
import { OfficerAbout } from './OfficerAbout';
import { TeacherAbout } from './TeacherAbout';

const About = () => {
    const { userData } = useUserData();
    return (
      <div>
        {userData.role === 'teacher' ? 
        <> 
        <TeacherAbout />
        </>  
        :
        <>
        <OfficerAbout />
        </>
      }
      </div>
    )
}

export default About;
