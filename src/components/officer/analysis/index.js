//main page for the components
import React, {useState, useEffect, useRef} from 'react'
import app, {func} from '../../../utils/firebase';
import { db } from '../../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { CommonLoading } from 'react-loadingg';

import "./Analysis.css"

// const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const OfficerSummary = () => {
  const navigate = useNavigate();
  const [questionID, setQuestionID] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchRef = useRef();
  const [search, setSearch] = useState(false);

  //Get surveys
  useEffect(() => {
      const retrieveQuestionID = async  () => {
          app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
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
        if(questionID.length>=1){
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
                  return {
                    ...doc,
                    total: total,
                    complete: complete
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

  },[questionID]);

  const clickButton = (question) => {
    navigate(`/survey-stats/${question.id}`, { state: { question: question} });
  }

  const searchSurvey = (e) => {

    setSearch(!search);

    console.log(search);

    if(!searchRef.current.value.trim()){
      setSearch(false);
    }

  }

  return (
    loading ? 
    <div>
      <CommonLoading color='#fff' />
    </div>
    :
    <div>
        <h1 style={{textAlign:'center'}}>Your Profiling Tasks</h1>

        <div className='search-engine'>
          <input id='search-input' type="text" ref={searchRef} placeholder="Type survey name to search"/>
          <button id="search-btn" onClick={searchSurvey}>
            {search ? 'Clear' : 'Search'}
          </button>
        </div>
        {!search ? 
        //Display all surveys
        <>
        <h5 style={{textAlign:'center'}}>You have {questionID.length} survey(s) in total</h5>
        {questionID.map(question => (
          renderQuestion(question, clickButton)
        ) )}
        </>
        :
        //display surveys that matches with the pattern on the search engine 
        <>
        <h5 style={{textAlign:'center'}}>Search matched with "{searchRef.current.value}"</h5>

        {questionID.map(question => (
          question.title.toLowerCase().includes(searchRef.current.value.toLowerCase()) &&
          renderQuestion(question, clickButton)
        ) )}
        </>}
    </div>
  )
}

export default OfficerSummary

function renderQuestion(question, clickButton) {
  return <div key={question.id}>
    <div className='summary-view'>
      <h3>{question.title}</h3>
      <hr/>
      <br/>
      <h4>Question ID: {question.id}</h4>
      <p>Total surveys sent out: {question.total}</p>
      <p>Total teachers submitted: {question.complete}</p>
      <p>Completion rate: {question.total !== 0 ? question.complete / question.total * 100 + " %" : "You haven't distribute this survey yet"}</p>
      <button className='summary-btn' onClick={() => clickButton(question)}>View details</button>
    </div>
  </div>;
}
