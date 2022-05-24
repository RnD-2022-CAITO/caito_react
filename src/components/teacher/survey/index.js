//Main page for the components
import React, { useState, useEffect } from 'react';
import app, {func} from '../../../utils/firebase';
import 'firebase/compat/app-check';
import { useAuth } from '../../global/auth/Authentication'
import { useNavigate, Link } from 'react-router-dom'
import { useUserData } from '../../global/auth/UserData'
import SurveyInfo from './SurveyInfo'

const site_key = '6Lf6lbQfAAAAAIUBeOwON6WgRNQvcVVGfYqkkeMV';

const TeacherSurvey = () => {
    const {currentUser} = useAuth();
    const {userData} = useUserData();
    


    return (
        <div>
        <h1 className='profile-title'>My Survey</h1>
        <SurveyInfo user = {currentUser} data={userData} />
    </div>

    )
}

export default TeacherSurvey