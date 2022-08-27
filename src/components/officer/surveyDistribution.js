//put survey distribution process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import 'firebase/compat/app-check';
import './surveyDistribution.css';

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
  const [scheduledDate, setScheduledDate] = useState(today.substring(0,10));
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [refreshCurrentGroup, setRefreshCurrentGroup] = useState(true);
  const [selectedGroupTeachers, setSelectedGroupTeachers] = useState([]);
  const handleRemoveTeacherFromGroup = async (teacherId) => {
    const removeTeacherFromGroup = func.httpsCallable('group-removeTeacherFromGroup');
    try {
      await removeTeacherFromGroup({
        teacherId,
        groupId: currentGroupId
      });
      setRefreshCurrentGroup(!refreshCurrentGroup);
      setRefreshGroup(!refreshGroup);
    } catch (err) {
      console.log(err);
    }
  }
  const handleGroupTeacher = async () => {
    const groupTeachers = func.httpsCallable('group-groupTeacher');
    try {
      await groupTeachers({
        teacherIds: selectedGroupTeachers,
        groupId: currentGroupId
      })
      setRefreshCurrentGroup(!refreshCurrentGroup);
      setRefreshGroup(!refreshGroup);
    } catch (err) {
      console.log(err);
    }
  }
  const renderTeacherList = () => {
    const currentGroup = groups.find(group => group.id === currentGroupId);
    const teachers = currentGroup && [...currentGroup.teachers] || [];
    return allTeachers.filter(teacher => !teachers.includes(teacher.id)).map(teacher => {
      return (
        <div key={teacher.id}>
          <span>Teacher's Name: {teacher.firstName} {teacher.lastName}</span>
          <input
            onChange={e => {
              if (e.target.checked) {
                setSelectedGroupTeachers(
                  [...selectedGroupTeachers, teacher.id]
                )
              } else {
                console.log(selectedGroupTeachers, teacher)
                setSelectedGroupTeachers(selectedGroupTeachers.filter(item => {
                  return item !== teacher.id
                }))
              }
            }}
            checked={selectedGroupTeachers.includes(teacher.id)} type={'checkbox'}  />
        </div>
      )
    })
  }
  const renderCurrentGroup = () => {
    if (currentGroup === null) {
      return <></>;
    }
    const teachers = currentGroup.teachers;
    const trs = teachers.map((teacher, index) => {
      return (
        <tr key={teacher.id}>
          <td>{index + 1}</td>
          <td>{teacher.firstName} {teacher.lastName}</td>
          <td>{teacher.email}</td>
          <td>
            <button onClick={() => handleRemoveTeacherFromGroup(teacher.id)}>Remove</button>
          </td>
        </tr>
      )
    })
    return (
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Teacher' s Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {trs}
        </tbody>
      </table>
    )
  }
  useEffect(() => {
    const retrieveGroupTeachers = async () => {
      const getGroupTeachers = func.httpsCallable('group-getGroupTeachers');
      try {
        const res = await getGroupTeachers({
          groupId: currentGroupId
        });
        setCurrentGroup(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    if (currentGroupId !== null) {
      retrieveGroupTeachers();
    }
  }, [currentGroupId, refreshCurrentGroup]);
  const [groups, setGroups] = useState([]);
  const [refreshGroup, setRefreshGroup] = useState(true);
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
    retrieveGroups()
  }, [refreshGroup]);
  const handleDeleteGroup = async (groupId) => {
    try {
      const deleteGroup = func.httpsCallable('group-deleteGroup');
      await deleteGroup({
        groupId: groupId
      });
      setRefreshGroup(!refreshGroup);
      if (currentGroupId === groupId) {
        setCurrentGroup(null);
        setAddVisible(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const renderGroups = () => {
    const trs = groups.map((group, index) => {
      return (
        <tr key={group.id}>
          <td>{index + 1}</td>
          <td>{group.name}</td>
          <td>
            <button onClick={() => {
              setAddVisible(true);
              setCurrentGroupId(group.id);
            }} style={{marginRight:'10px'}}>Add Teacher</button>
            <button onClick={() => setCurrentGroupId(group.id)} style={{marginRight: '10px'}}>Look at teachers</button>
            <button onClick={() => handleDeleteGroup(group.id)}>Delete</button>
          </td>
        </tr>
      )
    });
    return (
      <table border={1} width={'100%'}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trs}
        </tbody>
      </table>
    )
  }


  async function assignTeachers(){
    let error = 0;
    if(scheduledDate < today.substring(0,10)){
      ++error;
    } 
    if((selectedSurveys.length < 1)){
      ++error;
    } 
    if((selectedTeachers.length < 1)){
      ++error;
    } 
    if (error === 0){
      // eslint-disable-next-line
      selectedSurveys.map((survey) => {
        let obj = allSurveys.find((o) => o.id === survey);
        selectedTeachers.map(async (teacher) => {
          await assignTeacher(survey, obj.title, teacher);
        })
      })

      alert('Successfully sent out the invitation to fill in the task!');

      //refresh the page
      // window.location.reload();
    }
    else{
      alert("Make sure there's at least one survey and one teacher checked. Date must be at least from today.");
    }
  }

  //assign one teacher to the survey
  async function assignTeacher(questionID, title, teacherID){
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
          await getSurveys().then((result) => 
          {
            setAllSurveys(result.data);
          });
      } catch (e) {
          console.error(e);
      }
    }

    retrieveSurveyInfo();

    setSurveyDisplay(true);

  }, [])

  useEffect(() => {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    const retrieveTeachersInfo = async () => {
        const getTeachers = func.httpsCallable('officer-getAllTeachers');
        try {
            await getTeachers().then((result) => 
            {
              setAllTeachers(result.data);
            });
        } catch (e) {
            console.error(e);
        }
    }

    retrieveTeachersInfo();
  },[])

  const selectTeachers = () => {
    //Select a group of teachers from the officer's created target group
    alert("This feature is under development");
  }

  const selectGroups = () => {

  }

  const createTargetGroup = async () => {
    //Redirect the user to the create group page
    const group_name = window.prompt("Enter group name: ");
    if (group_name) {
      const createGroup = func.httpsCallable('group-createGroup');
      await createGroup({
        name: group_name
      });
      setRefreshGroup(!refreshGroup);
      return;
    }
  }

  //Clear the form
  const clearSchedule = () => {
    setSelectedSurveys([]);
    setSelectedTeachers([]);
    setScheduledDate(today.substring(0,10));
  }

  return (
    <>
    <div className='grid-layout'>
        <div className='select-display-survey'>
        <h3>Select your surveys</h3>
        {surveyDisplay ?
        allSurveys.map((o, index) => 
        <div key={index}>
          <span>{++index}. Title: {o.title}</span>
          <input
            type="checkbox"
            value={o.id}
            checked={selectedSurveys.includes(o.id)}
            onChange={e => 
              {
                if (selectedSurveys.includes(e.target.value)){
                  setSelectedSurveys(selectedSurveys.filter(obj => obj !== e.target.value));
                }else{
                setSelectedSurveys(oldArray => [...oldArray, e.target.value])
                }
              }
            }
          />
        </div>)
        : <p>Loading...</p>
        }
        </div>

        <div className='select-display'>
        <h3>Select your target groups</h3>
        <div style={{textAlign:'center'}}>
        <p>Select a group of teachers that you want to send the survey to</p>
        <button onClick={selectTeachers}>Select your target group</button>
        <p> or </p>
        <button className='secondary-btn' onClick={createTargetGroup}>Create a new target group</button>
        </div>
          <div>{renderCurrentGroup()}</div>
          <div>
            {renderGroups()}
          </div>
          {addVisible && (
            <div>
              <div>
                {renderTeacherList()}
              </div>
              <div>
                <button onClick={() => handleGroupTeacher()}>Submit</button>
              </div>
            </div>
          )}

        
        <div style={{backgroundColor:'red', color:'white', textAlign:'center', padding:'10px'}}>
        <p>This is an old feature. It will be left here for debugging...</p>
        <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>

        {/* old feature */}
        {teacherDisplay && 
        allTeachers.map((o, index) => 
        <div key={index}> 
        <span> {index +1 } Teacher's Name: {o.firstName} {o.lastName} </span>
        <input
          type="checkbox"
          value={o.id}
          checked={selectedTeachers.includes(o.id)}
          onChange={e => 
            {
              if (selectedTeachers.includes(e.target.value)){
                setSelectedTeachers(selectedTeachers.filter(obj => obj !== e.target.value));
              }else{
                setSelectedTeachers(oldArray => [...oldArray, e.target.value])
              }
            }
          }
        />
        </div>)}

        </div>

        </div>
        <div className='select-display'>
          <h3>Schedule your date to send the profiling task</h3>
          <input required className='question' type="date" 
          placeholder='Enter your title here..'
          value={scheduledDate}
          onInput={e => setScheduledDate(e.target.value)} />
        </div>

    </div>
          
    <div className='schedule-btns'>
        <button onClick={() => assignTeachers()}>Start sending out survey invitation</button>

        <button className='warning-btn' onClick={clearSchedule}>Discard changes</button>        
    </div>
    </>
  )
}
export default OfficerSurveyDistribution;