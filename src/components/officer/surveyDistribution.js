//put survey distribution process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import 'firebase/compat/app-check';
import './surveyDistribution.css';

const OfficerSurveyDistribution = () => {
// 1. select existing survey(s): get all existing surveys created by logged in officer
// 2. select teacher(s)
// 3. distribute
  const [allTeachers, setAllTeachers] = useState([]);
  const [teacherDisplay, setTeacherDisplay] = useState(false);

  const [allSurveys, setAllSurveys] = useState([]);
  const [surveyDisplay, setSurveyDisplay] = useState(false);

  const [scheduledDateDisplay, setScheduledDateDisplay] = useState(false);

  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});
  const [scheduledDate, setScheduledDate] = useState(today.substring(0,10));


  async function assignTeachers(){
    let error = 0;
    if(scheduledDate < today.substring(0,10)){
      ++error;
    } 
    if((selectedSurveys.length < 1)){
      ++error;
    } 
    if((selectedTeachers.length < 1)){
      ++error;
    } 
    if (error === 0){
      // eslint-disable-next-line
      selectedSurveys.map((survey) => {
        let obj = allSurveys.find((o) => o.id === survey);
        selectedTeachers.map(async (teacher) => {
          await assignTeacher(survey, obj.title, teacher);
        })
      })

      alert('Successfully sent out the invitation to fill in the task!');

      //refresh the page
      window.location.reload();
    }
    else{
      alert("Make sure there's at least one survey and one teacher checked. Date must be at least from today.");
    }
  }

  //assign one teacher to the survey
  async function assignTeacher(questionID, title, teacherID){
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
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

  //Get all teachers from the database

  useEffect(() => {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    const retrieveTeachersInfo = async () => {
        const getTeachers = func.httpsCallable('officer-getAllTeachers');
        try {
            await getTeachers().then((result) => 
            {
              setAllTeachers(result.data);
            });
        } catch (e) {
            console.error(e);
        }
    }

    const retrieveSurveyInfo = async () => {
      const getSurveys = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
      try {
          await getSurveys().then((result) => 
          {
            setAllSurveys(result.data);
          });
      } catch (e) {
          console.error(e);
      }
    }

    retrieveTeachersInfo();

    retrieveSurveyInfo();

  }, [])

  return (
    <div>
        <div className='select-display'>
        <h3>1. Select your surveys</h3>
        <button onClick={() => setSurveyDisplay(!surveyDisplay)}>Select surveys</button>
        {surveyDisplay && 
        allSurveys.map((o, index) => 
        <div key={index}>
        <span>{++index}. Title: {o.title}</span>
        <input
          type="checkbox"
          value={o.id}
          checked={selectedSurveys.includes(o.id)}
          onChange={e => 
            {
              if (selectedSurveys.includes(e.target.value)){
                setSelectedSurveys(selectedSurveys.filter(obj => obj !== e.target.value));
              }else{
              setSelectedSurveys(oldArray => [...oldArray, e.target.value])
              }
            }
          }
        />
        </div>)
        }
        </div>

        <div className='select-display'>
        <h3>2. Select a group of teachers you want to send the surveys to</h3>
        <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>
        {teacherDisplay && 
        allTeachers.map((o, index) => 
        <div key={index}> 
        <span> {index +1 } Teacher's Name: {o.firstName} {o.lastName} </span>
        <input
          type="checkbox"
          value={o.id}
          checked={selectedTeachers.includes(o.id)}
          onChange={e => 
            {
              if (selectedTeachers.includes(e.target.value)){
                setSelectedTeachers(selectedTeachers.filter(obj => obj !== e.target.value));
              }else{
                setSelectedTeachers(oldArray => [...oldArray, e.target.value])
              }
            }
          }
        />
        </div>)}
        </div>
        <div className='select-display'>
          <h3>3. Schedule your date to send the surveys</h3>
          <button onClick={() => setScheduledDateDisplay(!scheduledDateDisplay)}>Schedule date</button>
          {scheduledDateDisplay &&
          <div className='input-field'>
            <input required className='question' type="date" 
            placeholder='Enter your title here..'
            value={scheduledDate}
            onInput={e => setScheduledDate(e.target.value)} />
            <label>
              Scheduled Date
            </label>
          </div>}
        </div>
          
        <div style={{textAlign:'center'}}>
        <button onClick={() => assignTeachers()}>Start sending out survey invitation</button>
        </div>
    </div>
  )
}
export default OfficerSurveyDistribution;