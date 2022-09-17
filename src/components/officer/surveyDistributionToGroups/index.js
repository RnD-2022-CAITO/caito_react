import React, {useEffect, useState} from "react";
import {func} from "../../../utils/firebase";
import style from './style.module.css';
function SurveyDistributionToGroups() {
  const [groups, setGroups] = useState([]);
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    const retrieveSurveys = async () => {
      const getSurveys = func.httpsCallable('officer-getAllCreatedSurveys_Questions');
      try {
        const res = await getSurveys();
        setSurveys(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    retrieveSurveys();
  }, []);
  const handleDistribute = async (group_id) => {
    const group = groups.find(group => group.id === group_id);
    if (group) {
      const teachers = group.teachers;
      const surveys = group.selectedSurveys;
      const distributeSurveyToGroupTeachers = func.httpsCallable('officer-distributeSurveyToGroup');
      try {
        const res = await distributeSurveyToGroupTeachers({
          teachers, surveys, group_id: group.id
        });
        console.log(res);
        alert('Distribute successfully!');
      } catch (err) {
        console.log(err);
      }
    }
  }
  const renderSurverys = (group_id) => {
    const group = groups.find(group => group.id === group_id);
    return surveys.map(survey => {
      let checked = false;
      if (group &&
          group.selectedSurveys &&
          group.selectedSurveys.includes(survey.id)) {
          checked = true;
      }
      return (
        <p key={survey.id}>
          <input checked={checked}
                 onChange={e => {
                   setGroups(groups.map(group => {
                     if (group.id === group_id) {
                        if (!group.selectedSurveys) {
                          group.selectedSurveys = [];
                        }
                        if (e.target.checked) {
                          group.selectedSurveys.push(survey.id);
                        } else {
                          group.selectedSurveys =
                            group.selectedSurveys.filter(item => {
                              return item !== survey.id;
                            })
                        }
                     }
                     return group;
                   }))
                 }}
                 type={'checkbox'} id={survey.id}/>
          <label htmlFor={survey.id}>{survey.title}</label>
        </p>
      )
    })
  }
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
  }, []);
  const handleRequestTeacherOfGroup = async (group_id) => {
    const getGroupTeachers = func.httpsCallable('group-getGroupTeachers');
    try {
      const res = await getGroupTeachers({
        groupId: group_id
      });
      setGroups(groups.map(group => {
        if (group.id === group_id) {
          group.teachersData = res.data.teachers;
        }
        return group;
      }))
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
            {!group.teachersData && (
              <button onClick={() => handleRequestTeacherOfGroup(group.id)} style={{marginRight: '10px'}}>
                Show teachers
              </button>
            )}
            {group.teachersData && (
              <ul>
                { group.teachersData.map(teacher => {
                  return <li key={teacher.id}>{teacher.firstName}.{teacher.lastName}</li>
                })
                }
              </ul>
            )
            }
          </td>
          <td >
            <div style={{maxHeight: '250px', overflow: 'auto'}}>
              {renderSurverys(group.id)}
            </div>
          </td>
          <td>
            <button onClick={() => handleDistribute(group.id)}>Distribute</button>
          </td>
        </tr>
      )
    });
    return (
      <table border={1} width={'100%'}>
        <thead>
        <tr>
          <th>#</th>
          <th>Group Name</th>
          <th>Teachers</th>
          <th>Surveys</th>
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
    <div >
      <div className={style.wrapper}>{renderGroups()}</div>
    </div>
  )
}

export default SurveyDistributionToGroups;