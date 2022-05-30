import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom'
import app, {func} from '../../../utils/firebase';

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const Survey = () => {
  //Retrieve props from previous page
  const location = useLocation();

  //Check if survey exists
  const [isFound, setFound] = useState(true);

  //Set title and question array
  const [surveyTitle, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);

  //Set answer
  const [answers, setAnswers] = useState([]);

  //Loading state when submit the form
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
            //console.log(response.data.title);
            console.log(response.data.questions);
            console.log(response.data.questions[0].options);

            //Assign survey details to the variables
            setTitle(response.data.title);
            setQuestions(response.data.questions);

            //Clone the questions to the answers 
            setAnswers(response.data.questions);

          }

      } catch (e) {
          console.error(e);
      }
    }

    retrieveSurvey();
  }, []);


  //save the current answer to the answers array
  const saveAnswer = (e, index) => {
    //Create a new temporary array to store the answers
    let newArr = [...answers];

    //Assign the answer to its question
    newArr[index] = e.target.value;

    //Save to the answers array
    setAnswers(newArr);

  }

  //Submit survey to the server 
  const sendSurvey = async (e) => {
    e.preventDefault();

    //console.log(answers);

    //TODO: Server update goes here...
    
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
    <form className='survey' onSubmit={e => sendSurvey(e)}>
        <h1>Survey: {surveyTitle}</h1>
        {questions.map((q, index) => 
        <div className='sur-question' key={index}>
        <label>{index+1}. {q.question}</label>
        <br/>
        <br/>
          {q.options.map((o) => 
          <form>
          <input type={q.type} value={o} name={o}></input>
          <label for={o}>{o}</label>
          </form>
          )}

        
        </div>)
        }
        

        <button disabled={loading} type='submit'>Submit</button>
    </form> : <h1>Survey not found</h1>
  )
}

export default Survey;