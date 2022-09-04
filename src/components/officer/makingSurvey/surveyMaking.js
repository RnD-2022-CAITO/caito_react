//put survey making process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../../utils/firebase';
import 'firebase/compat/app-check';
import "./surveyMaking.css"
import { Button, Classes, Dialog, Divider, HTMLSelect, Icon } from '@blueprintjs/core';
import { CommonLoading } from 'react-loadingg';
import { Footer } from '../../global/Footer';
import { Title } from './Title';
import { Questions } from './Questions';
import { Tooltip2 } from '@blueprintjs/popover2';


const OfficerSurveyMaking = () => {
  //Retrieve the addSurvey func from Authentication.js (connects to firebase)
  //const { addSurvey } = useAuth();
  // const navigate = useNavigate();

  //Set title for the survey
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [optionVisible, setOptionVisible] = useState(false);
  const [options, setOptions] = useState(""); //visual purposes
  const [questionList, setQuestionList] = useState(""); //visual purposes
  const [currentOption, setCurrentOption] = useState("");
  const [optionsConfirmed, setOptionsConfirmed] = useState([]);
  const [questionsConfirmed, setQuestionsConfirmed] = useState([]);

  // eslint-disable-next-line
  const [templates, setTemplates] = useState([]);
  const [templateDisplay, setTemplateDisplay] = useState("");

  const [showQuestion, setShowQuestion] = useState(false);

  //Edit question
  const [editBtn, setEditBtn] = useState(false);

  //Display questions onto the dialog
  const [dialogDisplay, setDialogDisplay] = useState();
  const [editQ, setEditQ] = useState("");
  const [qType, setQType] = useState("");
  const [index, setIndex] = useState(0);
  const [optionsQ, setOptionsQ] = useState("");
  const [currentOptionQ, setCurrentOptionQ] = useState("");

  const [editErr, setEditErr] = useState("");

  //Validate inputs
  const [error, setError] = useState("");

  //Confirm the survey has been sent
  const [complete, setComplete] = useState(false);

  //loading state for the buttons
  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

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
          setInitialLoading(false);
        });
    } catch (e) {
        console.error(e);
    }
  }

  useEffect(() => {
    getTemplates();

  // eslint-disable-next-line
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

      <p style={{color:"white"}}>{++num} </p>
      
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
        &nbsp; {i}
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
  // eslint-disable-next-line
  }, [questionsConfirmed]);

  const editQuestion = (o, index) => {
    setDialogDisplay([]);

    console.log(o);

    //Close the dialog
    setEditBtn(true);

    //Copy the question into the editQ var
    setEditQ(o.question);
    setQType(o.type);

    if(o.type === "checkbox" || o.type === "radio"){
      setOptionsQ(o.options);
    }

    //Set the edit index
    setIndex(index);

    //Render component
    renderDialog(editQ, qType, index, optionsQ, currentOptionQ);
  }

  useEffect(() => {
    if(qType === 'number' || qType === 'text'){
      setOptionsQ("");
    }
    
    renderDialog(editQ, qType, index, optionsQ, currentOptionQ)

    if(editBtn === false){
      clearDialog()
    }

  // eslint-disable-next-line
  },[editQ, qType, editErr, currentOptionQ, optionsQ, editBtn])

  const renderDialog = (q, qType, index, optionsQ, currentOptionQ) => {
    setDialogDisplay(
      <div className='dialog-box'>
      <div className='input-field'>
        <input className='input-dialog' type="text" value={q} 
        onChange={e => {
          setEditQ(e.target.value);
        }}/>
        <label>
          Question
        </label>
      </div>
  
      <div className='input-field'>    

        <HTMLSelect       
          value={qType}     
          onChange={e => 
              {
                setQType(e.target.value);

                if(e.target.value === 'text' || e.target.value === 'number'){
                  setOptionsQ("");
                }
              }
          }
        >
          <option value="" disabled>Select an answer type</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>

        </HTMLSelect>
  
        <label>
              Type of Answer:
        </label>
      </div> 

      {optionsQ !== "" &&
        optionsQ.map((o, index) => 
          <div className='options-edit'>
         
          <label>
            <input type={qType}/>
            &nbsp; {o} 
          </label>

          <button className='warning-btn' onClick={() => {removeOption(o, index)}}>X</button>
          </div>)
      }

      {(qType === "checkbox" || qType === "radio") && 
      <div>
        <input placeholder='Add new option...' value={currentOptionQ} 
        onChange={e => {setCurrentOptionQ(e.target.value)}}/>

        <button onClick={addNewOptionEdit}>Add</button>
        
      </div>}
      
      {editErr && <p className='error'>{editErr}</p>}
  
      <div style={{textAlign:'center', marginTop:'30px'}}>
        <button onClick={() => confirmEdit(index)}>Confirm</button>
        <button className='warning-btn' onClick={() => {
          setEditBtn(false)
          clearDialog()
          }
          }>Cancel</button>
      </div>
      </div>
      )
  }

  //Confirm all the edits
  const confirmEdit = (index) =>{
    setEditErr("");

    if(editQ === ""){
      return setEditErr("Question cannot be blank.");
    }

    if(qType === "radio" || qType === "checkbox"){
      if(optionsQ.length < 2){
        return setEditErr("Minimum 2 options for this type of question");
      }
    } 

    //Copy the array
    var questionArr = [...questionsConfirmed];

    //Copy the new question to the object
    questionArr[index].question = editQ;

    questionArr[index].type = qType;
    
    if(questionArr[index].type === "radio" || questionArr[index].type === "checkbox")
    {
      questionArr[index].options = optionsQ;
    }

    //Update the new question
    setQuestionsConfirmed(questionArr);

    //Close dialog
    setEditBtn(false);
  
    clearDialog();
  }

  //Add new question in the edit
  const addNewOptionEdit = () => {
    if(currentOptionQ === ""){
      return setEditErr("Options cannot be blank");
    }

    setOptionsQ(oldArray => [...oldArray, currentOptionQ]);

    //clear the option field
    setCurrentOptionQ("");
    setEditErr("")
  }

  //Remove option from multiple choice question type
  const removeOption = (o, i) => {
    console.log(o, i);

    setOptionsQ((q) => q.filter((_, index) => index !== i));
  }

  //Clear dialog 
  const clearDialog = () => {

    setQType("");
    setIndex(0);
    setOptionsQ("");
    setCurrentOptionQ("");
    setEditErr("");
  
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
      return setError("Option cannot be blank.");
    }
  };

  const addQuestion = () => {
    var pass = true;
    if (questionType === "checkbox" || questionType === "radio"){
      if (optionsConfirmed.length < 2){
        return setError("Minimum 2 options.");
      }
    }
    if (question.length < 1){
      return setError("Question cannot be blank.");
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
    // setDescription("");
    setQuestionsConfirmed([]);
    setQuestion("");
    setQuestionType("");
    setOptionVisible(false);
    setOptions("");
    setCurrentOption("");
    setOptionsConfirmed([]);
    setError("");
    setShowQuestion(false);
    setPage(1);
  }

  //UI
  const templateDropdown = () => {
    let options = [];
    let content;
    let currentTargetValue;
    content =         
      <div className='template input-field'>
      <HTMLSelect className='select-bp'
      onChange={e => {
      currentTargetValue = e.target.value;

      // eslint-disable-next-line
      templates.map((template) => {

        if (currentTargetValue !== ""){
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

        //Move to question page
        setPage(2);
      }
      )

      }} value={currentTargetValue}>
      <option key={0} value="">Default</option>
    {
    // eslint-disable-next-line
    templates.map((template) => 
      // eslint-disable-next-line
      {template.map((i, index) => {
        options.push(<option key={`template ${index}`} value={index}>{i.title}</option>);
      })
      }
      
    )}
    {options}
    </HTMLSelect>
    <label>
      Task template 
      <Tooltip2
        content={<span>Contains a set of pre-defined questions for a specific topic. 
          <br/>
          You can set the template into default if you want to create your own set of questions.
        </span>}
        openOnTargetFocus={false}
        placement="right"
      >
        <Button className={Classes.MINIMAL} icon="help" />
      </Tooltip2>
    </label>
    </div>;
    setTemplateDisplay(content);
    }


  //Multi step form
  const [page, setPage] = useState(1);

  //Toggle between different pages in the multi step form
  const togglePage = () => {
    switch(page){
      case 1:
       return <Title title={title} setTitle={setTitle} templateDisplay={templateDisplay}/>;
      case 2:
        return <Questions 
        showQuestion={showQuestion} 
        showInputField={showInputField}
        questionList={questionList}
        question={question}
        setQuestion={setQuestion}
        questionType={questionType}
        setOptionVisible={setOptionVisible}
        setQuestionType={setQuestionType}
        options={options}
        addCurrentSurvey={addCurrentSurvey}
        addQuestion={addQuestion}
        loading={loading}
        refreshForm={refreshForm}
      />
      default:
       return <Title title={title} setTitle={setTitle} templateDisplay={templateDisplay}/>;
    }
  }

  //Render component
  return (
    <>
    {initialLoading ? <CommonLoading color='#323547' /> :
    <>
    <div className='main-wrapper'>
      
      <>
    {!complete ?
    <>
    <h1 style={{textAlign:'center'}}>Profiling Task Form</h1>
    {error && <p className='error'>{error}</p>}
    <Divider />
    <br></br>
    <div className='steps-progress'>
      <Button
        className={Classes.MINIMAL}
        disabled={page === 1}
        icon={title !== '' ? <Icon icon='confirm' color='var(--caito-blue)' />:null}
        onClick={() => setPage(1)}
      >
        1. Title
      </Button>

      <Button
        className={Classes.MINIMAL}
        disabled={page === 2}
        icon={questionsConfirmed.length>0 ? <Icon icon='confirm' color='var(--caito-blue)' />:null}
        onClick={() => setPage(2)}
      >
        2. Questions
      </Button>

    </div>

    <div className='form-creator'>
      {togglePage()}
    </div>

    <div className='steps-progress'>
    <Button
    icon="arrow-left"
    disabled={page === 1 ? true : false}
    onClick={()=>setPage(page-1)}/>

    <Button
    icon="arrow-right"
    disabled={page === 2 ? true : false}
    onClick={()=>setPage(page+1)}
    />
    </div>

    </>
        :
        <div className='confirmation-box'>
          <h1>Your survey has been created. </h1>
          <Divider />
          <h2>Survey title: {title}</h2>
          <Divider />
          <h3>What to do next?</h3>
          <p>To distrubute your survey to your designated group of teachers,
            simply go to &nbsp;<a href='/survey-distribution'
            style={{color:'var(--primary-dark'}}
            >Distribute survey</a>&nbsp;
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
                        {dialogDisplay}
                </div>
    </Dialog>
    </>      
    </div>
    <Footer/>
    </>
    }
    </>
  )
}
export default OfficerSurveyMaking;