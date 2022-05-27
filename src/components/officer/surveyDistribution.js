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
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [displaySurveys, setDisplaySurveys] = useState(""); //visual purposes
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [displayTeachers, setDisplayTeachers] = useState(""); //visual purposes
  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});
  const [scheduledDate, setScheduledDate] = useState(today.substring(0,10));

  //Show created surveys with checkboxes (visual)
  useEffect(() => {
    var num = 0;
    setDisplaySurveys(allSurveys.map((o) => 
      <p>{++num}. Title: {o.title}
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
      <br></br></p>));
  }, [allSurveys, selectedSurveys]);

  //Show all teachers with checkboxes (visual)
  useEffect(() => {
    var num = 0;
    setDisplayTeachers(allTeachers.map((o) => 
      <p>{++num}. Name: {o.firstName} {o.lastName}
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
      <br></br></p>));
  }, [allTeachers, selectedTeachers]);

  // retrieve own surveys from database
  async function getAllSurveys(){
    setAllSurveys([]);
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
  }

  // retrieve all teachers from database
  async function getAllTeachers(){
    setAllTeachers([]);
    app.appCheck().activate(site_key, true);
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

  async function assignTeachers(){
    let error = 0;
    if(scheduledDate < today.substring(0,10)){
      ++error;
    } //if statement not working
    if((selectedSurveys.length < 1)){
      ++error;
    } //if statement not working
    if((selectedTeachers.length < 1)){
      ++error;
    } //if statement not working
    if (error == 0){
      selectedSurveys.map((survey) => {
        let obj = allSurveys.find((o) => o.id === survey);
        selectedTeachers.map((teacher) => {
          assignTeacher(survey, obj.title, teacher);
        })
      })
    }
    else{
      alert("Make sure there's at least one survey and one teacher checked. Date must be at least from today.");
    }
  }

  //assign one teacher to the survey
  async function assignTeacher(questionID, title, teacherID){
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

  return (
    <div>
      <body>
        <button onClick={() => getAllSurveys()}>Select Survey(s)</button><br></br>
        <div>{displaySurveys}</div><br></br>
        <button onClick={() => getAllTeachers()}>Select Teacher(s)</button><br></br>
        <div>{displayTeachers}</div><br></br>
        <div className='input-field'>
          <input required className='question' type="date" 
          placeholder='Enter your title here..'
          value={scheduledDate}
          onInput={e => setScheduledDate(e.target.value)} />
          <label>
            Scheduled Date
          </label>
        </div>
        <button onClick={() => assignTeachers()}>Assign Teacher(s)</button><br></br>
      </body>
    </div>
  )
}
export default OfficerSurveyDistribution;