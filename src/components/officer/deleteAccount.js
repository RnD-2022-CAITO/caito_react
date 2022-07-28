//put delete process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import 'firebase/compat/app-check';
import "./delete.css"


const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';
const DeleteAccount =() =>{

    const [allTeachers, setAllTeachers] = useState([]);
    const [teacherDisplay, setTeacherDisplay] = useState(false);

    // const [firstName, getFirstName] = useState([]);
    // const [lastName, getLastName] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

//try to delete teacher's ID
    async function deleteTeachers(){
      selectedTeachers.map((o) => {
      deleteteacherAccount(o);  
      })
      alert('you selected has been delet and pleas wait seconds to processing');
      setTimeout(
        () => window.location.replace(document.referrer), 2000);
      
      //
  }

    async function deleteteacherAccount (teacherID) {
        app.appCheck().activate(site_key, true);
        const deleteTeacherAccount = func.httpsCallable('officer-deleteTeacher');
        try {
          await deleteTeacherAccount({
            teacherID: teacherID,
          });
      } catch (e) {
          console.error(e);
      }
    }

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

    }, [])

    return (
      <>
      <div className='select-display'>
        <h3>Select a teacher you want to delete</h3>
        <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>
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

        <div style={{textAlign:'center'}}>
        <button onClick={() => deleteTeachers()}>confirm to delete teacher's account</button>
        </div>
    </>
    )
    //  <div className="container">
    //   <div className='confirm-delete-user'> 
    //     <h1 style={{textAlign: 'center'}}>Delete teacher's account</h1>

    //     <div className='input-firstField'>
    //       <input required className='FirstName' type="text" 
    //       placeholder='Enter user Firstname'
    //       value={firstName}
    //       onInput={e => getFirstName(e.target.value)} />
    //       <label>
    //         Teacher's FirstName
                 
    //       </label>
    //     </div>

    //     <div className='select-display'>
    //     <button onClick={() => setTeacherDisplay(!teacherDisplay)}>Select teachers</button>
    //     {teacherDisplay && 
    //     allTeachers.map((o, index) => 
    //     <div key={index}> 
    //     <span> {index +1 } Teacher's Name: {o.firstName} {o.lastName} </span>
    //     <input
    //       type="checkbox"
    //       value={o.id}
    //       checked={selectedTeachers.includes(o.id)}
    //       onChange={e => 
    //         {
    //           if (selectedTeachers.includes(e.target.value)){
    //             setSelectedTeachers(selectedTeachers.filter(obj => obj !== e.target.value));
    //           }else{
    //             setSelectedTeachers(oldArray => [...oldArray, e.target.value])
    //           }
    //         }
    //       }
    //     />

    //     <div className='input-lastField'>
    //       <input required className='LastName' type="text" 
    //       placeholder='Enter user LastName'
    //       value={lastName}
    //       onInput={e => getLastName(e.target.value)} />
    //       <label>
    //         Teacher's LastName      
    //       </label>
    //     </div>

    //     <div className='delete-buttons'>          
    //       <div className='survey-sub-btns'>
    //         <button className='auth-btn' disabled={loading} onClick={() => deleteTeacher()}> Confirm</button>
            
    //       </div>

    //     </div>
    //     </div>
    //   </div>
    //  :
    //  <div className='confirmation-box'>
    //   <h2>Your action has been done. </h2>
    //   <h5>What to do next?</h5>
    //   <button onClick={()=>window.location.reload()}>
    //     go back
    //   </button>
    // </div>   
    //  </>
    // )
}
export default DeleteAccount;
