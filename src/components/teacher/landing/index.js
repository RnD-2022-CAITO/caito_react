//Main page for the components
import React, { useEffect, useState } from "react";
import { useUserData } from "../../global/auth/UserData";
import app, { func } from "../../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { CommonLoading } from "react-loadingg";
import { Pagination } from "./Pagination";

import "./teacherLanding.css";
import { Footer } from "../../global/Footer";

// const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const TeacherLanding = () => {
  const { userData } = useUserData();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [upcomingSurvey, setUpcomingSurvey] = useState([]);

  const [totalSurvey, setTotalSurvey] = useState(0);

  //Get surveys
  useEffect(() => {
    const retrieveSurvey = async () => {
      app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
      const getSurvey = func.httpsCallable(
        "teacher-getAllAssignedSurveys_Answers"
      );
      try {
        const response = await getSurvey();

        const undoneSurvey = response.data.filter((survey) => {
          return survey.isSubmitted === false;
        });

        setUpcomingSurvey(undoneSurvey);

        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    retrieveSurvey();
  }, []);

  //Display the total new surveys
  useEffect(() => {
    const setTotalDisplay = () => {
      var count = 0;

      for (var k = 0; k < upcomingSurvey.length; k++) {
        if (upcomingSurvey[k].isSubmitted === false) {
          count++;
        }

        setTotalSurvey(count);
      }
    };

    setTotalDisplay();
  }, [upcomingSurvey]);

  const openSurvey = (e) => {
    // alert('Redirect user to question ID: ' + e.target.id);

    //Pass the question ID to the next path
    navigate(`/survey/${e.target.id}`, {
      state: {
        questionID: e.target.id,
      },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [taskPerPage] = useState(5);

  const indexOfLastTask = currentPage * taskPerPage;
  const indexOfFirstTask = indexOfLastTask - taskPerPage;

  const currentTask = upcomingSurvey
    .slice(indexOfFirstTask, indexOfLastTask)
    .map(
      (sur, index) =>
        sur.isSubmitted === false && (
          <section className="new-survey" key={index}>
            <h3>{sur.questionTitle}</h3>
            <button
              id={sur.questionID}
              className="view-survey-btn"
              onClick={openSurvey}
            >
              View Survey
            </button>
          </section>
        )
    );

  const renderSurveys = () => (
    <div className="survey-display">
      <div>
        <h2 style={{ textAlign: "center" }}>Kia Ora, {userData.firstName}</h2>
        <h2 style={{ textAlign: "center" }}>
          You have <span className="new-sur">{totalSurvey}</span> new
          {totalSurvey < 1 ? <span> survey</span> : <span> surveys</span>}
        </h2>
      </div>

      <div className="survey-box">
        {
          //Render surveys
          currentTask
        }
        <Pagination
          taskPerPage={taskPerPage}
          totalTasks={upcomingSurvey.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );

  return (
    <div>
      {loading ? (
        <div>
          <CommonLoading color="#323547" />
        </div>
      ) : (
        <>
          {renderSurveys()}
          <Footer />
        </>
      )}
    </div>
  );
};

export default TeacherLanding;
