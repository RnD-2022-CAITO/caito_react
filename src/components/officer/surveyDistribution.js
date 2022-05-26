//put survey distribution process here
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import app, {func} from '../../utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/app-check';
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSurveyDistribution = () => {
// 1. select existing survey(s): get all existing surveys created by logged in officer
// 2. select teacher(s)
// 3. distribute

  const [allSurveys, setAllSurveys] = useState([]);
  const [displaySurveys, setDisplaySurveys] = useState(""); //visual purposes
  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});
  const [scheduledDate, setScheduledDate] = useState(today.substring(0,10));

  async function getSurveys(){
    await getAllSurveys();
    var num = 0;
    setDisplaySurveys("");
    //allSurveys.forEach((survey) => displaySurveys += <p>{++num}. createdDate: {survey.createdDate} <br></br>
    //questions: </p>);
    allSurveys.forEach((survey) => console.log("survey.title: " + survey.title))
    //console.log("displaySurveys: " + displaySurveys);
  };

  // retrieve own surveys from database and set it to allSurveys
  async function getAllSurveys(){
    app.appCheck().activate(site_key, true);
    const getSurveys = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
    try {
        await getSurveys().then((result) => 
        {
          setAllSurveys(result.data);
        });
    } catch (e) {
        console.error(e);
    }
    allSurveys.forEach((survey) => console.log("survey.title: " + survey.title))
  }

  //assign one teacher to the survey
  /*async function assignTeacher(){
    app.appCheck().activate(site_key, true);
    const scheduleSurvey = func.httpsCallable('officer-scheduleSurvey');
    try {
        await scheduleSurvey({
            questionID: questionID,
            title: title,
            teacherID: teacherID,
            scheduledDate: scheduledDate,
        });
    } catch (e) {
        console.error(e);
    }
  }
  
  if(scheduledDate < today.substring(0,10)){
        return setError('Scheduled survey date should not be in the past.')
    }
  */

  return (
    <div>
      <body>
        <button onClick={() => getAllSurveys()}>Select Survey(s)</button><br></br>

        <div className='input-field'>
          <input required className='question' type="date" 
          placeholder='Enter your title here..'
          value={scheduledDate}
          onInput={e => setScheduledDate(e.target.value)} />
          <label>
            Scheduled Date
          </label>
        </div>
      </body>
    </div>
  )
}
export default OfficerSurveyDistribution;