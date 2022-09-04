//put survey stats here
import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './TaskSummary.css';
import ReactDOMServer from 'react-dom/server';
import { PieChart, Pie, Tooltip, Sector } from 'recharts';
import { serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { CommonLoading } from 'react-loadingg';
import { Divider } from '@blueprintjs/core';

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';
const TaskSummary = () => {
    const navigate = useNavigate();
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
                    console.log(response.data.createdDate);
                    setCreatedDate(new Date());
                    console.log(response.data.questions);
                    console.log(response.data.questions[0].options);
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


    const clickButton = (question) => {
        navigate(`/survey-stats/${question.id}`, { state: { question: question } });
        console.log(question);
    }




    return (
        loading ?
            <CommonLoading color='#323547'/>
            :
            <div className='main-wrapper'>
            <h1 style={{textAlign:'center'}}>Summary for <strong> {question.title} </strong></h1>
            <Divider />

            <div style={{textAlign:'center', padding:'15px 0'}}>
            <button style={{ marginLeft: "auto" }} onClick={() => clickButton(question)}>View Teacher's Individual Progress</button>
            </div>

            <div className='grid-layout'>
                <div className='select-display-s'>
                    <h3>Task summary</h3>
                    <div style={{ textAlign: 'left' }}>
                        <h4 >Description</h4>
                        <p>Coming soon...</p>
                        <h4>Target groups</h4>
                        <p>Coming soon...</p>

                    </div>


                </div>


                <div className='select-display-s'>
                    <h3>Completion rate</h3>
                    <div style={{ textAlign: 'center' }}>
                        {renderQuestion(question)}
                    </div>
                </div>

                <div className='task-questions'>
                    <div className='select-display-s'>
                        <div className='select-display-question'>
                            <h3>Task Questions</h3>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ textAlign: 'left' }}>
                                    {questions.map((q, index) =>
                                        <div className='question-display' key={index}>
                                            <label><strong>Question {index + 1}.</strong>  {q.question}</label>
                                            <br />
                                            <br />
                                            {q.options.length>0 &&
                                            <>
                                            <p><strong>Answer Options</strong></p>
                                            {q.options.map((o) =>
                                                <div>
                                                    <p for={o}>{o}</p>
                                                </div>
                                            )}
                                            </>}
                                        <Divider />
                                        </div>)
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                </div>

            </div>
    )


    function renderQuestion(question) {
        const complete = question.complete;
        const total = question.total;
        const uncomplete = total - complete;
        // createdDate.setDate(createdDate.getDate());
        //  createdDate=createdDate.toLocaleDateString('sv', { timeZone: 'Pacific/Auckland' });
        const data = [
            { name: 'Uncomplete', value: uncomplete },
            { name: 'Complete', value: complete }
        ];
        return <div key={question.id}>
            <div>

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
                        fill={"var(--caito-blue)"}
                    />
                    <Tooltip />
                </PieChart>
                <div style={{ textAlign: 'right' }}>
                    <p>Scheduled date: {createdDate.getFullYear() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getDate()}</p>
                    <p>Total sent out: {question.total}</p>
                    <p>Received: {question.complete}</p>
                </div>
            </div>
        </div>;
    }
}
export default TaskSummary;


