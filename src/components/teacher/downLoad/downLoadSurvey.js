import React, { useState, useEffect } from 'react';
//import { useUserData } from '../../../global/auth/UserData.js'
import app, {func} from '../../../utils/firebase';
import 'firebase/compat/app-check';
import "./downLoadSurvey.css"


//const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';
const DownLoadSurvey =() =>{

    const [surveyDisplay, setSurveyDisplay] = useState(false);
    const [allSurveys, setAllSurveys] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);


    function downLoadfile(){

    }

    // useEffect(() => {
    //     app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);

    //     const retrieveSurveyInfo = async () => {
    //         const getSurveys = func.httpsCallable('teacher-getAllAssignedSurveys_Answers');
    //         try {
    //             await getSurveys().then((result) => 
    //             {
    //               setAllSurveys(result.data);
    //             });
    //         } catch (e) {
    //             console.error(e);
    //         }
    //       }

    //       retrieveSurveyInfo();
    // }, [])

    return (
      <>
      <div className='select-display'>
        <h3>Select your surveys to download</h3>
        <button onClick={() => setSurveyDisplay(!surveyDisplay)}>Select surveys</button>
        {surveyDisplay && 
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
        }
        </div>

        <div style={{textAlign:'center'}}>
        <button onClick={() => downLoadfile()}>confirm to download</button>
        </div>
    </>
    )
   
}
export default DownLoadSurvey;


