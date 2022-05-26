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
      const retrieveAnswers =  async () => {
        console.log('run')
        if(questionID.length>1){
          const newArr = await Promise.all(questionID.map(async (question) => {
            var total = 0;
            var complete = 0;
            const res =  await db.collection('survey-answer').where('questionID', '==', question.id).get()
            .then((res) => 
            {
                res.docs.map(doc => {
                  // console.log(doc.data());
                  total += 1;
                  if(doc.data().isSubmitted){
                    complete+=1;
                  }
                });

                return ({total: total, complete: complete});
            });

            const newObj = {
              ...question,
              total: res.total,
              complete: res.complete
            }
            return newObj;
          }))

          setQuestionID(newArr)
        }
      }

      retrieveAnswers();

  },[JSON.stringify(questionID)]);

  const clickButton = (question) => {
    alert('this feature has not been developed.')
  }

  return (
    loading ? 
    <p>Loading..</p>
    :
    <div>
        <h1 style={{textAlign:'center'}}>Survey Summary</h1>

        <h5 style={{textAlign:'center'}}>You have {questionID.length} survey(s) in total</h5>

        {questionID.map(question => (
          <div key={question.id}>
                <div className='summary-view'>
                <h3>{question.title}</h3>
                <h4>Question ID: {question.id}</h4>
                <p>Total surveys sent out: {question.total}</p>
                <p>Total teachers submitted: {question.complete}</p>
                <p>Completion rate: {question.total != 0 ? question.complete/question.total * 100 + " %" : "You haven't distribute this survey yet"}</p>
                <button className='summary-btn' onClick={() => clickButton(question)}>View details</button>
              </div>
          </div>
        ) )}
    </div>
  )
}

export default OfficerSummary