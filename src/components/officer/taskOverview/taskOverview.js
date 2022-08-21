import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import 'firebase/compat/app-check';
import { db } from '../../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import "./taskOverview.css"

const OfficerTaskOverview = () => {

    const navigate = useNavigate();
    const [questionID, setQuestionID] = useState([]);
    const [loading, setLoading] = useState(true);

    //Get surveys
    useEffect(() => {
        const retrieveQuestionID = async () => {
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
    }, []);

    //Get surveys
    useEffect(() => {
        const retrieveAnswers = async () => {
            if (questionID.length >= 1) {
                const newArr = await Promise.all(questionID.map(async (question) => {
                    var total = 0;
                    var complete = 0;
                    const res = await db.collection('survey-answer').where('questionID', '==', question.id).get()
                        .then((res) => {
                            res.docs.map(doc => {
                                // console.log(doc.data());
                                total += 1;
                                if (doc.data().isSubmitted) {
                                    complete += 1;
                                }
                                return {
                                    ...doc,
                                    total: total,
                                    complete: complete
                                }
                            });

                            return ({ total: total, complete: complete });
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

    }, [questionID]);

    const clickButton = (question) => {
        navigate('/task-summary', { state: { question: question } });
    }


    const navigateCreateSurvey = () => {
        navigate('/survey-making');
    }

    return (
        <>
            <h1>Your Profiling tasks</h1>
            <button onClick={() => navigateCreateSurvey()}>CREATE NEW PROFILING TASK</button>


   
            <div className='target-groups'>
<div className='select-display'>
                    <h3>Target groups</h3>
                    <div style={{ textAlign: 'center' }}>
                        <p>Still developing...</p>
                        <button onClick={1}>Still in developing</button>
                    </div>
                </div>

            </div>
                <div className='unscheduled-tasks'>
                    <div className='select-display'>
                    <h3>Unscheduled tasks</h3>
                    <div style={{ textAlign: 'left' }}>
                        {questionID.map(question => (
                            unscheduledTask(question, clickButton)
                        ))}
                    </div>
                </div>
                </div>
                

                
                <div className='scheduled-tasks'>
                     <div className='select-display' >
                    <h3>Scheduled tasks summary</h3>
                    <div style={{ textAlign: 'left' }}>
                        {questionID.map(question => (
                            scheduledTask(question, clickButton)
                        ))}
                    </div>
                </div>
                </div>
               
      
        </>
    )

}

export default OfficerTaskOverview

function scheduledTask(question, clickButton) {
    if (question.total != 0) {
        return <div key={question.id}>
            <div className='summary-view'>
                <h4>{question.title}</h4>
                <p>Question ID: {question.id}</p>
                <p>----------------------------------------------------------------</p>
                <p>Total sent out: {question.total}</p>
                <p>Completion rate: {question.total !== 0 ? question.complete / question.total * 100 + " %" : "You haven't distribute this survey yet"}</p>
                <button className='summary-btn' style={{ marginRight: "auto" }} onClick={() => clickButton(question)}>Details</button>
            </div>
        </div>;
    }

}
function unscheduledTask(question, clickButton) {
    if (question.total == 0) {
        return <div key={question.id}>
            <div className='summary-view'>
                <h4>{question.title}</h4>
                <p>Question ID: {question.id}</p>
                <p>----------------------------------------------------------------</p>
                <p>Total sent out: {question.total}</p>
                <p>Completion rate: {question.total !== 0 ? question.complete / question.total * 100 + " %" : "You haven't distribute this survey yet"}</p>
                <button className='summary-btn' style={{ marginRight: "auto" }} onClick={() => clickButton(question)}>Schedule</button>
            </div>
        </div>;
    }

}