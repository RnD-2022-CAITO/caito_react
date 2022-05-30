import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {func} from '../../../utils/firebase';
import "./survey.css";

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const Survey = () => {
  const location = useLocation();

  const [isFound, setFound] = useState(true);

  const [surveyTitle, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(false);


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

            setTitle(response.data.title);
            setQuestions(response.data.questions);
            setAnswers(response.data.questions);

          }

      } catch (e) {
          console.error(e);
      }
    }

    retrieveSurvey();
  }, []);


  const saveAnswer = (e, index) => {
    console.log(e.target.value);
    console.log(index);

    //Create a new temporary array to store the answers
    let newArr = [...answers];

    //Assign the answer to its question
    newArr[index] = e.target.value;

    //Save to the answers array
    setAnswers(newArr);

  }

  const sendSurvey = async (e) => {
    e.preventDefault();

    console.log(answers);

    //Server update goes here...
    
  }

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
    <form className='survey' onSubmit={e => sendSurvey(e)}>
        <h1>Survey: {surveyTitle}</h1>
        {questions.map((q, index) => 
        <div className='sur-question' key={index}>
        <label>{index+1}. {q.question}</label>
        <br/>
        <input required id={index} placeholder={displayPlaceHolder(q.type)} type = {q.type} onChange={(e) => saveAnswer(e, index)}/>
        </div>)}

        <button disabled={loading} type='submit'>Submit</button>
    </form> : <h1>Survey not found</h1>
  )
}

export default Survey