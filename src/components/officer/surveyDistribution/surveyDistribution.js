//put survey distribution process here
import React, {useState, useEffect} from 'react';
import app, {func} from '../../../utils/firebase';
import {useLocation, useNavigate} from 'react-router-dom';
import {Dialog, Divider, Icon} from '@blueprintjs/core';
import 'firebase/compat/app-check';
import './surveyDistribution.css';
import Modal from "./components/Modal";
import { CommonLoading } from 'react-loadingg';
import { Footer } from '../../global/Footer';
import { SelectTask } from './SelectTask';
import { SelectTargetGroup } from './SelectTargetGroup';
import { SelectDate } from './SelectDate';
import { Review } from './Review';
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
  const [selectedSurveysTitle, setSelectedSurveysTitle] = useState('');
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

  //Get groups info
  const [groups, setGroups] = useState("");

  const location = useLocation();

  const renderState = () => {
    if (distributeToGroupsState === DistributeToGroupsSteps.SELECT_GROUPS) {
      return <button onClick={selectGroups}>Select your target group</button>;
    }
    else if (distributeToGroupsState === DistributeToGroupsSteps.ADD_MORE_TEACHERS) {
      return (
        <div >
          <h4 style={{marginBottom: '20px'}}>{selectedGroupNames.map(name => {
            return <label className={'group-label'} key={name}>{name}</label>
          })}</h4>
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
      setError("Make sure your task and your target group should not be empty;   and your schedule date must be at least from today.");
    }
  }

  //assign one teacher to the survey
  async function assignTeacher(questionID, title, teacherID) {
    console.log('TeacherID: ',teacherID.teacher);
    console.log('GroupID: ',teacherID.groupID);

    // app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    // const scheduleSurvey = func.httpsCallable('officer-scheduleSurvey');
    // try {
    //   await scheduleSurvey({
    //     questionID: questionID,
    //     title: title,
    //     teacherID: teacherID,
    //     scheduledDate: scheduledDate,
    //   });
    // } catch (e) {
    //   console.error(e);
    // }
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

    //Check if the path has previous state (taskID) that is being passed through or not
    if(location.state!==null){
        setSelectedSurveys(location.state.question.id);
    }
      
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

  //Update selected teachers
  useEffect(() => {
    selectedGroupNames.forEach(groupName => {
      const group = groups.find(group => group.name === groupName);

      const teachers = group.teachers.map(teacher => {
        return {
          teacher: teacher,
          groupID: group.id,
        }
        });


      setSelectedTeachers(oldArray => [...oldArray, ...teachers]);

    });

  }, [selectedGroupNames, groups])

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

  //Clear the form
  const clearSchedule = () => {
    setSelectedSurveys("");
    setSelectedTeachers([]);
    setSelectedGroupNames([]);
    setScheduledDate(today.substring(0, 10));
    setStep(1);
  };

  const [step, setStep] = useState(1);

  const toggleStepTitle = () => {
    switch (step) {
      case 1:
        return "1. Select your task";
      case 2:
        return "2. Select your target group";
      case 3:
        return "3. Schedule your task";
      case 4:
        return "4. Review";
      default:
        return "5. Select your task";
    }
  }

  const toggleStep = () => {
    switch(step) {
      case 1:
        return <SelectTask 
        selectedSurveys={selectedSurveys}
        setSelectedSurveys={setSelectedSurveys}
        setSelectedSurveysTitle={setSelectedSurveysTitle}
        allSurveys={allSurveys} />
      case 2:
        return <SelectTargetGroup 
        navigate={navigate}
        renderState={renderState} />
      case 3:
        return <SelectDate
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate} />
      case 4:
        return <div>
        <SelectTask 
        selectedSurveys={selectedSurveys}
        setSelectedSurveys={setSelectedSurveys}
        setSelectedSurveysTitle={setSelectedSurveysTitle}
        allSurveys={allSurveys} />
        <SelectTargetGroup 
        navigate={navigate}
        renderState={renderState} />
        <SelectDate
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate} />
        </div>
      default:
        return <SelectTask 
        selectedSurveys={selectedSurveys}
        setSelectedSurveys={setSelectedSurveys}
        allSurveys={allSurveys} />;
    }
  }

  return (
    <>
    {loading ? 
    <div>
    <CommonLoading color='#323547'/>
    </div> :
    <>
    <div className='main-wrapper'>
      <h1 style={{textAlign:'center'}}>Distribute Task</h1>
      <Divider />
      <Modal visible={selectGroupsVisible} defaultGroups={selectedGroupNames} onConfirm={handleConfirmSelectGroups} onClose={() => setSelectGroupsVisible(false)}/>
      
      <div className='grid-layout'>
        <h1 className='step-title'>{toggleStepTitle()}</h1>
        {toggleStep()}  
      </div>

      {step === 4 && 
      <Review 
      selectedSurveysTitle={selectedSurveysTitle}
      assignTeachers = {assignTeachers}
      clearSchedule = {clearSchedule} />
      }

      <div className='steps-progress arrow-bottom'>
        <button
        className='step-progress-btn'
        disabled={step === 1 ? true : false}
        onClick={()=>setStep(step-1)}>
          <Icon size={'20px'} icon="chevron-left" />
        </button>

        <button className='step-progress-icon' disabled={step === 1 ? false : true}></button>

        <button className='step-progress-icon' disabled={step === 2 ? false : true}></button>

        <button className='step-progress-icon' disabled={step === 3 ? false : true}></button>

        <button className='step-progress-icon' disabled={step === 4 ? false : true}></button>

        <button
        className='step-progress-btn'
        disabled={step === 4 ? true : false}
        onClick={()=>setStep(step+1)}>
          <Icon size={'20px'} icon="chevron-right" />
        </button>
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