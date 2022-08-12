import app, {func} from "../../../utils/firebase";
import {useState, useEffect} from 'react';
function Groups() {
  const [loading, setLoading] = useState(false);
  const [allTeachers, setAllTeachers] = useState([]);
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
    setLoading(true);
    try {
      await removeTeacherFromGroup({
        teacherId,
        groupId: currentGroupId
      });
      setRefreshCurrentGroup(!refreshCurrentGroup);
      setRefreshGroup(!refreshGroup);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  const handleGroupTeacher = async () => {
    const groupTeachers = func.httpsCallable('group-groupTeacher');
    setLoading(true);
    try {
      await groupTeachers({
        teacherIds: selectedGroupTeachers,
        groupId: currentGroupId
      })
      setRefreshCurrentGroup(!refreshCurrentGroup);
      setRefreshGroup(!refreshGroup);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  const renderTeacherList = () => {
    const currentGroup = groups.find(group => group.id === currentGroupId);
    const teachers = [...currentGroup.teachers];
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
    setLoading(true);
    const retrieveGroupTeachers = async () => {
      const getGroupTeachers = func.httpsCallable('group-getGroupTeachers');
      try {
        const res = await getGroupTeachers({
          groupId: currentGroupId
        });
        setCurrentGroup(res.data);
        setLoading(false);
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
    setLoading(true);
    const retrieveGroups = async () => {
      const getGroups = func.httpsCallable('group-findGroups');
      try {
        const res = await getGroups();
        setGroups(res.data)
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    retrieveGroups()
  }, [refreshGroup]);
  const handleDeleteGroup = async (groupId) => {
    setLoading(true);
    try {
      const deleteGroup = func.httpsCallable('group-deleteGroup');
      await deleteGroup({
        groupId: groupId
      });
      setRefreshGroup(!refreshGroup);
      setLoading(false);
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
            }} style={{marginRight:'10px'}}>Add Teachers</button>
            <button onClick={() => setCurrentGroupId(group.id)} style={{marginRight: '10px'}}>Show teachers</button>
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
  return (
    <div>
      <h1 style={{textAlign:'center'}}>Groups</h1>
      {loading && <h2 style={{width: '50%', margin: '10px auto'}}>Loading...</h2>}
      <div style={{width: '50%', margin: 'auto'}}>{renderCurrentGroup()}</div>
      <div style={{width: '50%', margin: 'auto'}}>
        {renderGroups()}
      </div>
      <div style={{width: '50%', margin: 'auto'}}>
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
      </div>

    </div>
  )
}

export default Groups;