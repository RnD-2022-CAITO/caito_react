//put survey distribution process here
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
                //console.log(newArr);
                let index = 0;
                newArr.map(o => {
                    //console.log("(newArr.length-1): " + (newArr.length-1));
                    //console.log("index: " + index);
                    if ((newArr.length-1) === index){
                        getTeacher(o.teacherID, true);
                    } else{
                        getTeacher(o.teacherID, false);
                    }
                    ++index;
                })
                setAnswers(newArr);
                //setLoading(false);
                //setLoading(false);
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
                //console.log(i.data);
                if (!teachersID.includes(teacherID)){
                    //console.log("!teachersID.includes(teacherID): " + !teachersID.includes(teacherID));
                    teachersID.push(teacherID);
                    const newObj = {
                        ...i.data,
                        teacherID: teacherID,
                      }
                    teachers.push(newObj);
                    //setTeachers(oldArr => ([...oldArr, i.data]));
                    //setLoading(false);
                }
                if (boolean === true){
                    //console.log("reached");
                    setLoading(false);
                }
              }).catch(e => {
                console.log(e);
              });
        } catch (e) {
            console.error(e);
        }
      }

      function renderTeachers(id, index) {
        //console.log("teachers: " + teachers);
        //console.log("teachersID: " + teachersID);
        //getTeacher(answer.teacherID);
        let teacher = "";
        teachers.map(o => {
            console.log(o);
            if (o.teacherID === id){
                teacher = o;
            }
        })
        return <div key={index}>
          <div className='summary-view'>
            <h4>{index + 1}. {teacher.firstName} {teacher.lastName}</h4>
            {answers.map((o, index) => ( //list out all answer copies from the teacher
                renderAnswers(o, teacher, index)
                //console.log("o: " + o.answers)
            ))}
          </div>
        </div>;
      }

      function renderAnswers(o, t, index) {
        //console.log("teachers: " + teachers);
        //console.log("teachersID: " + teachersID);
        //getTeacher(answer.teacherID);
        console.log(o.answers);
        let newArray = [];
        newArray.push(o.answers);
        newArray.forEach((i) => {
        if (i.length === undefined){
            newArray = Object.keys(i).map((key) => i[key]);
        }
        });
        if (o.teacherID === t.teacherID){
            return <div key={index+t}>
            <div>
                <h4>{newArray.length} TODO adjust this part</h4> 
                </div>
            </div>;
        }
      }

    return (
        loading ? 
        <p>Loading..</p>
        :
        <div>
            <p>OfficerSurveyStats</p>
            {teachersID.map((id, index) => (
                renderTeachers(id, index)))
            }
        </div>
    )
}
export default OfficerSurveyStats;