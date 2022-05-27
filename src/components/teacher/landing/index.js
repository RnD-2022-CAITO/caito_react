//Main page for the components
import React, { useEffect, useState } from 'react'
import { useUserData } from '../../global/auth/UserData'
import app, {func} from '../../../utils/firebase';

import "./teacherLanding.css";

// const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const TeacherLanding = () => {

    const {userData} = useUserData();

    const [loading, setLoading] = useState(true);
    const [upcomingSurvey, setUpcomingSurvey] = useState([]);

    //Get surveys
    useEffect(() => {
        const retrieveSurvey = async  () => {
            app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
            const getSurvey = func.httpsCallable('teacher-getAllAssignedSurveys_Answers');
            try {
                const response = await getSurvey();
                
                setUpcomingSurvey(response.data);

                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }

        retrieveSurvey();
    },[]);

    const renderSurveys = () => (
        <div>
            <h2 style={{textAlign:'center'}}>Kia Ora, {userData.firstName}</h2>
            <h2 style={{textAlign:'center'}}>You have <span className='new-sur'>{upcomingSurvey.length}</span> new 
            {(upcomingSurvey.length < 1) ? <span> survey</span> : <span> surveys</span>}</h2>
            {//Render surveys
            upcomingSurvey.map(sur => 
            sur.isSubmitted === false &&
            <section className='new-survey' key={sur.questionID}>
                <h3 >{sur.questionTitle}</h3>
                <button id={sur.questionID} className = "view-survey-btn" onClick={openSurvey}>View Survey</button>
            </section>
            )
            }
        </div>
    )

    const openSurvey = (e) => {
        console.log(e.target.id);
        alert('Redirect user to question ID: ' + e.target.id);
    }
        


    return (
        <div>
           {loading ? 
           <p style={{textAlign:"center"}}>Loading...</p> : 
           renderSurveys()}
        </div>

    )
}

export default TeacherLanding