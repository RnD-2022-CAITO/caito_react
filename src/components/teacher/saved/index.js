import React, {useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import app, {db, func} from '../../../utils/firebase';
import {useAuth} from '../../global/auth/Authentication';
import {useNavigate} from 'react-router-dom';
import {CommonLoading} from 'react-loadingg';
import { jsPDF } from 'jspdf';

import "./saveSurvey.css";

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';
const Saved = () => {
  const {currentUser} = useAuth();
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


  useEffect(() => {
    const retrieveSurvey = async () => {
      app.appCheck().activate(site_key, true);
      const getSurvey = func.httpsCallable('teacher-getAssignedSurvey_Questions');
      try {
        const response = await getSurvey({
          questionID: location.state.questionID,
        });
        if (response.data == null) {
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
                if (doc.data().teacherID === currentUser.uid) {
                  setAnswerID(doc.id);
                  targetAnswerID = doc.id;
                }
                return doc.id;
              })
            });
          populateExistingAnswers(targetAnswerID);
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
        if (newArr.length > 0) {
          setAnswers(newArr);
        }

        setFormLoading(false);

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
      if (i.length === undefined) {
        newArray = Object.keys(i).map((key) => i[key]);
      }
    });
    if (newArray.includes(o)) {
      return true;
    } else {
      return false
    }
  }

  // uses the initial answers (if there are any saved ones from previous attempts) to populate 
  // texts and numbers in the UI
  const populateTextAndNum = (index) => {
    if (answers.at(index) !== questions.at(index)) {
      return answers.at(index);
    }
  }

  // download survey
  const handleDownload = async () => {
    //get the context 
    let fileContent = ``;
    fileContent += `Title: ${surveyTitle}\n`;
    for (let i = 0; i < questions.length; i ++) {
      fileContent += `\nQ${i + 1}: ${questions[i].question}\n`;
      let answersOfQuestion = answers[i];
      const questionItem = questions[i];
      if (questionItem.options.length === 0) {
        fileContent += `Answer: ${answersOfQuestion}\n`;
      } else {
        const questionOptions = questionItem.options;
        questionOptions.forEach((option, index) => {
          fileContent += `${index + 1} ${option}\n`;
        });
        if (typeof answersOfQuestion === 'string') {
          fileContent += `Answer: ${answersOfQuestion}\n`;
        } else {
          fileContent += `Answer: ${Object.values(answersOfQuestion).join(',')}\n`;
        }
      }

      fileContent += '\n';
    }

    //export the excel file
    // let link = document.createElement("a")
    // let exportContent = '\uFEFF'
    // let blob = new Blob([exportContent+fileContent],{
    //         type:'text/plain;charset=utrf-8'
    // })
    // link.id = "download-csv"
    // link.setAttribute("href", URL.createObjectURL(blob))
    // link.setAttribute('download', `${surveyTitle}.csv`)
    // document.body.appendChild(link)
    // link.click()
    //document.body.removeChild(link); // remove a
    //URL.revokeObjectURL(link.href) // release url memory

    //export as pdf file
    console.log(fileContent)
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
    });

    doc.text(fileContent, 1, 1);
    doc.save(`${surveyTitle}.pdf`);
  }

  return (
    isFound ?
      <form className='survey'>
        {!formLoading ?
          <div className='form'>
            <h1 style={{textAlign: 'center'}}>{surveyTitle}</h1>
            {questions.map((q, index) =>
              <div className='sur-question' key={index}>
                <div className='question-label'>
                  <label>{index + 1}. {q.question}</label>
                </div>
                <br/>
                {q.options.length > 1 ?
                  <div>
                    {q.options.map((o) =>
                      <div className='task-input'  key={o}>
                        <input type={q.type} value={o} checked={populateCheckboxAndRadio(o, index)}
                               name={q.type === 'checkbox' ? o : q.question}></input>
                        <label htmlFor={o}> &nbsp; {o}</label>
                      </div>
                    )}
                  </div>
                  :
                  <div>
                    <input className='task-input' required type={q.type} value={populateTextAndNum(index)}></input>
                  </div>}
              </div>)
            }

            <div className='download-btn-group'>
              <button disabled={loading} type='button'
                      onClick={handleDownload}
              >{loading ? "Download..." : "Export as PDF"}</button>
            </div>

          </div>
          :
          <div>
            <CommonLoading color='#323547'/>
          </div>}

      </form> : <h1>Task not found</h1>
  )
}

export default Saved