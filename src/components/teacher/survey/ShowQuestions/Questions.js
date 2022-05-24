//Main page for the components
import React, { useEffect, useState } from 'react';
import app, {func} from '../../../../utils/firebase';
import 'firebase/compat/app-check';
import { useAuth } from '../../../global/auth/Authentication'
import { useNavigate, Link } from 'react-router-dom'
import { useUserData } from '../../../global/auth/UserData'

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const Questions = () => {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [answers,setanswers]=useState('');
    const [question,setquestion]=useState('');
    const [options,setoptions]=useState('');
    const [questionID,setquestionID]=useState([]);
    const [test2,setTes2]=useState([]);

    //const navigate = useNavigate();
    async function getSurveyAnswers(){
        //console.log("questionID array empty?: " + questionID.length);
        app.appCheck().activate(site_key, true);
        const getAnswers = func.httpsCallable('teacher-getAllAssignedSurveys_Answers');
        try {
            await getAnswers().then((res) => {
                console.log(res.data);
                var array=res.data;           
                setquestionID(res.data);
                
            });
        } catch (e) {
            console.error(e);
        }
      }
    
       function getSurveyQuestions(){
           console.log("reached here");

        questionID.forEach((i) => {
            console.log("i.questionID: " + i.questionID);
            app.appCheck().activate(site_key, true);
            const getQuestions = func.httpsCallable('teacher-getAssignedSurvey_Questions');
            try {
                 getQuestions({
                    questionID: i.questionID,
                }).then((res) => {
                    console.log(res.data);          
                   
                });
            } catch (e) {
                console.error(e);
            }
        });
        
      }

       function showQuestions(){
           getSurveyAnswers();
          if(questionID.length===0){
              console.log("here");
            
          }
        //getSurveyAnswers();
        
        getSurveyQuestions();
      }
      
      async function addAnswer(answers, options){
        app.appCheck().activate(site_key, true);
        const addSurvey = func.httpsCallable('teacher-updateAssignedSurvey_Answers');
        try {
            await addSurvey({
                answers: answers,
                options: options,
            }).then((res) => {
                //
                alert("new survey id made: " + res.data);
            });
        } catch (e) {
            console.error(e);
        }
      }
      const testSubmit= async()=>{
        setError('');
        if(answers===''){
            return setError('Please enter your answer');
        }

        if(options===''){
            return setError('Please select your answer');
        }
        setLoading(true);
        await addAnswer(answers,options);
      

    }

    return (
        <div>


        <div >
        <button onClick={()=>showQuestions() }> 
                test button
            </button>

        <p>Survey title: </p>
        <p>/Title/</p>
        </div>
<div>
    <p>Question 1:</p>
</div>
        <div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter here...'
      onInput/>
          <label>
            Answers
          </label>   
        </div>
        <div>
    <p>Question 2:</p>
</div>
<div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter here...'
      onInput/>
          <label>
            Answers
          </label>   
        </div>

        <div>
    <p>Question 3:</p>
</div>
<div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter here...'
      onInput/>
          <label>
            Answers
          </label>   
        </div>

        <div>
    <p>Question 4:</p>
</div>
<div className='input-field'>
          <input required className='question' type="text" 
          placeholder='Enter here...'
      onInput/>
          <label>
            Answers
          </label>   
        </div>
        <button disabled={loading} onClick={()=>addAnswer() }> 
                Submit answer
            </button>
        <p></p>
        </div>

    )
}

export default Questions