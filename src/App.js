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


//styling
import './global.css'
import NavBar from './components/global/navigation'
import OfficerSummary from './components/officer/analysis'

// const currentPath = (location) => {
//   switch(location){
//     case '/':
//       return true;
//     default:
//       return false;
//   }
// }

const App = () => {

  return (
        <Router>
          <AuthProvider>
            <NavBar/>
            <Routes>
             {/* Private routes for teacher/officer should be like this: */}
              <Route exact path="/" element={    
                    <PrivateRoute>
                      <UserDataProvider>
                        <Landing />
                      </UserDataProvider>
                    </PrivateRoute>}
              />

              <Route exact path="/profile" element={    
                    <UserDataProvider>
                      <PrivateRoute>
                          <TeacherProfile />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />


              <Route exact path="/summary" element={    
                    <UserDataProvider>
                      <PrivateRoute>
                          <OfficerSummary />
                      </PrivateRoute>
                    </UserDataProvider>
                    }
              />


              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<LogIn/>}/>
            </Routes>
          </AuthProvider>
        </Router>
  )
}

export default App