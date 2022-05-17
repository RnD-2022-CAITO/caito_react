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

  const getSurveys = () => {
    getAllSurveys();
    var num = 0;
    setDisplaySurveys("");
    allSurveys.forEach((survey) => displaySurveys += <p>{++num}. createdDate: {survey.createdDate} <br></br>
    questions: </p>);
    console.log("displaySurveys: " + displaySurveys);
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
}

  return (
    <div>
      <body>
        <h1>this page is in progress...</h1>
        <button onClick={() => getSurveys()}>Select Survey(s)</button><br></br>
      </body>
    </div>
  )
}
export default OfficerSurveyDistribution;