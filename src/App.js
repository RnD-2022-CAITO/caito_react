/*
This component stores all the routes for the app
Two routes are used in this app: public route and private routes.
*/

//styling

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';
import './global.css';
import "normalize.css";

//Routes 
import React from 'react'
import LogIn from './components/global/login/LogIn'
import SignUp from './components/global/login/SignUp'
import Landing from './components/global/Landing'
import { AuthProvider } from './components/global/auth/Authentication'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from './components/global/routes/PrivateRoute'
import { UserDataProvider } from './components/global/auth/UserData'
import TeacherProfile from './components/teacher/profile'
import NavBar from './components/global/navigation'
import SurveyDistributionToGroups from './components/officer/surveyDistributionToGroups';
import Groups from './components/officer/groups';
import OfficerSurveyMaking from './components/officer/makingSurvey/surveyMaking'
import OfficerSurveyDistribution from './components/officer/surveyDistribution/surveyDistribution';
import OfficerSurveyStats from './components/officer/surveyStats/surveyStats';
import ErrorRoute from './components/global/routes/ErrorRoute'
import { PrivateLandingRoute } from './components/global/routes/PrivateLandingRoute'
import EditAccount from './components/teacher/profile/EditProfile/EditAccount'
import Survey from './components/teacher/survey'
import DeleteAccount from './components/officer/deleteAccount'
// import DownLoadSurvey from './components/teacher/downLoad/downLoadSurvey'
import { Admin } from './components/officer/adminPage/Admin';
import { Foooter } from './components/global/Footer';
import TaskSummary from './components/officer/TaskSummary/TaskSummary';
import TaskOverview from './components/officer/TaskOverview/TaskOverview';
//Roles to access paths
const role = {
  T: 'teacher',
  O: 'officer',
  A: 'all'
}

const App = () => {

  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Private routes for teacher/officer should be like this: */}
          <Route exact path="/" element={
            <PrivateLandingRoute>
              <UserDataProvider>
                <Landing />
              </UserDataProvider>
            </PrivateLandingRoute>
          }
          />

          <Route exact path="/survey/:id" element={
            <UserDataProvider>
              <PrivateRoute role={role.T}>
                <Survey />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/profile" element={
            <UserDataProvider>
              <PrivateRoute role={role.T}>
                <TeacherProfile />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/edit-password" element={
            <UserDataProvider>
              <PrivateRoute role={role.A}>
                <EditAccount />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          {/* <Route exact path="/downLoad/downLoadSurvey" element={
            <UserDataProvider>
              <PrivateRoute role={role.T}>
                <DownLoadSurvey />
              </PrivateRoute>
            </UserDataProvider>
          }
          /> */}

          <Route exact path="/delete-account" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <DeleteAccount />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          {/* <Route exact path="/summary" element={    
                    <UserDataProvider>
                      <PrivateRoute role={role.O}>
                          <OfficerSummary />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              /> */}

          <Route exact path="/survey-making" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <OfficerSurveyMaking />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/survey-distribution" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <OfficerSurveyDistribution />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/survey-stats/:id" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <OfficerSurveyStats />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/survey-distribution-group" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <SurveyDistributionToGroups />
              </PrivateRoute>
            </UserDataProvider>
          }
          />


          <Route exact path="/groups" element={
            <PrivateLandingRoute>
              <UserDataProvider>
                <Groups />
              </UserDataProvider>
            </PrivateLandingRoute>
          }
          />

          <Route exact path="/task-summary" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <TaskSummary />
              </PrivateRoute>
            </UserDataProvider>
          }
          />

          <Route exact path="/task-overview" element={
            <UserDataProvider>
              <PrivateRoute role={role.O}>
                <TaskOverview />
              </PrivateRoute>
            </UserDataProvider>
          }
          />


          <Route exact path="/admin" element={
            <PrivateLandingRoute>
              <UserDataProvider>
                <Admin />
              </UserDataProvider>
            </PrivateLandingRoute>
          }
          />


          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/error" element={<ErrorRoute />} />
        </Routes>

      </AuthProvider>
    </Router>
  )
}

export default App