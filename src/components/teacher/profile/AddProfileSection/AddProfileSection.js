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
    const educationRef = useRef();
    const skillsRef = useRef();
    const workingExRef = useRef();
    const hobbiesRef = useRef();



    //show user's current sections, 
    const showCurrentInfo = () => {
        if(userData.About != null) {
            document.getElementById('aboutText').style.display="block";
            document.getElementById('aboutText').value = userData.About;
            document.getElementById('about-title').style.display="block";
            document.getElementById('save-about').style.display="block";
            document.getElementById('about').style.color='grey';
        }

        if(userData.Education != null) {
            document.getElementById('educationText').style.display="block";
            document.getElementById('educationText').value = userData.Education;
            document.getElementById('education-title').style.display="block";
            document.getElementById('save-education').style.display="block";
            document.getElementById('education').style.color='grey';
        }

        if(userData.Skills != null) {
            document.getElementById('skillsText').style.display="block";
            document.getElementById('skillsText').value = userData.Skills;
            document.getElementById('skills-title').style.display="block";
            document.getElementById('save-skills').style.display="block";
            document.getElementById('skills').style.color='grey';
        }

        if(userData.WorkingEx != null) {
            document.getElementById('workingExText').style.display="block";
            document.getElementById('workingExText').value = userData.WorkingEx;
            document.getElementById('workingEx-title').style.display="block";
            document.getElementById('save-workingEx').style.display="block";
            document.getElementById('working-ex').style.color='grey';
        }

        if(userData.Hobbies != null) {
            document.getElementById('hobbiesText').style.display="block";
            document.getElementById('hobbiesText').value = userData.Hobbies;
            document.getElementById('hobbies-title').style.display="block";
            document.getElementById('save-hobbies').style.display="block";
            document.getElementById('hobbies').style.color='grey';
        }
    }

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

    const saveSections= async(e) => {
        app.appCheck().activate(site_key, true);
        const addAboutTxt = func.httpsCallable('teacher-addBioSection');
        const addEducationTxt = func.httpsCallable('teacher-addBioSection');
        const addSkillsTxt = func.httpsCallable('teacher-addBioSection');
        const addWorkingExTxt = func.httpsCallable('teacher-addBioSection');
        const addHobbiesTxt = func.httpsCallable('teacher-addBioSection');
        
            switch(e) {
                case 'About':
                    try {
                        const response = await addAboutTxt({
                            sectionName: "About",
                            sectionData: aboutRef.current.value,
                        });
                        navigate("/profile");
                    } catch (e) {
                        console.error(e);
                    }
                    break;
                
                 case 'Education':
                    try {
                        const response = await addEducationTxt({
                            sectionName: "Education",
                            sectionData: educationRef.current.value,
                        });
                        navigate("/profile");
                    } catch (e) {
                        console.error(e);
                    }
                    break;

                case 'Skills':
                    try {
                        const response = await addSkillsTxt({
                            sectionName: "Skills",
                            sectionData: skillsRef.current.value,
                        });
                        navigate("/profile");
                    } catch (e) {
                        console.error(e);
                    }
                    break;
                
                case 'WorkingEx':
                    try {
                        const response = await addWorkingExTxt({
                            sectionName: "WorkingEx",
                            sectionData: workingExRef.current.value,
                        });
                        navigate("/profile");
                    } catch (e) {
                        console.error(e);
                    }
                    break;

                case 'Hobbies':
                    try {
                        const response = await addHobbiesTxt({
                            sectionName: "Hobbies",
                            sectionData: hobbiesRef.current.value,
                        });
                        navigate("/profile");
                    } catch (e) {
                        console.error(e);
                    }
                    break;
            }
    }

    return (
         <div>
            <div className='more-section'>
                <h1 className='more-title'>More Information</h1>
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>Email: {currentUser.email}</p>
                <button className='add-section' onClick={show}>Add Profile Section</button>

                <div id='seciton-text' onLoad={showCurrentInfo}>
                    {/* About: {userData.About} */}
                    <p id='about-title'>
                        About
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'about')}></img>
                        </p>
                    <textarea id='aboutText' readOnly="readonly" ref={aboutRef}>
                    </textarea>
                    <button id='save-about' onClick={saveSections.bind(this,"About")}>Save</button><br />
                    
                    <p id='education-title'>
                        Education
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'education')}></img>
                    </p>
                    <textarea id='educationText' readOnly="readonly" ref={educationRef}>
                    </textarea>
                    <button id='save-education' onClick={saveSections.bind(this,"Education")}>Save</button><br /><br />
                    
                    <p id='skills-title'>
                        Skills
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'skills')}></img>
                    </p>
                    <textarea id='skillsText' readOnly="readonly" ref={skillsRef}>  
                    </textarea>
                    <button id='save-skills' onClick={saveSections.bind(this,"Skills")}>Save</button><br /><br />
                    
                    <p id='workingEx-title'>
                        Working Experience
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'workingEx')}></img>
                        </p>
                    <textarea id='workingExText' readOnly="readonly" ref={workingExRef}>
                    </textarea>
                    <button id='save-workingEx' onClick={saveSections.bind(this,"WorkingEx")}>Save</button><br /><br />
                    
                    <p id='hobbies-title'>
                        Hobbies
                        <img src={require('./images/edit.png')} onClick={enableEdit.bind(this, 'hobbies')}></img>
                        </p>
                    <textarea id='hobbiesText' readOnly="readonly" ref={hobbiesRef}>
                    </textarea>
                    <button id='save-hobbies' onClick={saveSections.bind(this,"Hobbies")}>Save</button><br /><br />
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