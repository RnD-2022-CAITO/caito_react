//put survey stats here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './surveyStats.css';
import ReactDOMServer from 'react-dom/server';

const OfficerTaskSummary = () => {
    const {state} = useLocation();
    const {question} = state; // Read values passed on state
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teachersID, setTeachersID] = useState([]);
    const [content, setContent] = useState("inital");

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
                    {sendNotificationButton(o.teacherID, o.id, o.isSubmitted)}
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

      // UI
      function sendNotificationButton(teacherID, answerID, isSubmmited) {
        if (isSubmmited === false){
            return <button type='button' onClick={e => sendNotification(teacherID, answerID)}>Send Reminder</button>
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
        </div>
    )
}
export default OfficerTaskSummary;