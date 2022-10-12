import React, { useEffect, useState } from 'react'
import { useUserData } from '../../global/auth/UserData'
import { useAuth } from '../../global/auth/Authentication'
import { useNavigate } from 'react-router-dom'
import app, { func } from '../../../utils/firebase'
import { Button, Classes, Dialog, Icon, Tab, Tabs } from '@blueprintjs/core'
import { CommonLoading } from 'react-loadingg'
import { Tooltip2 } from '@blueprintjs/popover2'
import { TargetGroupDialog } from '../dialogs/TargetGroupDialog'
import { Footer } from '../../global/Footer'
import { AdminProfile } from './AdminProfile'
import { TargetGroup } from './TargetGroup'
import './Admin.css'

export const Admin = () => {
  //Retrive user's information
  const { userData } = useUserData();
  const { currentUser } = useAuth();
  //set the loading state to false by default
  const [loading, setLoading] = useState(true);
  //refresh the data
  const [refreshData, setRefreshData] = useState(true);
  //set the target groups for display
  const [groups, setGroups] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [selectedGroupTeachers, setSelectedGroupTeachers] = useState([]);
  //Open target group dialog
  const [openTargetDialog, setOpenTargetDialog] = useState(false);
  const openTargetGroupDialog = () => setOpenTargetDialog(!openTargetDialog);
  //navigate to different pages
  const navigate = useNavigate();

  //Retrive the target group's information
  useEffect(() => {
    const retrieveGroups = async () => {
      app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
      const getGroups = func.httpsCallable('group-findGroups');
      try {
        const res = await getGroups();
        setGroups(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    retrieveGroups();

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
  }, [refreshData]);

  //Display the name of the teachers in the target group
  const [groupID, setGroupID] = useState('');
  const openTargetGroup = (group) => {
    setGroupID(group);
  }

  //Fetch the target group's information
  const [targetGroupDetails, setTargetGroupDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (groupID !== "") {
      const retrieveTargetGroup = async () => {
        setDetailLoading(true);
        app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
        const getGroupTeachers = func.httpsCallable('group-getGroupTeachers');
        try {
          const res = await getGroupTeachers({
            groupId: groupID.id
          });
          setTargetGroupDetails(res.data.teachers);
          setDetailLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
      retrieveTargetGroup();
    }
  }, [groupID, refreshData]);

  //confirmation dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  }

  //Delete target group
  const deleteGroup = async (groupID) => {
    openDialog();
    setLoading(true);
    try {
      const deleteGroup = func.httpsCallable('group-deleteGroup');
      await deleteGroup({
        groupId: groupID.id
      });
      setRefreshData(!refreshData);
      setTargetGroupDetails(null);
      setGroupID('');
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  //Remove teacher from a group
  const handleRemoveTeacherFromGroup = async (teacherId) => {
    const removeTeacherFromGroup = func.httpsCallable('group-removeTeacherFromGroup');
    setDetailLoading(true);
    try {
      await removeTeacherFromGroup({
        teacherId,
        groupId: groupID.id
      });
      setRefreshData(!refreshData);
      setDetailLoading(false);
      setTargetGroupDetails(null);
    } catch (err) {
      console.error(err);
    }
  }

  //Open add dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const openAddDialog = () => {
    setIsAddDialogOpen(!isAddDialogOpen);
    if (!isAddDialogOpen) {
      setSelectedGroupTeachers([]);
    }
  }

  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.elements['group-name'].value;
    const description = e.target.elements['group-description'].value;
    const updateGroup = func.httpsCallable(`group-updateGroup`);
    await updateGroup({
      groupId: groupID.id,
      name,
      description
    });
    setGroupID({
      ...groupID,
      name: name,
      description: description
    })
    setEditGroupDialogOpen(false);
    setLoading(false);
  }

  const renderTargetGroupDetail = (
    <div className="target-group-detail">
      {(targetGroupDetails === null || detailLoading) ?
        <CommonLoading color='#323547' />
        :
        <>
          {targetGroupDetails &&
            <>
              <h3>Group <strong>{groupID.name}</strong></h3>
              <Dialog
                title="Edit Group"
                onClose={() => setEditGroupDialogOpen(false)} isOpen={editGroupDialogOpen}>
                <form onSubmit={handleEditSubmit} className={'edit-group-container'}>
                  <div className='input-field'>
                    <input name={'group-name'} required defaultValue={groupID.name} placeholder={'Enter group name here...'} />
                    <label>Group name</label>
                  </div>
                  <div className='input-field'>
                    <input name={'group-description'} defaultValue={groupID.description} placeholder={'Enter group description here...'} />
                    <label>Group Description</label>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button>Submit</button>
                  </div>
                </form>
              </Dialog>
              <div className="target-group">
                <p><strong>Group name:</strong> {groupID.name}</p>
                <p><strong>Group bio:</strong> {groupID.description ? groupID.description : 'This group has no description yet.'}</p>
                <button onClick={() => setEditGroupDialogOpen(true)}>Edit</button>
              </div>


              <h3>Teachers in group <strong>{groupID.name}</strong></h3>
              <div className='target-group'>
                <ul>
                  {targetGroupDetails.map((teacher) => {
                    return (
                      <li key={teacher.id}>
                        <div>
                          <h4>{teacher.firstName} {teacher.lastName}</h4>
                          <p>{teacher.email}</p>
                        </div>
                        <Tooltip2
                          content={<span>Remove teacher from group</span>}
                          openOnTargetFocus={false}
                          placement="top"
                        >
                          <Button className={Classes.MINIMAL}
                            icon={<Icon icon="delete" style={{ color: 'var(--warning)' }} />}
                            onClick={() => handleRemoveTeacherFromGroup(teacher.id)}
                          ></Button>
                        </Tooltip2>

                      </li>
                    )
                  })}
                  <li>
                    <Button className={Classes.MINIMAL}
                      icon={<Icon icon="add" style={{ color: 'var(--primary)' }} />}
                      onClick={openAddDialog}
                    >Add teacher</Button>
                  </li>
                </ul>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button style={{ backgroundColor: 'var(--warning)' }}
                  onClick={openDialog}
                >Delete this group</button>
              </div>
            </>}
        </>}

    </div>
  )

  //Render a list of teachers
  const renderTeacherList = () => {
    const teachers = groupID.teachers;
    return allTeachers.filter(teacher => !teachers.includes(teacher.id)).map(teacher => {
      return (
        <div className='card' key={teacher.id}>
          <input
            className='chk-btn'
            id={teacher.id}
            onChange={e => {
              if (e.target.checked) {
                setSelectedGroupTeachers(
                  [...selectedGroupTeachers, teacher.id]
                )
              } else {
                setSelectedGroupTeachers(selectedGroupTeachers.filter(item => {
                  return item !== teacher.id
                }))
              }
            }}
            checked={selectedGroupTeachers.includes(teacher.id)} type={'checkbox'} />
          <label className='input-btn' for={teacher.id}>{teacher.firstName} {teacher.lastName}</label>
        </div>
      )
    })
  }

  //Add new teachers into the target group
  const addNewTeachers = async () => {
    setIsAddDialogOpen(false);
    setDetailLoading(true);
    const groupTeachers = func.httpsCallable('group-groupTeacher');
    try {
      await groupTeachers({
        teacherIds: selectedGroupTeachers,
        groupId: groupID.id
      })
      setDetailLoading(false);
      setRefreshData(!refreshData);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <>

      {loading ?
        <CommonLoading color='#323547' />
        :
        <>
          <div className='admin-wrapper'>
            <div className='admin-container'>
              <AdminProfile userData={userData} currentUser={currentUser} navigate={navigate} />

              <TargetGroup
                openTargetGroup={openTargetGroup}
                groups={groups}
                openTargetGroupDialog={openTargetGroupDialog}
                targetGroupDetails={targetGroupDetails}
                renderTargetGroupDetail={renderTargetGroupDetail}
              />

              <Dialog
                title="Confirmation"
                isOpen={isDialogOpen}
                onClose={openDialog}
              >
                <div className={Classes.DIALOG_BODY}>
                  <p>Are you sure you want to delete this target group?</p>
                  <p>Once you delete, you cannot retrieve the target group's information again.</p>
                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => deleteGroup(groupID)}
                    >Yes, delete this target group</button>
                  </div>
                </div>
              </Dialog>

              <Dialog
                title="Add new teachers to the group"
                isOpen={isAddDialogOpen}
                onClose={openAddDialog}
              >
                <div className={`${Classes.DIALOG_BODY} dialog-container`}>
                  <div className={`dialog-card`}>
                    {groupID && renderTeacherList()}
                  </div>
                  <button disabled={selectedGroupTeachers.length > 0 ? false : true} onClick={addNewTeachers}>Add</button>
                </div>
              </Dialog>

              <TargetGroupDialog isOpen={openTargetDialog} openDialog={openTargetGroupDialog} />
            </div>
          </div>
          <Footer />
        </>
      }
    </>
  )
}


