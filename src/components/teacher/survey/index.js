import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {db, func} from '../../../utils/firebase';
import { useAuth } from '../../global/auth/Authentication';
import { useNavigate } from 'react-router-dom';
import * as toxicity from '@tensorflow-models/toxicity';

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
 
  //The minimum prediction confidence
  const threshold = 0.8;


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

  //Submit survey to the server 
  const sendSurvey = async (e, boolean) => {
    e.preventDefault();

    //TODO check toxicity before putting survey through.
    await checkToxicityPrediction(boolean);

    //updateSurvey(boolean);

    //alert('You have submitted/saved the survey!');

    //navigate('/');
    
  }

  // uses TensorflowJS to predict if the submitted answers are appropriate or not (filters out insults/profanities).
  const checkToxicityPrediction = async (boolean) => {
    // Load the model. Users optionally pass in a threshold and an array of
    // labels to include.
    let index = 0;
    let newArray = [];
    let hasToxicResponse = false;
    await toxicity.load(threshold).then(model => {

      answers.map((answer) => {
        // check if answer is an array because of checkboxes/radio
        if (answer.length === undefined){
          newArray = Object.keys(answer).map((key) => answer[key]);
          newArray.map((arrAnswer) => {
            model.classify(arrAnswer).then(predictions => {
              // `predictions` is an array of objects, one for each prediction head,
              // that contains the raw probabilities for each input along with the
              // final prediction in `match` (either `true` or `false`).
              // If neither prediction exceeds the threshold, `match` is `null`.
              index = answers.indexOf(answer) + 1
              if (predictions[6].results[0].match === true){
                hasToxicResponse = true;
                alert("Your " + index + "th answer is inappropriate. Please change it.");
              }
              if ((answers.indexOf(answer) === answers.length - 1) 
              && (newArray.indexOf(arrAnswer) === newArray.length - 1) 
              && (hasToxicResponse === false)){
                updateSurvey(boolean);
                alert('You have submitted/saved the survey!');
                navigate('/');
              }
            });
          })
        } else{
          model.classify(answer).then(predictions => {
            // `predictions` is an array of objects, one for each prediction head,
            // that contains the raw probabilities for each input along with the
            // final prediction in `match` (either `true` or `false`).
            // If neither prediction exceeds the threshold, `match` is `null`.
            index = answers.indexOf(answer) + 1
            if (predictions[6].results[0].match === true){
              hasToxicResponse = true;
              alert("Your " + index + "th answer is inappropriate. Please change it.");
            }
            if ((answers.indexOf(answer) === answers.length - 1) && (hasToxicResponse === false)){
              updateSurvey(boolean);

              alert('You have submitted/saved the survey!');

              navigate('/');
            }
          });
        }
      })
    });
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
              <>
              <h1>Survey: {surveyTitle}</h1>
               {questions.map((q, index) => 
               <div className='sur-question' key={index}>
               <label>{index+1}. {q.question}</label>
               <br/>
               <br/>
                 {q.options.length > 1 ?
                   <div >
                    { q.options.map((o) =>
                     <div key={o}>
                     <input type={q.type} value={o} checked={populateCheckboxAndRadio(o, index)} name={q.type === 'checkbox' ? o : q.question}  onChange={(e) => saveAnswer(e, index, q.type)}></input>
                     <label htmlFor={o}>{o}</label>
                     </div>
                     )}
                   </div>
                 : 
                 <div>
                 <input required type={q.type} value={populateTextAndNum(index)} placeholder={displayPlaceHolder(q.type)} onChange={(e) => saveAnswer(e, index)}></input>
                 </div>}
               </div>)
               }
                       
                <button disabled={loading} type='button' onClick={e => sendSurvey(e, false)}>{loading? "Saving..." : "Save And Continue Later"}</button>
                <button disabled={loading} type='submit'>{loading? "Submitting..." : "Complete"}</button>
              </>
       : <p>Loading...</p>}
    </form> : <h1>Survey not found</h1>
  )
}

export default Survey;