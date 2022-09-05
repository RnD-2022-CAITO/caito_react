import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import 'firebase/compat/app-check';
import { db } from '../../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import "./TaskOverview.css"
import { Button, Classes, Icon } from '@blueprintjs/core'
import { Pagination } from '../../teacher/landing/Pagination';
const TaskOverview = () => {

    const navigate = useNavigate();
    const [questionID, setQuestionID] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
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

    const renderGroups = () => {
        return groups.map(group => {
            return (
                <Button
                    style={{ margin: '10px' }} key={group.id}

                >{group.name}
                </Button>


            )
        })
    }

    useEffect(() => {
        const retrieveGroups = async () => {
            const getGroups = func.httpsCallable('group-findGroups');
            try {
                const res = await getGroups();
                setGroups(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        retrieveGroups();
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

    const clickButtonSchedule = (question) => {
        navigate('/survey-distribution', { state: { question: question } });
    }



    const navigateCreateSurvey = () => {
        navigate('/survey-making');
    }
  
    const [currentPage, setCurrentPage] = useState(1);
    const [taskPerPage] = useState(5);
    
    const indexOfLastTask = currentPage * taskPerPage;
    const indexOfFirstTask = indexOfLastTask - taskPerPage;
  
    const renderQuestions = questionID
    .slice(indexOfFirstTask, indexOfLastTask).map((question) => (
      scheduledTask(question, clickButton)
    ));
 
    return (
        <>
            <h1>Your Profiling tasks</h1>
            <button onClick={() => navigateCreateSurvey()}>CREATE NEW PROFILING TASK</button>


            <div className='grid-layout'>

                <div className='select-display-s'>
                    <h3>Target groups</h3>
                    <div style={{ textAlign: 'center' }} >
                        {renderGroups()}
                    </div>
                </div>



                <div className='scheduled-tasks'>
                    <div className='select-display-s' >
                        <h3>Scheduled tasks summary</h3>
                        <div style={{ textAlign: 'left' }}>
                        <Pagination 
            taskPerPage={taskPerPage} 
            totalTasks={questionID.length} 
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
        />
                            {scheduledTask}
                        </div>
                    </div>
                </div>

                <div className='select-display-s'>
                    <h3>Unscheduled tasks</h3>
                    <div style={{ textAlign: 'left' }}>
                        {questionID.map(question => (
                            unscheduledTask(question, clickButtonSchedule)
                        ))}
                    </div>
                </div>
            </div>
        </>
    )

}

export default TaskOverview

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
function unscheduledTask(question, clickButtonSchedule) {
    if (question.total == 0) {
        return <div key={question.id}>
            <div className='summary-view'>
                <h4>{question.title}</h4>
                <p>Question ID: {question.id}</p>
                <p>----------------------------------------------------------------</p>
                <p>Total sent out: {question.total}</p>
                <p>Completion rate: {question.total !== 0 ? question.complete / question.total * 100 + " %" : "You haven't distribute this survey yet"}</p>
                <button className='summary-btn' style={{ marginRight: "auto" }} onClick={() => clickButtonSchedule(question)}>Schedule</button>
            </div>
        </div>;
    }

}

