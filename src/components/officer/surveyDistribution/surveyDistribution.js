//put survey distribution process here
import React, {useState, useEffect} from 'react';
import app, {func} from '../../../utils/firebase';
import {useNavigate} from 'react-router-dom';
import {Dialog, HTMLSelect} from '@blueprintjs/core';
import 'firebase/compat/app-check';
import './surveyDistribution.css';
import Modal from "./components/Modal";
const DistributeToGroupsSteps = {
  SELECT_GROUPS: 0,
  ADD_MORE_TEACHERS: 1
}
const OfficerSurveyDistribution = () => {
// 1. select existing survey(s): get all existing surveys created by logged in officer
// 2. select teacher(s)
// 3. distribute
  const [allTeachers, setAllTeachers] = useState([]);
  const [teacherDisplay, setTeacherDisplay] = useState(false);

  const [allSurveys, setAllSurveys] = useState([]);
  const [surveyDisplay, setSurveyDisplay] = useState(false);

  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});
  const [scheduledDate, setScheduledDate] = useState(today.substring(0, 10));

  //Display dialog error message
  const [error, setError] = useState("");

  //Display confirmation message
  const [confirmation, setConfirmation] = useState("");

  //Display select groups modal
  const [selectGroupsVisible, setSelectGroupsVisible] = useState(false);
  const [selectedGroupNames, setSelectedGroupNames] = useState([]);
  const [distributeToGroupsState, setDistributeToGroupsState] = useState(DistributeToGroupsSteps.SELECT_GROUPS);

  //Navigate through another page
  const navigate = useNavigate();

  const renderState = () => {
    if (distributeToGroupsState === DistributeToGroupsSteps.SELECT_GROUPS) {
      return <button onClick={selectGroups}>Select your target group</button>;
    }
    else if (distributeToGroupsState === DistributeToGroupsSteps.ADD_MORE_TEACHERS) {
      return (
        <div>
          <h4>{selectedGroupNames.join(', ')}</h4>
          <button onClick={() => setSelectGroupsVisible(true)}>ADD MORE TARGET GROUPS</button>
        </div>
      )
    }
  }


  async function assignTeachers() {
    let error = 0;
    if (scheduledDate < today.substring(0, 10)) {
      ++error;
    }
    if ((selectedSurveys.length < 1)) {
      ++error;
    }
    if ((selectedTeachers.length < 1)) {
      ++error;
    }
    if (error === 0) {
      // eslint-disable-next-line
      let obj = allSurveys.find((o) => o.id === selectedSurveys);
      selectedTeachers.map(async (teacher) => {
        await assignTeacher(selectedSurveys, obj.title, teacher);
      })


      setConfirmation('Successfully sent out the invitation to fill in the task!');

      navigate('/');

    } else {
      setError("Make sure there's at least one survey and one teacher checked and date must be at least from today.");
    }
  }

  //assign one teacher to the survey
  async function assignTeacher(questionID, title, teacherID) {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const scheduleSurvey = func.httpsCallable('officer-scheduleSurvey');
    try {
      await scheduleSurvey({
        questionID: questionID,
        title: title,
        teacherID: teacherID,
        scheduledDate: scheduledDate,
      });
    } catch (e) {
      console.error(e);
    }
  }

  //Get all teachers from the database

  useEffect(() => {
    console.log(surveyDisplay);
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    const retrieveSurveyInfo = async () => {
      const getSurveys = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
      try {
        await getSurveys().then((result) => {
          setAllSurveys(result.data);
        });
      } catch (e) {
        console.error(e);
      }
    }

    retrieveSurveyInfo();

    setSurveyDisplay(true);

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    const retrieveTeachersInfo = async () => {
      const getTeachers = func.httpsCallable('officer-getAllTeachers');
      try {
        await getTeachers().then((result) => {
          setAllTeachers(result.data);
        });
      } catch (e) {
        console.error(e);
      }
    }

    retrieveTeachersInfo();
  }, [])

  const selectTeachers = () => {
    //Select a group of teachers from the officer's created target group
    //navigate('/survey-distribution-group')
  }

  const selectGroups = () => {
    setSelectGroupsVisible(true);
  }

  const handleConfirmSelectGroups = (names) => {
    if (names.length > 0) {
      setSelectedGroupNames([...names]);
      setDistributeToGroupsState(DistributeToGroupsSteps.ADD_MORE_TEACHERS);
    }
    setSelectGroupsVisible(false);
  }


  //Clear the form
  const clearSchedule = () => {
    setSelectedSurveys("");
    setSelectedTeachers([]);
    setScheduledDate(today.substring(0, 10));
  }

  return (
    <>
      {selectGroupsVisible && <Modal defaultGroups={selectedGroupNames} onConfirm={handleConfirmSelectGroups} onClose={() => setSelectGroupsVisible(false)}/>}
      <div className='grid-layout'>
        <div className='select-display-s'>
          <h3>Select your profiling task</h3>
          <div className=' template input-field'>
            <HTMLSelect
              value={selectedSurveys}
              onChange={e => {
                setSelectedSurveys(e.target.value);
              }
              }
            >
              <option value="" disabled selected>Select a task</option>
              {allSurveys.map((o) =>
                <option value={o.id}>
                  {o.title}
                </option>)}
            </HTMLSelect>
            <label>
              Select a profiling task
            </label>
          </div>

          <p>
            <em>It may take a couple of seconds to load the tasks, please be patient.</em>
          </p>
        </div>

        <div className='select-display-survey'>
          <h3>Select your target groups</h3>
          <div style={{textAlign: 'center'}}>
            <p>Select a group of teachers that you want to send the survey to</p>
            {renderState()}
            <p> or </p>
            <button className='secondary-btn' onClick={() => navigate('/groups')}>Create a new target group</button>
          </div>


          <div style={{backgroundColor: 'red', color: 'white', textAlign: 'center', padding: '10px'}}>
            <p>This is an old feature. It will be left here for debugging...</p>
            <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>

            {/* old feature */}
            {teacherDisplay &&
              allTeachers.map((o, index) =>
                <div key={index}>
                  <span> {index + 1} Teacher's Name: {o.firstName} {o.lastName} </span>
                  <input
                    type="checkbox"
                    value={o.id}
                    checked={selectedTeachers.includes(o.id)}
                    onChange={e => {
                      if (selectedTeachers.includes(e.target.value)) {
                        setSelectedTeachers(selectedTeachers.filter(obj => obj !== e.target.value));
                      } else {
                        setSelectedTeachers(oldArray => [...oldArray, e.target.value])
                      }
                    }
                    }
                  />
                </div>)}

          </div>

        </div>
        <div className='select-display-s'>
          <h3>Schedule your date to send the profiling task</h3>
          <input required className='question' type="date"
                 placeholder='Enter your title here..'
                 value={scheduledDate}
                 onInput={e => setScheduledDate(e.target.value)}/>
        </div>

      </div>

      <div className='schedule-btns'>
        <button onClick={() => assignTeachers()}>Start sending out survey invitation</button>

        <button className='warning-btn' onClick={clearSchedule}>Discard changes</button>
      </div>


      {error !== "" &&
        <Dialog
          title="Unable to schedule survey"
          isOpen={error !== "" ? true : false}
          onClose={() => setError("")}
        >
          <p style={{padding: '10px'}}>
            {error}
          </p>
        </Dialog>}

      {confirmation !== "" &&
        <Dialog
          title="Confirmation"
          isOpen={confirmation !== "" ? true : false}
          onClose={() => navigate('/')}
        >
          <p style={{padding: '10px'}}>
            {confirmation}
          </p>
        </Dialog>}
    </>
  )
}
export default OfficerSurveyDistribution;