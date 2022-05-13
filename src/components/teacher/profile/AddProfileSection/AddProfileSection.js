import React from 'react'
import { useUserData } from '../../../global/auth/UserData.js'
import { useAuth } from '../../../global/auth/Authentication.js'

import "./AddProfileSection.css"


const AddProfileSection = () => {

    const {currentUser} = useAuth();
    const {userData} = useUserData();

    //show the add section dialog when user click button
    const show = () => {
        let dialog = document.getElementById('dialog');
        if  (dialog.style.display = "none") {
            dialog.style.display = "block";
        }
    }

    //close the add section dialog when user click exit
    const close = () => {
        let dialog = document.getElementById('dialog');
        if  (dialog.style.display = "block") {
            dialog.style.display = "none";
        }
    }

    //add textArea for About
    const addAbout = () => {
       alert(111);
    }

    //add textArea for Education
    const addEducation = () => {
        alert(111);
     }

     //add textArea for Skills
     const addSkills = () => {
        alert(111);
     }

     //add textArea for Working experience
     const addWorkingEx = () => {
        alert(111);
     }

     //add textArea for Hobbies
     const addHobbies = () => {
        alert(111);
     }

    return (
         <div>
            <div className='more-section'>
                <h1 className='more-title'>More Information</h1>
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>Email: {currentUser.email}</p>
                <button className='add-section' onClick={show}>Add Profile Section</button>
            </div> 
            
            {/* dialog UI */}
            <div id='dialog'>
                <div id='content'>
                    <div id='aclose'>
                        <span>Add a new section to your profile</span>
                        <button className='close-btn' onClick={close}>x</button>
                    </div>
                    <div id='section'>
                        <p id='about' onClick={addAbout}>About</p><hr />
                        <p id='education' onClick={addEducation}>Education</p><hr />
                        <p id='skills' onClick={addSkills}>Skills</p><hr />
                        <p id='working-ex' onClick={addWorkingEx}>Working experience</p><hr />
                        <p id='hobbies' onClick={addHobbies}>Hobbies</p>
                        
                    </div>
                </div>
            </div>   
        </div>
    )
    
}
export default AddProfileSection