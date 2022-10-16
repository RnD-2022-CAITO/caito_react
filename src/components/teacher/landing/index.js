//Main page for the components
import React, { useEffect, useState } from "react";
import { useUserData } from "../../global/auth/UserData";
import app, { func } from "../../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { CommonLoading } from "react-loadingg";
import { Pagination } from "./Pagination";
import { Footer } from "../../global/Footer";
import { motion } from "framer-motion";

import "./teacherLanding.css";

const TeacherLanding = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();

  //setup the loading
  const [loading, setLoading] = useState(true);

  //setup upcoming survey
  const [upcomingSurvey, setUpcomingSurvey] = useState([]);

  //set up all of survey
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

  // open the survey follow by id
  const openSurvey = (e) => {
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

  const nextClick = () => {
    setCurrentPage(currentPage + 1);
  };
  const prevClick = () => setCurrentPage(currentPage - 1);

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
    <div id="survey-display" className="survey-display">
      <div className="title-display">
        <h1
          style={{
            textAlign: "left",
            fontWeight: "bolder",
            letterSpacing: "-2px",
            wordSpacing: "4px",
          }}
        >
          You have...
          <br></br> <span className="new-sur">{totalSurvey}</span> new {""}
          {totalSurvey < 1 ? " survey" : " surveys"}
        </h1>
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
          nextClick={nextClick}
          prevClick={prevClick}
        />
      </div>
    </div>
  );

  const scrollToSurveys = () => {
    window.scrollTo({
      top: document.getElementById("survey-display").offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      {loading ? (
        <div>
          <CommonLoading color="#323547" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <>
            <section className="container-hero">
              <div className="hero">
                <h1>
                  Welcome,{" "}
                  <span
                    className="name-hero"
                  >
                    {userData.firstName} {userData.lastName}
                  </span>{" "}
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: "-10vh" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <p>
                    Let's help our TVET workforce planning process easier by
                    completing your profiling tasks
                  </p>
                  <button onClick={scrollToSurveys}>
                    View My New Profiling tasks
                  </button>
                </motion.div>
              </div>
            </section>
            {renderSurveys()}
          </>
          <Footer />
        </motion.div>
      )}
    </>
  );
};
export default TeacherLanding;
