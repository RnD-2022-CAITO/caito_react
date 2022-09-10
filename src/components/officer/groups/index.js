import app, {func} from "../../../utils/firebase";
import {useState, useEffect} from 'react';
import GroupCreator from "./components/GroupCreator";
import {useNavigate} from "react-router-dom";
function Groups() {
  const navigate = useNavigate();
  //Set dates
  const today = new Date().toLocaleDateString('sv', {timeZoneName: 'short'});

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [allTeachers, setAllTeachers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');
  const handleCreate = async (e) => {
    e.preventDefault();
    if (groupName) {
      if (teachers.length === 0) {
        return setMessage("At least one teacher must be selected!");
      } else {
        setMessage("");
      }
      const createGroup = func.httpsCallable('group-createGroup');
      await createGroup({
        name: groupName,
        description: groupDescription,
        teachers
      });
      navigate(`/survey-distribution`)
      return;
    }
  }

  useEffect(() => {
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    const retrieveTeachersInfo = async () => {
      const getTeachers = func.httpsCallable('officer-getAllTeachers');
      try {
        await getTeachers().then((result) => {
          console.log(result.data)
          setAllTeachers(result.data);
        });
      } catch (e) {
        console.error(e);
      }
    }

    retrieveTeachersInfo();
  }, [])
  const renderTeachers = () => {
    return allTeachers.map(teacher => {
      return (
        <div key={teacher.id} style={{margin: '10px 10px'}}>
          <input id={teacher.id} checked={teachers.includes(teacher.id)} onChange={e => {
            if (e.target.checked) {
              setTeachers([...teachers, teacher.id]);
            } else {
              setTeachers(teachers.filter(t => {
                return t !== teacher.id;
              }));
            }
          }} style={{marginRight: '10px'}} id={teacher.id} type={'checkbox'} />
          <label htmlFor={teacher.id}>{teacher.firstName} {teacher.lastName}</label>
        </div>
      )
    })
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <div style={{marginBottom: '20px'}}>
          <GroupCreator
            onChange={val => setGroupName(val)}
            required
            type={'input'}
            placeholder={'Lorem ipsum...'}
            subTitle={'Set the name for the group'}
            title={'Group Name'}/>
        </div>
        <div style={{marginBottom: '20px'}}>
          <GroupCreator
            onChange={val => setGroupDescription(val)}
            type={'textarea'}
            placeholder={'Lorem ipsum...'}
            subTitle={'Set the group description'}
            title={'Group Description'}/>
        </div>
        <div style={{marginBottom: '20px', display: 'flex', flexWrap: 'wrap', maxWidth: '600px'}}>
          {renderTeachers()}
        </div>
        <p style={{color: 'red'}}>{message}</p>
        <div style={{marginBottom: '20px'}}>
          <button>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Groups;