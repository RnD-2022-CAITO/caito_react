//put survey stats here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './surveyStats.css';
import ReactDOMServer from 'react-dom/server';
import { Dialog, AnchorButton, H1 } from "@blueprintjs/core";
// using node-style package resolution in a CSS file: 
//import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const OfficerSurveyStats = () => {
    const {state} = useLocation();
    const {question} = state; // Read values passed on state
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teachersID, setTeachersID] = useState([]);
    const [content, setContent] = useState("inital");
    const [dialog, setDialog] = useState(false);
    const [dialogContent, setDialogContent] = useState([]);
    const [pages, setPages] = useState([]);
    let currentPageIndex = 0;

    useEffect(() => {
        app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
        const getAnswers = func.httpsCallable('officer-getAllCreatedSurveys_Answers');
        try {
            const response = getAnswers({
                questionID: question.id,
            }).then((i) => {
                let newArr = [...i.data];
                let index = 0;
                newArr.map(o => {
                    if ((newArr.length-1) === index){
                        getTeacher(o.teacherID, true);
                    } else{
                        getTeacher(o.teacherID, false);
                    }
                    ++index;
                })
                setAnswers(newArr);
              }).catch(e => {
                console.log(e);
              });
        } catch (e) {
            console.error(e);
        }
      }, []);

      async function getTeacher(teacherID, boolean){
        app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
        const getInfo = func.httpsCallable('officer-getTeacher');
        try {
            const response = await getInfo({
                teacherID: teacherID,
            }).then((i) => {
                if (!teachersID.includes(teacherID)){
                    teachersID.push(teacherID);
                    const newObj = {
                        ...i.data,
                        teacherID: teacherID,
                      }
                    teachers.push(newObj);
                }
                if (boolean === true){
                    setLoading(false);
                }
              }).catch(e => {
                console.log(e);
              });
        } catch (e) {
            console.error(e);
        }
      }

      // UI
      function renderTeachers(id, index, condition) {
        let teacher = "";
        teachers.map(o => {
            if (o.teacherID === id){
                teacher = o;
            }
        })

        if (condition === "all"){
            return <div key={index}>
            <div className='summary-view'>
            <h4>{index + 1}. {teacher.firstName} {teacher.lastName}</h4>
            {answers.map((o, index) => ( //list out all answer copies from the teacher
                renderAnswers(o, teacher, index)
            ))}
            </div>
            </div>;
        } else if (condition === "submitted"){
            let filteredArr = [];
            let content = "There is none here!";
            answers.map((o) => {
                if (o.isSubmitted === true){
                    filteredArr.push(o);
                }
            });
            if (filteredArr.length > 0){
                content = <div key={index}>
                <div className='summary-view'>
                <h4>{index + 1}. {teacher.firstName} {teacher.lastName}</h4>
                {filteredArr.map((o, index) => ( //list out all completed answer copies from the teacher
                    renderAnswers(o, teacher, index)
                ))}
                </div>
                </div>;
            }
            return content;
        } else if (condition === "unsubmitted"){
            let filteredArr = [];
            let content = "There is none here!";
            answers.map((o) => {
                if (o.isSubmitted === false){
                    filteredArr.push(o);
                }
            });
            if (filteredArr.length > 0){
                content = <div key={index}>
                <div className='summary-view'>
                <h4>{index + 1}. {teacher.firstName} {teacher.lastName}</h4>
                {filteredArr.map((o, index) => ( //list out all completed answer copies from the teacher
                    renderAnswers(o, teacher, index)
                ))}
                </div>
                </div>;
            }
            return content;
        }   
      }

      // UI
      function renderAnswers(o, t, index) {
        if (o.teacherID === t.teacherID){
            return <div key={index+t}>
                <div>
                    <h4>Total questions: {question.questions.length}</h4> 
                    <h4>Total answered questions: {o.answers.length}</h4> 
                    <h4>Submitted? {o.isSubmitted ? "Yes" : "No"}</h4> 
                    {timeline(question, o)}
                    {setButton(o.answers, o.teacherID, o.id, o.isSubmitted)}
                </div>
                
            </div>;
        }
      }

      // set expiry date to 7 days from today so that officer can't spam the teacher
      async function sendNotification(teacherID, answerID) {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        expiry = expiry.toLocaleDateString('sv', { timeZone: 'Pacific/Auckland' });
        app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
        const addReminder = func.httpsCallable('officer-addSurveyReminder');
        try {
            await addReminder({
                teacherID: teacherID,
                answerID: answerID,
                expiryDate: expiry
            }).then((i) => {
                if (i.data === "doc exists"){
                    alert("You have recently notified the teacher about this already.");
                }else{
                    alert("Successfully sent notification to " + teacherID);
                }
              }).catch(e => {
                console.log(e);
              });
        } catch (e) {
            console.error(e);
        }
      }

      // view submission
      async function viewSubmission(answers) { //
        setDialog(true);
        setDialogContent([]);
        let dialogContentTemp = [];
        currentPageIndex = 0;
        let pageIndex = 1;
        question.questions.map((i, index) => {
            //console.log("i.question: " + i.question); //display question
            dialogContentTemp.push(<h1>{index + 1}. {i.question}</h1>);
            if (answers[index] instanceof Object){
                let j = Object.values(answers[index]);
                let test = Object.entries(answers[index]);
                console.log("test: "+test)
                dialogContentTemp.push(<p>{j}</p>);
                //console.log("answer j" + index + ": " + j); //display answer (array type)
            }else{
                dialogContentTemp.push(<p>{answers[index]}</p>);
            }
            if ((index + 1 ) % 2 === 0){
                if (pages.length > 0){
                    dialogContentTemp.push(<button onClick={() => switchPages("prev")}>Previous</button>);
                }
                if (answers.length !== index + 1){
                    dialogContentTemp.push(<button onClick={() => switchPages("next")}>Next</button>);
                }
                pages.push({
                    'index': pageIndex,
                    'content': dialogContentTemp
                });
                ++pageIndex;
                dialogContentTemp = [];
            }
        })
        if (dialogContentTemp.length > 0){
            if (pages.length > 0){
                dialogContentTemp.push(<button onClick={() => switchPages("prev")}>Previous</button>);
            }
            pages.push({
                'index': pageIndex,
                'content': dialogContentTemp
            });
        }
        setDialogContent(pages[0].content);
      }

      // UI
      function switchPages(action) {
        if (action === "prev") {
            currentPageIndex--;
            setDialogContent(pages[currentPageIndex].content);
        } else {
            currentPageIndex++;
            setDialogContent(pages[currentPageIndex].content);
        }
      }

      // UI
      function setButton(answers, teacherID, answerID, isSubmmited) {
        if (isSubmmited === false){
            return <button type='button' onClick={e => sendNotification(teacherID, answerID)}>Send Reminder</button>;
        } else{
            return <button type='button' onClick={e => viewSubmission(answers)}>View Submission</button>;
        }
      }

      // UI
      function timeline(question, answer) {
        const totalItems = question.questions.length;
        const numberOfActiveItems = answer.answers.length;
        const progressBarWidth = totalItems > 0 ? (numberOfActiveItems) / (totalItems) * 100 : 1;

        let arr = [];
        question.questions.map((item) => (
            arr.push(item)
        ));
        arr.push(1);
        
        return (
            <>
            <p>Progress: {progressBarWidth}%</p>
            <div className="timeline">
                <div className="timeline-progress" style={{ width: `${progressBarWidth}%`}}></div>
                <div className="timeline-items">
                    {arr.map((item, i) => (
                        <div key={i} className={"timeline-item" + (numberOfActiveItems >= i ? ' active' : '')}>
                        </div>
                    ))}
                </div>
            </div>
            </>
        )
      }

      // UI
      function filterPageResults(condition){
        let returnAll = <>
        <h2>Survey Statistics</h2>
        <p>Teacher's profiling task filling progress</p>
        {teachersID.map((id, index) => (
            renderTeachers(id, index, condition)
        )) 
        }</>
        if (!ReactDOMServer.renderToString(returnAll).includes("timeline-progress", 0)){
            returnAll = <h2>There is nothing here!</h2>
        }
        setContent(returnAll);
      }

      // UI
      function initializePage(){
        if (content === "inital"){
            filterPageResults("all");
        }
      }
    return (
        loading ? 
        <p>Loading..</p>
        :
        <div>
            {initializePage()}
            <button onClick={() => filterPageResults("all")}>All</button>
            <button onClick={() => filterPageResults("submitted")}>Submitted</button>
            <button onClick={() => filterPageResults("unsubmitted")}>Unsubmitted</button>
            {content}
            <Dialog isOpen={dialog} onClose={() => {
                setDialog(false);
            }}>{dialogContent}</Dialog>
        </div>
    )
}
export default OfficerSurveyStats;