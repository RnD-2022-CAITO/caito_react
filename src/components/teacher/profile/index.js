import React, { useState, useEffect } from "react";
import { useUserData } from "../../global/auth/UserData";
import { useAuth } from "../../global/auth/Authentication";
import { useNavigate } from "react-router-dom";
import "firebase/compat/app-check";
import { Pagination } from "../landing/Pagination";
import { Button, Classes } from "@blueprintjs/core";
import { Footer } from "../../global/Footer";
import app, { func } from "../../../utils/firebase";
import { CommonLoading } from "react-loadingg";

import "./Profile.css";

const TeacherProfile = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [upcomingSurvey, setUpcomingSurvey] = useState([]);

  //get the surveys when assigned
  useEffect(() => {
    const retrieveSurvey = async () => {
      app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
      const getSurvey = func.httpsCallable(
        "teacher-getAllAssignedSurveys_Answers"
      );
      try {
        const response = await getSurvey();
        const doneSurvey = response.data.filter((survey) => {
          return survey.isSubmitted === true;
        });
        setUpcomingSurvey(doneSurvey);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    retrieveSurvey();
  }, []);

  //open the survey
  const openSurvey = (e) => {
    //Pass the question ID to the next path
    navigate(`/saved/${e.target.id}`, {
      state: {
        questionID: e.target.id,
      },
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [taskPerPage] = useState(5);

  const indexOfLastTask = currentPage * taskPerPage;
  const indexOfFirstTask = indexOfLastTask - taskPerPage;

  const nextClick = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevClick = () => setCurrentPage(currentPage - 1);

  const currentTask = upcomingSurvey
    .slice(indexOfFirstTask, indexOfLastTask)
    .map(
      (sur, index) =>
        sur.isSubmitted === true && (
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

  return (
    <>
      {loading ? (
        <CommonLoading color="#323547" />
      ) : (
        <div className="profile-wrapper">
          <div className="profile-container">
            <div className="profile-item profile">
              <div style={{ textAlign: "center" }}>
                <img
                  className="profile-image"
                  src="https://freerangestock.com/sample/120140/business-man-profile-vector.jpg"
                  alt="profile pic"
                />
              </div>
              <h2>
                {userData && userData.firstName + " " + userData.lastName}
              </h2>
              <h3>
                <Button icon="envelope" className={Classes.MINIMAL}></Button>
                {currentUser.email}
              </h3>
              <br></br>
              <hr></hr>
              <br></br>
              <button onClick={() => navigate("/edit-password")}>
                Change password
              </button>
            </div>

            <div className="profile-item profile-actions">
              <h3>Role</h3>
              <div className="profile-section">
                <p>Teacher</p>
              </div>
              <h3>Personal information</h3>
              <div className="profile-section">
                <p>This section stores basic information from the user</p>
                <p>Under development...</p>
              </div>
              <h3>Your profiling tasks</h3>
              <div className="profile-section">
                <div className="survey-box">
                  {
                    //Render surveys
                    currentTask
                  }
                  {currentTask.length > 0 ? (
                    <Pagination
                      taskPerPage={taskPerPage}
                      totalTasks={upcomingSurvey.length}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                      nextClick={nextClick}
                      prevClick={prevClick}
                    />
                  ) : (
                    <p>You have not completed any tasks yet! </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};
export default TeacherProfile;
