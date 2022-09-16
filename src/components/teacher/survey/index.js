import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {db, func} from '../../../utils/firebase';
import { useAuth } from '../../global/auth/Authentication';
import { useNavigate } from 'react-router-dom';
import { CommonLoading } from 'react-loadingg';
import { Dialog } from '@blueprintjs/core';
import axios from 'axios'

import "./survey.css";

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const Survey = () => {
  const {currentUser} = useAuth();
  //Retrieve props from previous page
  const location = useLocation();

  const navigate = useNavigate();

  //Check if survey exists
  const [isFound, setFound] = useState(true);

  //Set title and question array
  const [surveyTitle, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  //Set answer
  const [answers, setAnswers] = useState([]);
  const [answerID, setAnswerID] = useState('');

  //Set loading state for the form
  const [formLoading, setFormLoading] = useState(true);

  //Loading state when submit the form
  const [loading, setLoading] = useState(false);

  const [checkboxVal, setCheckboxVal] = useState([]);
  const [index, setIndex] = useState('');

  useEffect(() => {
    const retrieveSurvey = async  () => {
      app.appCheck().activate(site_key, true);
      const getSurvey = func.httpsCallable('teacher-getAssignedSurvey_Questions');
      try {
          const response = await getSurvey({
            questionID: location.state.questionID,
          });
          if(response.data == null){
            setFound(false);
          } else {
            //Assign survey details to the variables
            setTitle(response.data.title);
            setQuestions(response.data.questions);

            //Clone the questions to the answers 
            setAnswers(response.data.questions);

            let targetAnswerID = "";
            //Retrieve Answer ID
          await db.collection('survey-answer').where('questionID', '==', location.state.questionID).get()
          .then((res) => {
              return res.docs.map(doc => {
                  if(doc.data().teacherID === currentUser.uid){
                    setAnswerID(doc.id);
                    targetAnswerID = doc.id;
                  }
                  return doc.id;
              })
          });
            populateExistingAnswers(targetAnswerID); 

            setFormLoading(false);
          }
          
      } catch (e) {
          console.error(e);
      }
    }

    retrieveSurvey();

    // eslint-disable-next-line
  }, []);

  //Update checkbox values
  useEffect(() => {
    if(index!==''){
      let newArr = [...answers];
      newArr[index] = Object.assign({}, checkboxVal);
      setAnswers(newArr);
    }
    // eslint-disable-next-line
  }, [checkboxVal])

  //populate existing answers upon page initialization
  const populateExistingAnswers = (id) => {
    app.appCheck().activate(site_key, true);
    const getAnswers = func.httpsCallable('teacher-getAssignedSurvey_Answers');
    try {
        getAnswers({
        answerID: id
      }).then((i) => {
        let newArr = [...i.data.answers];
        if (newArr.length > 0){
          setAnswers(newArr);
        }
      }).catch(e => {
        console.log(e);
      });
    } catch (e) {
        console.error(e);
    }
  }

  //save the current answer to the answers array
  const saveAnswer = (e, index, type) => {
    //Create a new temporary array to store the answers
    let newArr = [...answers];
    setIndex(index);

    //Assign the answer to its question
    if(type==="checkbox"){
      if(e.target.checked){
        if(!(checkboxVal.indexOf(e.target.value) > -1)){
          const newItem = e.target.value;
          let newArray = [];
          if (answers.at(index) !== checkboxVal){ // if initial saved answers and checkbox values are not the same
            newArray.push(answers.at(index)); 
            newArray.forEach((i) => {
              if (i.length === undefined){
                newArray = Object.keys(i).map((key) => i[key]);
              }
            });
            let question = questions[index].question;
            if (newArray.includes(question)){ // check if the actual question is in the answer[index]
              setCheckboxVal([]);
            } else {
              setCheckboxVal(newArray);
            }
          }
            setCheckboxVal(oldArr => ([...oldArr, newItem]));
        }
      } else {
        //When user unchecks
        let newArray = [];
        if (answers.at(index) !== checkboxVal){ // if initial saved answers and checkbox values are not the same
          newArray.push(answers.at(index));
          newArray.forEach((i) => {
          if (i.length === undefined){
            newArray = Object.keys(i).map((key) => i[key]);
          }
        });
          const item = e.target.value;
          const removed = newArray.filter(e => e!==item);
          setCheckboxVal(removed);
        }else{
          const item = e.target.value;
          const removed = checkboxVal.filter(e => e!==item);
          setCheckboxVal(removed);
        }
      }
    }else{ // if type is radio
      newArr[index] = e.target.value;

      //Save to the answers array
      setAnswers(newArr);
      populateCheckboxAndRadio(e.target.value, index);
    }
  }

  // uses the initial answers (if there are any saved ones from previous attempts) to populate 
  // checkboxes and radios in the UI
  const populateCheckboxAndRadio = (o, index) => {
    let newArray = [];
    newArray.push(answers.at(index));
    newArray.forEach((i) => {
      if (i.length === undefined){
        newArray = Object.keys(i).map((key) => i[key]);
      }
    });
    if (newArray.includes(o)){
      return true;
    }
    else {
      return false
    }
  }

  // uses the initial answers (if there are any saved ones from previous attempts) to populate 
  // texts and numbers in the UI
  const populateTextAndNum = (index) => {
    if (answers.at(index) !== questions.at(index)){
      return answers.at(index);
    }
  }

  //Set confirmation dialog state
  const [dialog, setDialog] = useState("");

  //Submit survey to the server 
  const sendSurvey = async (e, boolean) => {
    e.preventDefault();

    updateSurvey(boolean);

    if(boolean){
      setDialog("You have successfully submitted your task!");
    }else{
      setDialog("Task has been saved! You can continue to submit your task any time.");
    }
  }

  const updateSurvey = (boolean) => {
    app.appCheck().activate(site_key, true);
    const getSurveys = func.httpsCallable('teacher-updateAssignedSurvey_Answers');
    try {
        setLoading(true);
        getSurveys({
          answerID: answerID,
          answers: answers,
          isSubmitted: boolean
        });
        setLoading(false);
    } catch (e) {
        console.error(e);
    }
}

  //Placeholder for the inputs
  const displayPlaceHolder = (inputType ) => {
    switch(inputType) {
      case 'text':
        return 'Type in your text...';
      case 'number':
        return 'Enter a number';
      default:
        return 'Enter your input here...'
    }
  }
  

  return (
    isFound ?
    <form className='survey' onSubmit={e => sendSurvey(e, true)}> 
       {!formLoading ? 
              <div className='form'>
              <h1 style={{textAlign:'center'}}>{surveyTitle}</h1>
               {questions.map((q, index) => 
               <div className='sur-question' key={index}>
              <div className='question-label'> 
                <label>{index+1}. {q.question}</label>
              </div>
               <br/>
                 {q.options.length > 1 ?
                   <div >
                    { q.options.map((o) =>
                     <div key={o}>
                     <input type={q.type} value={o} checked={populateCheckboxAndRadio(o, index)} name={q.type === 'checkbox' ? o : q.question}  onChange={(e) => saveAnswer(e, index, q.type)}></input>
                     <label htmlFor={o}> &nbsp; {o}</label>
                     </div>
                     )}
                   </div>
                 : 
                 <div>
                 <input className='task-input' required type={q.type} value={populateTextAndNum(index)} placeholder={displayPlaceHolder(q.type)} onChange={(e) => saveAnswer(e, index)}></input>
                 </div>}
               </div>)
               }
                       
                <div className='class-btn-group'>
                <button disabled={loading} style={{backgroundColor:'var(--tertiary-color)'}} type='button' onClick={e => sendSurvey(e, false)}>{loading? "Saving..." : "Save And Continue Later"}</button>
                <button disabled={loading} type='submit'>{loading? "Submitting..." : "Complete"}</button>
                </div>

              </div>
       :             
        <div>
          <CommonLoading color='#323547' />
        </div> }

    {dialog!=="" && 
    <Dialog
      title= "Confirmation"
      isOpen={dialog !=="" ? true : false}
      onClose={() => navigate('/')}
    >
      <p style={{padding:'10px'}}>
       {dialog}
      </p>
    </Dialog>}
    </form> : <h1>Task not found</h1>
  )
}

export default Survey;