//put delete process here
import React, { useState, useEffect } from 'react';
import app, {func} from '../../utils/firebase';
import 'firebase/compat/app-check';
import "./delete.css"

//const database = getDatabase();

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';


const DeleteAccount =() =>{

    //set user ID

    //const userID = user.getIdTokenResult();
    //const fn = user.displayName();

    //const [ID, setID] = useState("");
    //set User name
    const [allTeachers, setAllTeachers] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    //loading state for the buttons
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    async function deleteTeacher () {
        app.appCheck().activate(site_key, true);
        const deleteTeacherID = func.httpsCallable('officer-deleteTeacher');
        try {
          await deleteTeacherID({
              firstName: firstName,
              lastName: lastName,
          })
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
    }, [])

    // async function deleteTeacher(){
    //   app.appCheck().activate(site_key, true);
    //   const deleteTeacherID = func.httpsCallable('officer-deleteTeacher');
    //   try {
    //       await deleteTeacherID({
    //           firstName: firstName,
    //           lastName: lastName,
    //           //ID: ID,
    //       })
    //   } catch (e) {
    //       console.error(e);
    //   }
    // }

    return (
     <>
     {!complete ?
     <div className="container">
      <div className='confirm-delete-user'> 
        <h1 style={{textAlign: 'center'}}>Delete teacher's account</h1>

        {/* <div className='input-field'>
          <input required className='ID' type="number" 
          placeholder='Enter user ID here..'
          value={ID}
          onInput={e => setID(e.target.value)} />
          <label>
            Teacher's ID
          </label>
        </div> */}

        <div className='input-firstField'>
          <input required className='FirstName' type="text" 
          placeholder='Enter user Firstname'
          value={firstName}
          onInput={e => setFirstName(e.target.value)} />
          <label>
            Teacher's FirstName
                 
          </label>
        </div>

        <div className='input-lastField'>
          <input required className='LastName' type="text" 
          placeholder='Enter user LastName'
          value={lastName}
          onInput={e => setLastName(e.target.value)} />
          <label>
            Teacher's LastName      
          </label>
        </div>

        <div className='delete-buttons'>          
          <div className='survey-sub-btns'>
            <button className='auth-btn' disabled={loading} onClick={() => deleteTeacher()}> Confirm</button>
            
          </div>

        </div>
        </div>
      </div>
     :
     <div className='confirmation-box'>
      <h2>Your action has been done. </h2>
      <h5>What to do next?</h5>
      <button onClick={()=>window.location.reload()}>
        go back
      </button>
    </div> 
    }   
     </>
    )
//<button className='auth-btn' disabled={loading} onClick={()=> cancle()}>Cancle</button>
}
export default DeleteAccount;
