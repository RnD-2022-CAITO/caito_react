//put survey making process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import 'firebase/compat/app-check';

import "./surveyMaking.css"
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSurveyMaking = () => {
  //Retrieve the addSurvey func from Authentication.js (connects to firebase)
  //const { addSurvey } = useAuth();
  // const navigate = useNavigate();

  //Set title for the survey
  const [title, setTitle] = useState("");

  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});
  const [scheduledDate, setScheduledDate] = useState(today.substring(0,10));

  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [options, setOptions] = useState(""); //visual purposes
  const [questionList, setQuestionList] = useState(""); //visual purposes
  const [currentOption, setCurrentOption] = useState("");
  const [optionsConfirmed, setOptionsConfirmed] = useState([]);
  const [questionsConfirmed, setQuestionsConfirmed] = useState([]);
  const [questionID, setQuestionID] = useState("");
  const [teacherID, setTeacherID] = useState("");

  //Validate inputs
  const [error, setError] = useState("");

  //Confirm the survey has been sent
  const [complete, setComplete] = useState(false);

  //loading state for the buttons
  const [loading, setLoading] = useState(false);

  //Add survey to the database
  async function addSurvey(survey, title, scheduledDate){
    app.appCheck().activate(site_key, true);
    const addSurvey = func.httpsCallable('officer-addSurveyQuestions');
    try {
        await addSurvey({
            questions: survey,
            title: title,
            scheduledDate: scheduledDate,
        }).then((res) => {
            setQuestionID(res.data);
            alert("new survey id made: " + res.data);
        });
    } catch (e) {
        console.error(e);
    }
  }

  //assign teachers to the survey
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

  //Add answer options if the user choses multiple choice answer type
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

  //Show the questions the user has entered
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
    if (questionType === "checkbox" || questionType === "radio"){
      if (optionsConfirmed.length < 2){
        alert("Minimum 2 options.");
        pass = false;
      }
    }
    if (question.length < 1){
      alert("Question cannot be blank.");
      pass = false;
    }

    if(questionType === ''){
      return setError('Type of answer for the question cannot be blank.');
    }

    if (pass === true && question.length > 0){
      var obj = {
        question: question,
        type: questionType,
        options: optionsConfirmed,
      }

      //Clear the inputs
      setQuestionsConfirmed(oldArray => [...oldArray, obj]);
      setQuestion("");
      setQuestionType("");
      setOptionVisible(false);
      setOptions("");
      setCurrentOption("");
      setOptionsConfirmed([]);
      setError("");
    }
  };

  //Validate inputs and send to the cloud functions if all inputs are valid
  const addCurrentSurvey = async () => {
    setError('');

    //empty title
    if(title === ''){
        return setError('Please enter a title for the survey');
    }

    if(scheduledDate < today.substring(0,10)){
        return setError('Scheduled survey date should not be in the past.')
    }

    if(question !== ''){
      return setError('You have unsaved question. Save it before submitting!')
    }

    if(questionsConfirmed.length < 1){
        return setError('There should be at least 1 question in your survey.')
    }

    setLoading(true);
    //add questionsConfirmed into firebase 
    await addSurvey(questionsConfirmed, title, scheduledDate);

    setLoading(false);
    setComplete(true);
  };

  const assignInputTeacher = () => {
    //add questionsConfirmed into firebase 
    if (questionID && teacherID){
      assignTeacher();
      alert("assigned questionID: " + questionID + "to teacherID: " + teacherID);
    }
    //navigate('/'); //navigate to confirmation page with links to 1. create a new survey and to 2. distribute the survey
  };

  //Render component
  return (
    <>
    {!complete ?
    <div className="container">
      <div className='sign-in-form' onSubmit={addCurrentSurvey}>
        <h1 style={{textAlign: 'center'}}>Create a New Survey</h1>

        {error && <p className='error'>{error}</p>}
        <div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter your title here..'
          value={title}
          onInput={e => setTitle(e.target.value)} />
          <label>
            Survey Title
          </label>
        </div>

        <div className='input-field'>
          <input required className='question' type="date" 
          placeholder='Enter your title here..'
          value={scheduledDate}
          onInput={e => setScheduledDate(e.target.value)} />
          <label>
            Scheduled Date
          </label>
        </div>

        <div id="created_questions">{questionList}</div>
        <div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter your question here...'
          value={question}
          onInput={e => setQuestion(e.target.value)} />
          <label>
            Question
          </label>
        </div>

        <label>
          Type of Answer:
          <label>
            <input
              type="radio"
              value="text"
              checked={questionType === "text"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
            />
            Text
          </label>
          <label>
            <input
              type="radio"
              value="number"
              checked={questionType === "number"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(false)}}
            />
            Number
          </label>
          <label>
            <input
              type="radio"
              value="checkbox"
              checked={questionType === "checkbox"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
            />
            Checkbox
          </label>
          <label>
            <input
              type="radio"
              value="radio"
              checked={questionType === "radio"}
              onChange={e => {setQuestionType(e.target.value); setOptionVisible(true)}}
            />
            Radio
          </label><br></br>
        </label>
        <label>
          {options}
        </label>

        <div className='input-field'>
          <input type="text" onInput={e => setTeacherID(e.target.value)} />
          <label>
            Add Teacher ID (optional; only one teacher):
          </label>
        </div>

        <div className='survey-buttons'>          
          <div className='survey-sub-btns'>
            <button onClick={() => addQuestion()}> {question === '' ? 'Create question' : 'Save question'}</button>
            <button onClick={() => assignInputTeacher()}>Assign Teacher ID</button>
          </div>

          <button className='auth-btn' disabled={loading} onClick={()=> addCurrentSurvey()}>Submit Survey</button>
        </div>
      </div>
    </div>
    :
    <div className='confirmation-box'>
      <h2>Your survey has been created. </h2>
      <h4>Survey title: {title}</h4>
      <h5>What to do next?</h5>
      <p>To distrubute your survey to your designated group of teachers,
        simply go to &nbsp;<a href='/surveyDistribution'>Distribute survey</a>&nbsp;
        tab, and select a group of teachers
        you want to send this survey to.
      </p>
      <button onClick={()=>window.location.reload()}>
        Create another survey
      </button>
    </div> 
    }
    </>
  )
}
export default OfficerSurveyMaking;