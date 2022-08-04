//put survey making process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../../utils/firebase';
import 'firebase/compat/app-check';
import "./surveyMaking.css"
import { Dialog } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';
// const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSurveyMaking = () => {
  //Retrieve the addSurvey func from Authentication.js (connects to firebase)
  //const { addSurvey } = useAuth();
  // const navigate = useNavigate();

  //Set title for the survey
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [options, setOptions] = useState(""); //visual purposes
  const [questionList, setQuestionList] = useState(""); //visual purposes
  const [currentOption, setCurrentOption] = useState("");
  const [optionsConfirmed, setOptionsConfirmed] = useState([]);
  const [questionsConfirmed, setQuestionsConfirmed] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateDisplay, setTemplateDisplay] = useState("");

  const [showQuestion, setShowQuestion] = useState(false);

  //Edit question
  const [editBtn, setEditBtn] = useState(false);

  //Validate inputs
  const [error, setError] = useState("");

  //Confirm the survey has been sent
  const [complete, setComplete] = useState(false);

  //loading state for the buttons
  const [loading, setLoading] = useState(false);

  //Add survey to the database
  async function addSurvey(survey, title){
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const addSurvey = func.httpsCallable('officer-addSurveyQuestions');
    try {
        await addSurvey({
            questions: survey,
            title: title,
        });
    } catch (e) {
        console.error(e);
    }
  }

  //Get templates from the database
  async function getTemplates(){
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const getTemplates = func.httpsCallable('officer-getAllTemplateSurveys_Questions');
    try {
        await getTemplates().then(i => {
          templates.push(i.data);
          templateDropdown();
        });
    } catch (e) {
        console.error(e);
    }
  }

  useEffect(() => {
    getTemplates();
  }, []);

  //Add answer options if the user choses multiple choice answer type
  useEffect(() => {
    if (optionVisible){
      var i = [];
      var num = 0;
      i.push(<p style={{borderTop:"0.2px solid black", paddingTop:"10px"}}>Add Options (at least 2)<br></br></p>);
      i.push(<p>You've added options:<br></br></p>);
      i.push(optionsConfirmed.map((o, index) => <p key={`oc ${index}`}>{++num}. {o}<br></br></p>)); //run this only once each. 

      i.push(<label style={{fontSize:"0.85em"}}>Option:<input type="text" placeholder='Type in your option...' onInput={e => setCurrentOption(e.target.value)} /><br></br></label>);
      i.push(
      <div style={{textAlign:"center"}}>
      <button className='option-button' onClick={() => {addOption(currentOption)}}>Add</button>
      </div>
      );
      setOptions(i);
    } else{
      setOptions("");
    }
  }, [optionVisible, optionsConfirmed, currentOption]);

  //Show the questions the user has entered
  useEffect(() => {
    var num = 0;
    setQuestionList(questionsConfirmed.map((o, index) => 

      <div key={`confirmed ${index}`} className='task-question'>

      <p>{++num} </p>
      
      <div className='question'>
        <p><strong>Question: {o.question}</strong></p>

        {//Display input field
        o.type === 'text' || o.type === 'number' ? 
        <input type={o.type} placeholder={o.type}/>
        :
        //Check if input is options
        o.options.length > 0 &&
        o.options.map((i,index) => 
        <div key={`mutiple + ${i} + ${index}`}>
        <label>
        <input type={o.type} />
        {i}
        </label>
        </div>)
        }
      </div>

      {/* To be developed */}
      <div className='question-btns'>
        <button onClick={() => editQuestion(o, index)}>Edit</button>
        <button onClick={() => deleteQuestion(o, index)}>Delete </button>
      </div>
      
      </div>
      ));
  }, [questionsConfirmed]);

  const editQuestion = (o, index) => {
    console.log('clicked on edit');

    setEditBtn(true);
    
  }

  const deleteQuestion = (o, i) => {
    //remove question from the array
    setQuestionsConfirmed((q) => q.filter((_, index) => index !== i));
  }

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

    if(question !== ''){
      return setError('You have unsaved question. Save it before submitting!')
    }

    if(questionsConfirmed.length < 1){
        return setError('There should be at least 1 question in your survey.')
    }

    setLoading(true);
    //add questionsConfirmed into firebase 
    await addSurvey(questionsConfirmed, title);

    setLoading(false);
    setComplete(true);
  };

  const showInputField = () => {
    setShowQuestion(true);
  }

  useEffect((() => {
    questionsConfirmed.length === 0 && setShowQuestion(false);
  }), [questionsConfirmed])

  //The user doesn't want to save the form
  const refreshForm = () => {
    setTitle("");
    setDescription("");
    setQuestionsConfirmed([]);
    setQuestion("");
    setQuestionType("");
    setOptionVisible(false);
    setOptions("");
    setCurrentOption("");
    setOptionsConfirmed([]);
    setError("");
    setShowQuestion(false);
  }

  //TODO
  const saveDraft = () => {
    alert("This feature is being developed...");
  }

  //UI
  const templateDropdown = () => {
    let options = [];
    let content;
    let currentTargetValue;
    content =         
      <div className='template input-field'>
      <select 
      onChange={e => {
      currentTargetValue = e.target.value;
      {templates.map((template) => {
        if (currentTargetValue !== "Default"){
          setQuestionsConfirmed([]);
          setQuestionsConfirmed([...template.at(currentTargetValue).questions]);
          setTitle(template.at(currentTargetValue).title);
          if (showQuestion === false){
            setShowQuestion(true);
          }
        } else{
          setQuestionsConfirmed([]);
          setTitle("");
        }
      }
      )}
      }} value={currentTargetValue}>
      <option key={0} value="">Default</option>
    {templates.map((template) => 
      {template.map((i, index) => {
        options.push(<option key={`template ${index}`} value={index}>{i.title}</option>);
      })}
    )}
    {options}
    </select>
    <label>
      Task template
    </label>
    </div>;
    //console.log(ReactDOMServer.renderToString(content));
    setTemplateDisplay(content);
    }

  //Render component
  return (
    <>
    {!complete ?
    <>
    <h2 style={{textAlign:'center'}}>Profiling task creator</h2>
    {error && <p className='error'>{error}</p>}

    <div className='grid-layout'>
      <div className='select-display'>
        <h3>Task details</h3>

        <div className='input-field'>
            <input required  style={{width:'77.25%'}} type="text" 
            placeholder='Enter your title here..'
            value={title}
            onInput={e => setTitle(e.target.value)} />
            <label>
              Profiling Task Title
            </label>
        </div>

        {/* To be developed */}
        {/* <div style={{backgroundColor:'red'}} className='input-field'>
            <input required  style={{width:'70%'}} type="text" 
            placeholder='Enter your task description here..'
            value={description}
            onInput={e => setDescription(e.target.value)} />
            <label>
              Task description
            </label>
        </div> */}

        <div className='input-field'>
            {templateDisplay}
        </div>
      </div>

      <div className='select-display'>
        <h3>Task questions</h3>

        {!showQuestion ?
        <button style={{width:'100%'}} onClick={showInputField}>Add question</button>
        :
        <>

        <div id="created_questions">{questionList}</div>
        <div className='input-field'>
          <input style={{width:"80%"}} required type="text" 
          placeholder='Enter your question here...'
          value={question}
          onInput={e => setQuestion(e.target.value)} />
          <label>
            Question
          </label>
        </div>

        <label>
          Type of Answer:
        </label>
        <select     
          value={questionType}        
          onChange={e => 
              {
                setQuestionType(e.target.value); 
                if(e.target.value==='radio' || e.target.value ==='checkbox'){
                  setOptionVisible(true);
                }else{
                  setOptionVisible(false);
                }
              }
          }
        >
          <option value="" disabled>Select an answer type</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
        </select>
        <label>
          {options}
        </label>
        <div className='survey-buttons'>          
            <button className='survey-sub-btns' onClick={() => addQuestion()}> {question === '' ? 'Create question' : 'Save question'}</button>
        </div>

        </>}
      </div>

      <div className='select-display create-btns'> 
          <button style={{backgroundColor:'var(--warning)'}} onClick={refreshForm}>Discard</button>
          <button style={{backgroundColor:'var(--secondary-color)'}} onClick={saveDraft}>Save draft</button>
          <button  disabled={loading} onClick={()=> addCurrentSurvey()}>Create task</button>
      </div>
    </div>
    </>
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
    
    <Dialog
                title="Edit question"
                isOpen={editBtn}
                onClose={() => setEditBtn(false)}
    >
                <div>
                    <p>
                        Sample Dialog Content to display!
                    </p>
  
                </div>
    </Dialog>
    </>
  )
}
export default OfficerSurveyMaking;