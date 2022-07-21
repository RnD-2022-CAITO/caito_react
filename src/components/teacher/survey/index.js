import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {db, func} from '../../../utils/firebase';
import { useAuth } from '../../global/auth/Authentication';
import { useNavigate } from 'react-router-dom';

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

            setFormLoading(false);
          }

          //Retrieve Answer ID
          await db.collection('survey-answer').where('questionID', '==', location.state.questionID).get()
          .then((res) => {
              return res.docs.map(doc => {
                  if(doc.data().teacherID === currentUser.uid){
                    setAnswerID(doc.id);
                  }
                  console.log("doc.id: " + doc.id);
                  populateExistingAnswers(doc.id);
                  return doc.id;
              })
          });

          
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
  const populateExistingAnswers = async (id) => {
    app.appCheck().activate(site_key, true);
    const getAnswers = func.httpsCallable('teacher-getAssignedSurvey_Answers');
    try {
        getAnswers({
        answerID: id
      }).then((i) => {
        let newArr = [...i.data.answers];
        if (newArr.length > 1){
          setAnswers(newArr);
          console.log("newArr: " + newArr); // <- this updates TODO
          console.log("answers: "+ answers); // <- this doesn't. updates too slow. how to populate existing answers?
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
          setCheckboxVal(oldArr => ([...oldArr, newItem]));
        }
      } else {
        //When user unchecks
        const item = e.target.value;
        const removed = checkboxVal.filter(e => e!==item);
        
        setCheckboxVal(removed);
      }
    }else{
      newArr[index] = e.target.value;

      //Save to the answers array
      setAnswers(newArr);
    }
  }

  //Submit survey to the server 
  const sendSurvey = async (e, boolean) => {
    e.preventDefault();

    updateSurvey(boolean);

    alert('You have submitted/saved the survey!');

    navigate('/');
    
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
                     <input type={q.type} value={answers.at(index)} name={q.type === 'checkbox' ? o : q.question}  onChange={(e) => saveAnswer(e, index, q.type)}></input>
                     <label htmlFor={o}>{o}</label>
                     </div>
                     )}
                   </div>
                 : 
                 <div>
                 <input required type={q.type} value={answers.at(index)} placeholder={displayPlaceHolder(q.type)} onChange={(e) => saveAnswer(e, index)}></input>
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