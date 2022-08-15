/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-plusplus */
/* eslint-disable react/button-has-type */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-filename-extension */
// put survey stats here
import React, { useState, useEffect } from 'react';
import app, { func } from '../../../utils/firebase';
import { useLocation } from 'react-router-dom';
import 'firebase/compat/app-check';
import './surveyStats.css';
import ReactDOMServer from 'react-dom/server';
import { Dialog } from '@blueprintjs/core';
import { CommonLoading } from 'react-loadingg';
// using node-style package resolution in a CSS file:
// import "normalize.css";
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

function OfficerSurveyStats() {
  const { state } = useLocation();
  const { question } = state; // Read values passed on state
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teachersID, setTeachersID] = useState([]);
  const [content, setContent] = useState('inital');
  const [dialog, setDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState([]);
  let pages = [];
  let currentPageIndex = 0;
  let index = 1;
  let moreIndex = 0;

  useEffect(() => {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const getAnswers = func.httpsCallable('officer-getAllCreatedSurveys_Answers');
    try {
      const response = getAnswers({
        questionID: question.id,
      })
        .then((i) => {
          const newArr = [...i.data];
          let index = 0;
          newArr.map((o) => {
            if (newArr.length - 1 === index) {
              getTeacher(o.teacherID, true);
            } else {
              getTeacher(o.teacherID, false);
            }
            ++index;
          });
          setAnswers(newArr);
        })
        .catch((e) => {
          // console.log(e);
        });
    } catch (e) {
      // console.error(e);
    }
  }, []);

  async function getTeacher(teacherID, boolean) {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const getInfo = func.httpsCallable('officer-getTeacher');
    try {
      const response = await getInfo({
        teacherID,
      })
        .then((i) => {
          if (!teachersID.includes(teacherID)) {
            teachersID.push(teacherID);
            const newObj = {
              ...i.data,
              teacherID,
            };
            teachers.push(newObj);
          }
          if (boolean === true) {
            setLoading(false);
          }
        })
        .catch((e) => {
          // console.log(e);
        });
    } catch (e) {
      // console.error(e);
    }
  }

  // UI
  function renderTeachers(id, condition) {
    let teacher = '';
    teachers.map((o) => {
      if (o.teacherID === id) {
        teacher = o;
      }
    });

    if (condition === 'all') {
      return (
        <div key={"all:"+index+"v:"+moreIndex}>
            {answers.map(
              (
                o// list out all answer copies from the teacher
              ) => renderAnswers(o, teacher, index), moreIndex++
            )}
        </div>
      );
    }
    if (condition === 'submitted') {
      const filteredArr = [];
      let content = 'There is none here!';
      answers.map((o) => {
        if (o.isSubmitted === true) {
          filteredArr.push(o);
        }
      });
      if (filteredArr.length > 0) {
        content = (
          <div key={"submitted:"+index+"v:"+moreIndex}>
              {filteredArr.map(
                (
                  o,
                  index, // list out all completed answer copies from the teacher
                ) => renderAnswers(o, teacher, index), moreIndex++
              )}
          </div>
        );
      }
      return content;
    }
    if (condition === 'unsubmitted') {
      const filteredArr = [];
      let content = 'There is none here!';
      answers.map((o) => {
        if (o.isSubmitted === false) {
          filteredArr.push(o);
        }
      });
      if (filteredArr.length > 0) {
        content = (
          <div key={"unsubmitted:" + index+"v:"+moreIndex}>
              {filteredArr.map(
                (
                  o,
                  index, // list out all completed answer copies from the teacher
                ) => renderAnswers(o, teacher, index), moreIndex++
              )}
          </div>
        );
      }
      return content;
    }
  }

  // UI
  function renderAnswers(o, t) {
    if (o.teacherID === t.teacherID) {
      return (
        <div className="summary-view">
          <h4>
            {index++}
            .
            {t.firstName}
            {' '}
            {t.lastName}
          </h4>
          <div key={index + t.firstName}>
            <div>
              <h4>
                Total questions:
                {question.questions.length}
              </h4>
              <h4>
                Total answered questions:
                {o.answers.length}
              </h4>
              <h4>
                Submitted?
                {o.isSubmitted ? 'Yes' : 'No'}
              </h4>
              {timeline(question, o)}
              {setButton(o.answers, o.teacherID, o.id, o.isSubmitted)}
            </div>
          </div>
        </div>
      );
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
        teacherID,
        answerID,
        expiryDate: expiry,
      })
        .then((i) => {
          if (i.data === 'doc exists') {
            // alert('You have recently notified the teacher about this already.');
          } else {
            // alert(`Successfully sent notification to ${teacherID}`);
          }
        })
        .catch((e) => {
          // console.log(e);
        });
    } catch (e) {
      // console.error(e);
    }
  }

  // view submission
  async function viewSubmission(answers) {
    //
    setDialog(true);
    setDialogContent([]);
    pages = [];
    let dialogContentTemp = [];
    currentPageIndex = 0;
    let pageIndex = 1;
    question.questions.map((i, index) => {
      // console.log("i.question: " + i.question); //display question
      dialogContentTemp.push(
        <h1>
          {index + 1}
          .
          {i.question}
        </h1>,
      );
      if (answers[index] instanceof Object) {
        const j = Object.values(answers[index]);
        dialogContentTemp.push(<p>{j}</p>);
        //console.log("answer: " + j); //display answer (array type)
      } else {
        dialogContentTemp.push(<p>{answers[index]}</p>);
        //console.log("answer: " + answers[index]); //display answer (not array type)
      }
      if ((index + 1) % 2 === 0) {
        if (pages.length > 0) {
          dialogContentTemp.push(<button onClick={() => switchPages('prev')}>Previous</button>);
        }
        if (answers.length !== index + 1) {
          dialogContentTemp.push(<button onClick={() => switchPages('next')}>Next</button>);
        }
        pages.push({
          index: pageIndex,
          content: dialogContentTemp,
        });
        ++pageIndex;
        dialogContentTemp = [];
      }
    });
    if (dialogContentTemp.length > 0) {
      if (pages.length > 0) {
        dialogContentTemp.push(<button onClick={() => switchPages('prev')}>Previous</button>);
      }
      pages.push({
        index: pageIndex,
        content: dialogContentTemp,
      });
    }
    setDialogContent(pages[0].content);
  }

  // UI
  function switchPages(action) {
    if (action === 'prev') {
      currentPageIndex--;
      setDialogContent(pages[currentPageIndex].content);
    } else {
      currentPageIndex++;
      setDialogContent(pages[currentPageIndex].content);
    }
  }

  // UI
  function setButton(answers, teacherID, answerID, isSubmmited) {
    if (isSubmmited === false) {
      return (
        <button type="button" onClick={(e) => sendNotification(teacherID, answerID)}>
          Send Reminder
        </button>
      );
    }
    return (
      <button type="button" onClick={(e) => viewSubmission(answers)}>
        View Submission
      </button>
    );
  }

  // UI
  function timeline(question, answer) {
    const totalItems = question.questions.length;
    const numberOfActiveItems = answer.answers.length;
    const progressBarWidth = totalItems > 0 ? (numberOfActiveItems / totalItems) * 100 : 1;

    const arr = [];
    question.questions.map((item) => arr.push(item));
    arr.push(1);

    return (
      <>
        <p>
          Progress:
          {progressBarWidth}
          %
        </p>
        <div className="timeline">
          <div className="timeline-progress" style={{ width: `${progressBarWidth}%` }} />
          <div className="timeline-items">
            {arr.map((item, i) => (
              <div
                key={i}
                className={`timeline-item${numberOfActiveItems >= i ? ' active' : ''}`}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  // UI
  function filterPageResults(condition) {
    index = 1;
    let returnAll = (
      <>
        {teachersID
        .map((id) => renderTeachers(id, condition))}
      </>
    );
    if (!ReactDOMServer.renderToString(returnAll).includes('timeline-progress', 0)) {
      returnAll = <h2>There is nothing here!</h2>;
    }
    setContent(returnAll);
  }

  // UI
  function initializePage() {
    if (content === 'inital') {
      filterPageResults('all');
    }
  }
  return loading ? (
    <div>
      <CommonLoading color='#fff' />
    </div>
  ) : (
    <div>
      {initializePage()}
      <div style={{paddingLeft:'10px'}}>
      <h2>Survey Statistics</h2>
      <p>Teacher's profiling task filling progress</p>

      <label>
        Filter by &nbsp;
      </label>
      <select
      onChange={e => 
        {
          filterPageResults(e.target.value);
          console.log(e.target.value)
        }}
      >
        <option value="all">All</option>
        <option value="submitted">Submitted</option>
        <option value="unsubmitted">Unsubmitted</option>

      </select>
      </div>

      {content}
      <Dialog
        className="dialog"
        title="Submission"
        isOpen={dialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <div style={{ padding: '15px' }}>{dialogContent}</div>
      </Dialog>
    </div>
  );
}
export default OfficerSurveyStats;
