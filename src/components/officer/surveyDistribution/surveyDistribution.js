//put survey distribution process here
import React, {useState, useEffect} from 'react';
import app, {func} from '../../../utils/firebase';
import {useNavigate} from 'react-router-dom';
import {Button, Classes, Dialog, HTMLSelect, Icon} from '@blueprintjs/core';
import 'firebase/compat/app-check';
import './surveyDistribution.css';
import Modal from "./components/Modal";
import { Tooltip2 } from '@blueprintjs/popover2';
import { CommonLoading } from 'react-loadingg';
import { Footer } from '../../global/Footer';
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

  const [selectedSurveys, setSelectedSurveys] = useState('');
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

  //loading state
  const [loading, setLoading] = useState(true);

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
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const retrieveSurveyInfo = async () => {
      const getSurveys = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
      try {
        await getSurveys().then((result) => {
          setAllSurveys(result.data);
          setLoading(false);
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
    {loading ? 
    <div>
    <CommonLoading color='#323547'/>
    </div> :
    <>
    <div className='main-wrapper'>
      {selectGroupsVisible && <Modal defaultGroups={selectedGroupNames} onConfirm={handleConfirmSelectGroups} onClose={() => setSelectGroupsVisible(false)}/>}
      <div className='grid-layout'>
        <div className='select-display-s'>
          <h3>Select your profiling task</h3>
          <div className=' template input-field'>
            <HTMLSelect
              multiple={false}
              value={selectedSurveys}
              onChange={e => {
                setSelectedSurveys(e.target.value);
              }
              }
            >
              <option value="" disabled>Select a task</option>
              {allSurveys.map((o) =>
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>)}
            </HTMLSelect>
            <label>
              Select a profiling task
            </label>
          </div>

        </div>

        <div className='select-display-survey'>
          <h3>Select your target groups
          <Tooltip2
                                content={<span>Target group contains a group of teachers that the survey will be sent to. 
                                  <br></br>
                                  Manage your target groups in your admin page,
                                  <br></br>or you can create a new target group by
                                  clicking on the button below
                                </span>}
                                openOnTargetFocus={false}
                                placement="top"
                                usePortal={false}
          >
          <Button className={Classes.MINIMAL} icon={<Icon icon="help" style={{color:'white'}}/>}></Button>
          </Tooltip2>
          </h3>
          <div style={{textAlign: 'center'}}>
            <p>Select a group of teachers that you want to send the survey to </p>
            {renderState()}
            <p> or </p>
            <button className='secondary-btn' onClick={() => navigate('/groups')}>Create a new target group</button>
          </div>


          {/* <div>
            <p>This is an old feature. It will be left here for debugging...</p>
            <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>
            <div className='teacher-card'>
            {teacherDisplay &&
              allTeachers.map((o, index) =>
                <div className='card' key={index}>
                  <input
                    className='chk-btn'
                    type="checkbox"
                    value={o.id}
                    id={o.id}
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

                <label className='input-btn' for={o.id}>{o.firstName} {o.lastName} </label>
                </div>)}
                </div>
          </div> */}

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
    </div>
    <Footer/>
    </>
    }
    </>
  )
}
export default OfficerSurveyDistribution;