//main page for the components
import React, {useState, useEffect} from 'react'
import app, {func} from '../../../utils/firebase';
import { db } from '../../../utils/firebase';

import "./Analysis.css"


const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSummary = () => {
  const [questionID, setQuestionID] = useState([]);
  const [loading, setLoading] = useState(true);

  // const {currentUser} = useAuth();
  // const [questionID, setQuestionID] = useState([]);

  //Get surveys
  useEffect(() => {
      const retrieveQuestionID = async  () => {
          app.appCheck().activate(site_key, true);
          const getQuestion = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
          try {
              const response = await getQuestion();
              setQuestionID(response.data);

              setLoading(false);
          } catch (e) {
              console.error(e);
          }
      }

      retrieveQuestionID();
  },[]);

  //Get surveys
  useEffect(() => {
      const retrieveAnswers = async  () => {
        if(questionID.length>1){
          questionID.map( async question => {
            var total = 0;
            var complete = 0;
            return db.collection('survey-answer').where('questionID', '==', question.id).get()
            .then((res) => 
            {
                res.docs.map(doc => {
                  // console.log(doc.data());
                  total += 1;
                  if(doc.data().isSubmitted){
                    complete+=1;
                  }
                });

                question.total = total;
                question.complete = complete;
                return question;
            });
          }
          )
        }
      }

      retrieveAnswers();

  },[questionID]);

  const clickButton = (question) => {
    console.log(question)
    if(question.total === 0){
      alert('You have not assigned this survey to any teachers')
    } else {
      var message = "";
      message += "Survey is sent out to the teachers on: " + question.scheduledDate;
      var progress = question.complete/question.total * 100;
      message += "\n Complettion rate: "+ progress + "%";
      message += "\n Distributed: "+ question.total + "surveys";
      message += "\n "+ question.complete + " teacher(s) have submitted their survey.";

      alert(message);
    }
  }

  return (
    <div>
        <h1 style={{textAlign:'center'}}>Survey Summary</h1>

        <h5 style={{textAlign:'center'}}>You have {questionID.length} survey(s) in total</h5>

        {questionID.map(question => (
          <div key={question.id}>
                <div className='summary-view'>
                <h3>{question.title}</h3>
                <h4>Question ID: {question.id}</h4>
                <button className='summary-btn' onClick={() => clickButton(question)}>View details</button>
              </div>
          </div>
        ) )}
    </div>
  )
}

export default OfficerSummary