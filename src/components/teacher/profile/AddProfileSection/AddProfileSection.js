import React from 'react'
import { useUserData } from '../../../global/auth/UserData.js'
import { useAuth } from '../../../global/auth/Authentication.js'
import app,{func} from '../../../../utils/firebase'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

import "./AddProfileSection.css"

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';


const AddProfileSection = (props) => {

    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {userData} = useUserData();
    const aboutRef = useRef();



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

    //show textArea for About
    const showAbout = () => {
        let about = document.getElementById('aboutText');
        if  (about.style.display = "none") {
            about.style.display = "block";
        }
        let title = document.getElementById('about-title');
        if  (title.style.display = "none") {
            title.style.display = "block";
        }
        let btn = document.getElementById('save-about')
        if  (btn.style.display = "none") {
            btn.style.display = "block";
        }
        document.getElementById('about').style.color='grey';
        close();
    }

    //show textArea for Education
    const showEducation = () => {
        let education = document.getElementById('educationText');
        if  (education.style.display = "none") {
            education.style.display = "block";
        }
        let title = document.getElementById('education-title');
        if  (title.style.display = "none") {
            title.style.display = "block";
        }
        let btn = document.getElementById('save-education')
        if  (btn.style.display = "none") {
            btn.style.display = "block";
        }
        document.getElementById('education').style.color='grey';
        close();
     }

     //show textArea for Skills
     const showSkills = () => {
        let skills = document.getElementById('skillsText');
        if  (skills.style.display = "none") {
            skills.style.display = "block";
        }
        let title = document.getElementById('skills-title');
        if  (title.style.display = "none") {
            title.style.display = "block";
        }
        let btn = document.getElementById('save-skills')
        if  (btn.style.display = "none") {
            btn.style.display = "block";
        }
        document.getElementById('skills').style.color='grey';
        close();
     }

     //show textArea for Working experience
     const showWorkingEx = () => {
        let workingEx = document.getElementById('workingExText');
        if  (workingEx.style.display = "none") {
            workingEx.style.display = "block";
        }
        let title = document.getElementById('workingEx-title');
        if  (title.style.display = "none") {
            title.style.display = "block";
        }
        let btn = document.getElementById('save-workingEx')
        if  (btn.style.display = "none") {
            btn.style.display = "block";
        }
        document.getElementById('working-ex').style.color='grey';
        close();
     }

     //show textArea for Hobbies
     const showHobbies = () => {
        let hobbies = document.getElementById('hobbiesText');
        if  (hobbies.style.display = "none") {
            hobbies.style.display = "block";
        }
        let title = document.getElementById('hobbies-title');
        if  (title.style.display = "none") {
            title.style.display = "block";
        }
        let btn = document.getElementById('save-hobbies')
        if  (btn.style.display = "none") {
            btn.style.display = "block";
        }
        document.getElementById('hobbies').style.color='grey';
        close();
     }

     //initially the sections are read only, click button to edit
     const enableEdit = (e) => {
        switch(e) {
            case 'about':
                document.getElementById('aboutText').removeAttribute('readOnly');
                break;
            case 'education':
                document.getElementById('educationText').removeAttribute('readOnly');
                break;
            case 'skills':
                document.getElementById('skillsText').removeAttribute('readOnly');
                break;
            case 'workingEx':
                document.getElementById('workingExText').removeAttribute('readOnly');
                break;
            case 'hobbies':
                document.getElementById('hobbiesText').removeAttribute('readOnly');
                break;
        }
    }

    const saveAbout= async() => {
        app.appCheck().activate(site_key, true);
            const addAboutTxt = func.httpsCallable('teacher-addBioSection');
            try {
                const response = await addAboutTxt({
                    sectionName: "About",
                    sectionData: aboutRef.current.value,
                });
                navigate("/profile");
            } catch (e) {
                console.error(e);
            }
    }

    return (
         <div>
            <div className='more-section'>
                <h1 className='more-title'>More Information</h1>
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>Email: {currentUser.email}</p>
                <button className='add-section' onClick={show}>Add Profile Section</button>
                <div id='seciton-text'>
                    About: {userData.About}
                    <p id='about-title'>
                        About
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'about')}></img>
                        </p>
                    <textarea id='aboutText' readOnly="readonly" ref={aboutRef}>
                    </textarea>
                    <button id='save-about' onClick={saveAbout}>Save</button><br />
                    
                    <p id='education-title'>
                        Education
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'education')}></img>
                    </p>
                    <textarea id='educationText' readOnly="readonly">
                    </textarea>
                    <button id='save-education'>Save</button><br /><br />
                    
                    <p id='skills-title'>
                        Skills
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'skills')}></img>
                        </p>
                    <textarea id='skillsText' readOnly="readonly">  
                    </textarea>
                    <button id='save-skills'>Save</button><br /><br />
                    
                    <p id='workingEx-title'>
                        Working Experience
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'workingEx')}></img>
                        </p>
                    <textarea id='workingExText' readOnly="readonly">
                    </textarea>
                    <button id='save-workingEx'>Save</button><br /><br />
                    
                    <p id='hobbies-title'>
                        Hobbies
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'hobbies')}></img>
                        </p>
                    <textarea id='hobbiesText' readOnly="readonly">
                    </textarea>
                    <button id='save-hobbies'>Save</button><br /><br />
                </div>
                
            </div> 
            
            {/* dialog UI */}
            <div id='dialog'>
                <div id='content'>
                    <div id='aclose'>
                        <span>Add a new section to your profile</span>
                        <button className='close-btn' onClick={close}>x</button>
                    </div>
                    <div id='section'>
                        <p id='about' onClick={showAbout}>About</p><hr />
                        <p id='education' onClick={showEducation}>Education</p><hr />
                        <p id='skills' onClick={showSkills}>Skills</p><hr />
                        <p id='working-ex' onClick={showWorkingEx}>Working experience</p><hr />
                        <p id='hobbies' onClick={showHobbies}>Hobbies</p>
                        
                    </div>
                </div>
            </div>   
        </div>
    )
    
}
export default AddProfileSection