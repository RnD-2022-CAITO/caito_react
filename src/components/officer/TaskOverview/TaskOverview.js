import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import 'firebase/compat/app-check';
import { db } from '../../../utils/firebase';
import { useNavigate } from 'react-router-dom';
import "./TaskOverview.css"
import { CommonLoading } from 'react-loadingg';
import { Pagination } from '../../teacher/landing/Pagination';
import { Button, Classes, Divider, Icon } from '@blueprintjs/core';
import { Footer } from '../../global/Footer';

const TaskOverview = () => {

    const navigate = useNavigate();
    const [questionID, setQuestionID] = useState([]);
    const [loading, setLoading] = useState(true);

    const [getAnswers, setGetAnswers] = useState(false);


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

                setQuestionID(newArr);
                setGetAnswers(true);
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
    };

    //Pagination for unscheduled tasks
    const [currentPage, setCurrentPage] = useState(1);
    const [taskPerPage] = useState(5);
    
    const indexOfLastTask = currentPage * taskPerPage;
    const indexOfFirstTask = indexOfLastTask - taskPerPage;

    const [unscheduledTask, setUnscheduledTask] = useState([]);
    const [scheduledTask, setScheduledTask] = useState([]);
    const [unscheduledLength, setUnscheduledLength] = useState(0);
    const [scheduledLenght, setScheduledLength] = useState(0);


    //Get unscheduled and scheduled tasks
    useEffect(() => {
        let length = 0;
        questionID.forEach(question => {
            if (question.total === 0) {
                length++;
                setUnscheduledTask(prev => [...prev, question]);
            } else {
                setScheduledTask(prev => [...prev, question]);
            }
        })

        setUnscheduledLength(length);
        setScheduledLength(questionID.length - length);
    }, [getAnswers]);
    
    const currentTask = unscheduledTask
    .slice(indexOfFirstTask, indexOfLastTask).map((question) => {
            return <div key={question.id}>
                <div className='summary-view'>
                    <h4><strong>{question.title}</strong></h4>
                    <p>Question ID: {question.id}</p>
                    <Divider />
                    <div style={{textAlign:'right'}}>
                    <button className='summary-btn' style={{ marginRight: "auto" }} onClick={() => clickButtonSchedule(question)}>Schedule</button>
                    </div>
                </div>
            </div>;
        } 
    );

    //Pagination for scheduled tasks
    const [currentPage2, setCurrentPage2] = useState(1);
    const [taskPerPage2] = useState(5);
    const indexOfLastTask2 = currentPage2 * taskPerPage2;
    const indexOfFirstTask2 = indexOfLastTask2 - taskPerPage2;
    
    const currentTask2 = scheduledTask
    .slice(indexOfFirstTask2, indexOfLastTask2).map((question) => {
            return <div key={question.id}>
            <div className='summary-view'>
                <h4><strong>{question.title}</strong></h4>
                <p>Question ID: {question.id}</p>
                <Divider />
                <p>Total sent out: {question.total}</p>
                <p>Completion rate: {question.total !== 0 ? (question.complete / question.total * 100).toFixed(2) + " %" : "You haven't distribute this survey yet"}</p>
                <div style={{textAlign:'right'}}>
                <button className='summary-btn' style={{ marginRight: "auto" }} onClick={() => clickButton(question)}>Details</button>
                </div>
            </div>
        </div>; 
    });

    //Collapse the unschedule task
    const [isCollapsedUnschedule, setCollapsedUnschedule] = useState(false);
    const collapseUnschedule = () => {
        setCollapsedUnschedule(!isCollapsedUnschedule);
    }

    //Collapse the scheduled task
    const [isCollapsedSchedule, setCollapsedSchedule] = useState(false);
    const collapseShedule = () => {
        setCollapsedSchedule(!isCollapsedSchedule);
    }


    return (
        <>
        {loading ?         
        <CommonLoading color='#323547'/>
         :
        <>
        <div className='main-wrapper'>
            <div style={{textAlign:'center'}}>
            <h1>Your Profiling Tasks</h1>
            <Divider />
            <br/>
            <button onClick={() => navigateCreateSurvey()}>CREATE A NEW PROFILING TASK</button>
            </div>


            <div className='grid-layout'>

               
                <div className='scheduled-tasks'>
                    <div className='select-display-s' >
                        <h3>Scheduled tasks
                            <Button className={Classes.MINIMAL}  
                            icon ={<Icon icon={isCollapsedSchedule ? "caret-down" : "caret-up"} color='white'/>}
                            onClick={collapseShedule}></Button>
                        </h3>
                        {
                            !isCollapsedSchedule ?
                            <div style={{ textAlign: 'left' }}>
                            <Pagination 
                            taskPerPage={taskPerPage2} 
                            totalTasks={scheduledLenght} 
                            setCurrentPage={setCurrentPage2}
                            currentPage={currentPage2}/>
                            {currentTask2}
                            </div>:
                            <p>Click on <Icon icon="caret-down" /> to expand view</p>
                        }

                    </div>
                </div>
                
                    <div className='select-display-s'>
                        <h3>Unscheduled tasks 
                            <Button className={Classes.MINIMAL}  
                            icon ={<Icon icon={isCollapsedUnschedule ? "caret-down" : "caret-up"} color='white'/>}
                            onClick={collapseUnschedule}></Button>
                        </h3>
                        {
                            !isCollapsedUnschedule ?
                            <div style={{ textAlign: 'left' }}>
                            <Pagination 
                            taskPerPage={taskPerPage} 
                            totalTasks={unscheduledLength} 
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}/>
                            {currentTask}
                            </div> :
                            <p>Click on <Icon icon="caret-down" /> to expand view</p>
                        }
                    </div>
            </div>
            <br></br>
        </div>
        <Footer />
        </>
        }
           
          
        </>
    )

}

export default TaskOverview