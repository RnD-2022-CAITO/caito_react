import React from 'react'
import { useUserData } from '../../../global/auth/UserData.js'
import { useAuth } from '../../../global/auth/Authentication.js'

import "./AddProfileSection.css"


const AddProfileSection = () => {

    const {currentUser} = useAuth();
    const {userData} = useUserData();


    const show = () => {
        let dialog = document.getElementById('dialog');
        if  (dialog.style.display = "none") {
            dialog.style.display = "block";
        }
    }

    const close = () => {
        let dialog = document.getElementById('dialog');
        if  (dialog.style.display = "block") {
            dialog.style.display = "none";
        }
    }


    return (
         <div>
            <div className='more-section'>
                <h1 className='more-title'>More Information</h1>
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>Email: {currentUser.email}</p>
                <button className='add-section' onClick={show}>Add Profile Section</button>
            </div> 
            <div id='dialog'>
                <div id='content'>
                    <div id='aclose'>
                        <span>Add a new section to your profile</span>
                        <button className='close-btn' onClick={close}>x</button>
                    </div>
                    <div id='section'>
                        hello
                    </div>
                </div>
            </div>   
        </div>
    )
    
}
export default AddProfileSection