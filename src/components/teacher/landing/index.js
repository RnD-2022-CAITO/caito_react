//Main page for the components
import React, { useEffect, useState } from 'react'
import { useUserData } from '../../global/auth/UserData'
import app, {func} from '../../../utils/firebase';
import { useNavigate } from 'react-router-dom';

import "./teacherLanding.css";

// const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const TeacherLanding = () => {

    const {userData} = useUserData();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [upcomingSurvey, setUpcomingSurvey] = useState([]);

    const [totalSurvey, setTotalSurvey] = useState(0);

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

    //Display the total new surveys
    useEffect(() => {
        const setTotalDisplay = () => {
            var count = 0;

            for(var k = 0; k < upcomingSurvey.length; k++){

                if(upcomingSurvey[k].isSubmitted === false){
                    count++;
                }
    
                setTotalSurvey(count);
            }
        }

        setTotalDisplay();

    }, [upcomingSurvey])

    const renderSurveys = () => (
        <div className='survey-display'>
            <div>
            <h2 style={{textAlign:'center'}}>Kia Ora, {userData.firstName}</h2>
            <h2 style={{textAlign:'center'}}>You have <span className='new-sur'>{totalSurvey}</span> new 
            {(totalSurvey < 1) ? <span> survey</span> : <span> surveys</span>}</h2>
            </div>

            <div className='survey-box'>
            {//Render surveys
            upcomingSurvey.map((sur, index) => 
            sur.isSubmitted === false &&
            <section className='new-survey' key={index}>
                <h3 >{sur.questionTitle}</h3>
                <button id={sur.questionID} className = "view-survey-btn" onClick={openSurvey}>View Survey</button>
            </section>
            )
            }
            </div>
        </div>
    )

    const openSurvey = (e) => {
        // alert('Redirect user to question ID: ' + e.target.id);

        //Pass the question ID to the next path
        navigate(`/survey/${e.target.id}`, {
            state: {
                questionID: e.target.id,
            }
        })
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