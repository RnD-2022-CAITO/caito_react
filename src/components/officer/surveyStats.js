//put survey stats here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './surveyStats.css';

const OfficerSurveyStats = () => {
    const {state} = useLocation();
    const {question} = state; // Read values passed on state
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teachersID, setTeachersID] = useState([]);

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
      function renderTeachers(id, index) {
        let teacher = "";
        teachers.map(o => {
            if (o.teacherID === id){
                teacher = o;
            }
        })
        return <div key={index}>
          <div className='summary-view'>
            <h4>{index + 1}. {teacher.firstName} {teacher.lastName}</h4>
            {answers.map((o, index) => ( //list out all answer copies from the teacher
                renderAnswers(o, teacher, index)
            ))}
          </div>
        </div>;
      }

      // UI
      function renderAnswers(o, t, index) {
        let newArray = [];
        newArray.push(o.answers);
        if (o.teacherID === t.teacherID){
            return <div key={index+t}>
                <div>
                    <h4>question.questions.length: {question.questions.length}</h4> 
                    <h4>o.answers.length: {o.answers.length}</h4> 
                    {timeline(question, o)}
                </div>
                
            </div>;
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
            <div className="timeline">
                <div className="timeline-progress" style={{ width: `${progressBarWidth}%`}}></div>
                <div className="timeline-items">
                    {arr.map((item, i) => (
                        <div key={i} className={"timeline-item" + (numberOfActiveItems >= i ? ' active' : '')}>
                        </div>
                    ))}
                </div>
            </div>
        )
      }

    return (
        loading ? 
        <p>Loading..</p>
        :
        <div>
            <p>OfficerSurveyStats. Note that each teacher may have multiple copies. Will distinguish that in future user stories.</p>
            {teachersID.map((id, index) => (
                renderTeachers(id, index))) 
            }
        </div>
    )
}
export default OfficerSurveyStats;