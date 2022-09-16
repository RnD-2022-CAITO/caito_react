import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {db, func} from '../../../utils/firebase';
import { useAuth } from '../../global/auth/Authentication';
import { useNavigate } from 'react-router-dom';
import { CommonLoading } from 'react-loadingg';
import { Dialog } from '@blueprintjs/core';
import axios from 'axios'

import "./saveSurvey.css";

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const Saved = () => {
  const {currentUser} =  useAuth();
  //Retrieve props from previous page
  const location = useLocation();
  const navigate = useNavigate();

  //Check if survey exists
  const [isFound, setFound] = useState(true);

  //Set title and question array
  const [surveyTitle, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  //Set answers
  const [answers, setAnswers] = useState([]);
  const [answerID, setAnswerID] = useState('');

  //Set loading state for the form
  const [formLoading, setFormLoading] = useState(true);

  //Loading state when submit the form
  const [loading, setLoading] = useState(false);

  const [checkboxVal, setCheckboxVal] = useState([]);
  const [index, setIndex] = useState('');

  const FileDownload = require('js-file-download');

  axios({
  url: 'http://localhost:3000/survey/' + questions,
  method: 'GET',
  responseType: 'blob', // Important
}).then((response) => {
    FileDownload(response.data, 'report.csv');
});


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
  
  return (
    isFound ?
    <form className='survey'> 
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
                     <input type={q.type} value={o} checked={populateCheckboxAndRadio(o, index)} name={q.type === 'checkbox' ? o : q.question}  ></input>
                     <label htmlFor={o}> &nbsp; {o}</label>
                     </div>
                     )}
                   </div>
                 : 
                 <div>
                 <input className='task-input' required type={q.type} value={populateTextAndNum(index)} ></input>
                 </div>}
               </div>)
               }
                       
                <div className='download-btn-group'>
                  
                  <button disabled={loading} type='button' 
                  onClick={FileDownload}
                  >{loading? "Download..." : "Download"}</button>
                  </div>

              </div>
       :             
        <div>
          <CommonLoading color='#323547' />
        </div> }

    </form> : <h1>Task not found</h1>
  )
}

export default Saved;