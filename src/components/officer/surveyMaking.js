//put survey making process here
import React, { useState, useEffect } from 'react';
import {useAuth} from '../global/auth/Authentication';
import { Link, useNavigate } from 'react-router-dom';
import app, {func} from '../../utils/firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/app-check';
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSurveyMaking = () => {
  //Retrieve the addSurvey func from Authentication.js (connects to firebase)
  //const { addSurvey } = useAuth();
  //const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [question_type, setQuestionType] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [options, setOptions] = useState(""); //visual purposes
  const [questionList, setQuestionList] = useState(""); //visual purposes
  const [currentOption, setCurrentOption] = useState("");
  const [optionsConfirmed, setOptionsConfirmed] = useState([]);
  const [questionsConfirmed, setQuestionsConfirmed] = useState([]);
  const [questionID, setQuestionID] = useState("");
  const [teacherID, setTeacherID] = useState("");

  async function addSurvey(survey){
    app.appCheck().activate(site_key, true);
    const addSurvey = func.httpsCallable('officer-addSurveyQuestions');
    try {
        await addSurvey({
            questions: survey,
        }).then((res) => {
            setQuestionID(res.data);
            alert("new survey id made: " + res.data);
        });
    } catch (e) {
        console.error(e);
    }
  }

  async function assignTeacher(){
    app.appCheck().activate(site_key, true);
    const distributeSurvey = func.httpsCallable('officer-distributeSurvey');
    try {
        await distributeSurvey({
            questionID: questionID,
            teacherID: teacherID,
        });
    } catch (e) {
        console.error(e);
    }
  }
  useEffect(() => {
    if (optionVisible){
      var i = [];
      var num = 0;
      i.push(<p>Add Options (at least 2)<br></br></p>);
      i.push(<p>You've added options:<br></br></p>);
      i.push(optionsConfirmed.map((o) => <p>{++num}. {o}<br></br></p>)); //run this only once each. 

      i.push(<label>Option:<input type="text" onInput={e => setCurrentOption(e.target.value)} /><br></br></label>);
      i.push(<button onClick={() => addOption(currentOption)}>Add</button>); //this is triggering for some reason
      setOptions(i);
    } else{
      setOptions("");
    }
  }, [optionVisible, optionsConfirmed, currentOption]);

  useEffect(() => {
    var num = 0;
    setQuestionList(questionsConfirmed.map((o) => 
      <p>{++num}. Question: {o.question}<br></br>
      Type: {o.type}<br></br>
      Options: {o.options.toString()}<br></br></p>));
  }, [questionsConfirmed]);

  const addOption = (currentOption) => {
    var i = "";
    i = currentOption;
    if (i.length > 0){
      setOptionsConfirmed(oldArray => [...oldArray, currentOption]);
    }else{
      alert("Option cannot be blank.");
    }
  };

  const addQuestion = () => {
    var pass = true;
    if (question_type === "checkbox" || question_type === "radio"){
      if (optionsConfirmed.length < 2){
        alert("Minimum 2 options.");
        pass = false;
      }
    }
    if (question.length < 1){
      alert("Question cannot be blank.");
      pass = false;
    }
    if (pass === true && question.length > 0){
      var obj = {
        question: question,
        type: question_type,
        options: optionsConfirmed,
      }
      setQuestionsConfirmed(oldArray => [...oldArray, obj]);
      //setQuestion("");
      setQuestionType("");
      setOptionVisible(false);
      setOptions("");
      setCurrentOption("");
      setOptionsConfirmed([]);
    }
  };

  const addCurrentSurvey = () => {
    //add questionsConfirmed into firebase 
    addSurvey(questionsConfirmed);
    //navigate('/'); //navigate to confirmation page with links to 1. create a new survey and to 2. distribute the survey
  };

  const assignInputTeacher = () => {
    //add questionsConfirmed into firebase 
    if (questionID && teacherID){
      assignTeacher();
      alert("assigned questionID: " + questionID + "to teacherID: " + teacherID);
    }
    //navigate('/'); //navigate to confirmation page with links to 1. create a new survey and to 2. distribute the survey
  };

  return (
    <div id="survey_div">
      <body id="survey_body">
        <h1>Create a New Survey</h1>
        <p id="created_questions">{questionList}</p>
        <label>
          Question:
          <input type="text" onInput={e => setQuestion(e.target.value)} />
          <br></br>
        </label>
        <label>
          Type of Answer:
          <label>
            <input
              type="radio"
              value="text"
              checked={question_type === "text"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              value="number"
              checked={question_type === "number"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
            />
            Number
          </label>
          <label>
            <input
              type="radio"
              value="checkbox"
              checked={question_type === "checkbox"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
            />
            Checkbox
          </label>
          <label>
            <input
              type="radio"
              value="radio"
              checked={question_type === "radio"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
            />
            Radio
          </label><br></br>
        </label>
        <label>
          {options}
          <br></br><br></br>
        </label>
        <label>
          Add Teacher ID (optional; only one teacher):
          <input type="text" onInput={e => setTeacherID(e.target.value)} />
          <br></br>
        </label>
        <button onClick={() => addQuestion()}>Add Question</button><br></br>
        <button onClick={() => addCurrentSurvey()}>Submit Survey</button><br></br>
        <button onClick={() => assignInputTeacher()}>Assign Teacher ID</button><br></br>
      </body>
    </div>
  )
}
export default OfficerSurveyMaking;