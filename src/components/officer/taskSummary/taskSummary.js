//put survey stats here
import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './taskSummary.css';
import ReactDOMServer from 'react-dom/server';
import { PieChart, Pie, Tooltip, Sector } from 'recharts';
import {serverTimestamp} from 'firebase/firestore'
const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';
const TaskSummary = () => {
    const { state } = useLocation();
    const { question } = state; // Read values passed on state
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [teachersID, setTeachersID] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [createdDate, setCreatedDate] = useState([]);

    const [isFound, setFound] = useState(true);
    const [surveyTitle, setTitle] = useState('');

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
                    if ((newArr.length - 1) === index) {
                        getTeacher(o.teacherID, true);
                    } else {
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

    useEffect(() => {
        const retrieveSurvey = async () => {
            app.appCheck().activate(site_key, true);
            const getSurvey = func.httpsCallable('teacher-getAssignedSurvey_Questions');
            try {
                const response = await getSurvey({
                    questionID: question.id,

                });

                if (response.data == null) {
                    setFound(false);
                } else {
                    console.log(response.data.questions);
                    console.log(response.data.questions[0].options);
                    //console.log(response.data.createdDate.toDate().toString());

                    setTitle(response.data.title);
                    setQuestions(response.data.questions);
                    setAnswers(response.data.questions);
                    

                }

            } catch (e) {
                console.error(e);
            }
        }

        retrieveSurvey();
    }, []);

    async function getTeacher(teacherID, boolean) {
        app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
        const getInfo = func.httpsCallable('officer-getTeacher');
        try {
            const response = await getInfo({
                teacherID: teacherID,
            }).then((i) => {
                if (!teachersID.includes(teacherID)) {
                    teachersID.push(teacherID);
                    const newObj = {
                        ...i.data,
                        teacherID: teacherID,
                    }
                    teachers.push(newObj);
                }
                if (boolean === true) {
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
            if (o.teacherID === id) {
                teacher = o;
            }
        })
        if (condition === "unsubmitted") {
            let filteredArr = [];
            let content = "All submitted";
            answers.map((o) => {
                if (o.isSubmitted === false) {
                    filteredArr.push(o);
                }
            });
            if (filteredArr.length > 0) {
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
    const [activeIndex, setActiveIndex] = useState(0);
    const renderText = (props) => {
        const { cx, cy, endAngle, fill } = props;
        return (
            <g>
                <text x={cx} y={cy} dy={8} textAnchor="middle" >
                    {question.complete / question.total * 100 + " %"}
                </text>
                <Sector>endAngle={endAngle}
                    fill={fill}
                </Sector>

            </g>

        )
    }


    // UI
    function renderAnswers(o, t, index) {
        if (o.teacherID === t.teacherID) {
            return <div key={index + t}>
                <div>
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
                if (i.data === "doc exists") {
                    alert("You have recently notified the teacher about this already.");
                } else {
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
        if (isSubmmited === false) {
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
                    <div className="timeline-progress" style={{ width: `${progressBarWidth}%` }}></div>
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

    return (
        loading ?
            <p>Loading..</p>
            :
            <div className='grid-layout'>
                <div className='select-display'>
                    <h3>Task summary</h3>
                    <div style={{ textAlign: 'left' }}>
                        <h4 >Description</h4>
                        <p>Coming soon...</p>
                        <h4>Target groups</h4>
                        <p>Coming soon...</p>

                    </div>
                </div>
                <div className='select-display'>
                    <h3>Completion rate</h3>
                    <div style={{ textAlign: 'center' }}>
                        {renderQuestion(question)}

                    </div>
                </div>

                <div className='select-display'>
                    <h3>Task Questions</h3>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ textAlign: 'left' }}>

                            {questions.map((q, index) =>
                                <div className='sur-question' key={index}>
                                    <label>Question {index + 1}. {q.question}</label>
                                    <br />
                                    <br />
                                    {q.options.map((o) =>
                                        <div>
                                            <p for={o}>{o}</p>
                                        </div>


                                    )}

                                </div>)
                            }
                        </div>


                    </div>

                </div>


            </div>
    )

    function renderQuestion(question) {
        const complete = question.complete;
        const total = question.total;
        const uncomplete = total - complete;


        const data = [
            { name: 'Uncomplete', value: uncomplete },
            { name: 'Complete', value: complete }
        ];
        return <div key={question.id}>
            <div className='summary-view'>

                <PieChart width={300} height={300} style={{ textAlign: 'left' }}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderText}
                        dataKey="value"
                        data={data}
                        cx={100}
                        cy={200}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                    />
                    <Tooltip />
                </PieChart>
                <div style={{ textAlign: 'right' }}>
                    <p>Scheduled date: {123}</p>
                    <p>Total sent out: {question.total}</p>
                    <p>Received: {question.complete}</p>
                </div>

            </div>
        </div>;
    }


}
export default TaskSummary;


