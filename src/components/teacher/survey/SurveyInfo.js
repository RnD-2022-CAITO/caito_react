import React from 'react'
import { NavLink } from 'react-router-dom';

const SurveyInfo = (props) => {
    const {user, data} = props;

    return (
        <div className='profile-section'>
            <p>Name: {data.firstName} {data.lastName}</p>
            <p>Survey List:</p>
            <NavLink to='/survey/Questions'>
            <button > 
                Check survey
            </button>
            </NavLink>

        </div>
    )
}

export default SurveyInfo