//put survey stats here
import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './taskSummary.css';
import ReactDOMServer from 'react-dom/server';
import { PieChart, Pie, Tooltip, Sector } from 'recharts';
import { serverTimestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';

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
        navigate('/survey-status', { state: { question: question } });
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


                <div className='task-questions'>
                    <div className='select-display-questions'>
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

                        <div>
                            <button style={{ marginLeft: "auto" }} onClick={() => clickButton()}>View Individual Progress</button>

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
                    <p>Scheduled date: {createdDate.getFullYear() + '-' + (createdDate.getMonth() + 1) + '-' + createdDate.getDate()}</p>
                    <p>Total sent out: {question.total}</p>
                    <p>Received: {question.complete}</p>
                </div>
            </div>
        </div>;
    }
}
export default TaskSummary;


