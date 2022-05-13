/*
This component stores all the routes for the app
Two routes are used in this app: public route and private routes.
*/

//styling
import './global.css'
//Routes 
import React from 'react'
import LogIn from './components/global/login/LogIn'
import SignUp from './components/global/login/SignUp'
import Landing from './components/global/Landing'
import { AuthProvider } from './components/global/auth/Authentication'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { PrivateRoute } from './components/global/routes/PrivateRoute'
import { UserDataProvider } from './components/global/auth/UserData'
import TeacherProfile from './components/teacher/profile'
import NavBar from './components/global/navigation'
import OfficerSummary from './components/officer/analysis'
import OfficerSurveyMaking from './components/officer/surveyMaking'
import OfficerSurveyDistribution from './components/officer/surveyDistribution';
import ErrorRoute from './components/global/routes/ErrorRoute'
import { PrivateLandingRoute } from './components/global/routes/PrivateLandingRoute'
import EditAccount from './components/teacher/profile/EditProfile/EditAccount'

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
            <UserDataProvider>
            <NavBar/>
            </UserDataProvider>
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

              <Route exact path="/profile" element={    
                    <UserDataProvider>
                      <PrivateRoute role={role.T}>
                          <TeacherProfile />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />

              <Route exact path="/profile/edit" element={   
                    <UserDataProvider>
                      <PrivateRoute role={role.T}>
                          <EditAccount />
                      </PrivateRoute>   
                    </UserDataProvider>                     
                    }
              />


              <Route exact path="/summary" element={    
                    <UserDataProvider>
                      <PrivateRoute role={role.O}>
                          <OfficerSummary />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />

              <Route exact path="/surveyMaking" element={    
                    <UserDataProvider>
                      <PrivateRoute role={role.O}>
                          <OfficerSurveyMaking />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />

              <Route exact path="/surveyDistribution" element={    
                    <UserDataProvider>
                      <PrivateRoute role={role.O}>
                          <OfficerSurveyDistribution />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />


              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<LogIn/>}/>
              <Route path="/error" element={<ErrorRoute/>}/>
            </Routes>
          </AuthProvider>
        </Router>
  )
}

export default App