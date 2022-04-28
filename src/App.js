//Routes 
import React from 'react'
import LogIn from './components/global/login/LogIn'
import SignUp from './components/global/login/SignUp'
import Landing from './components/global/Landing'
import { AuthProvider } from './components/global/auth/Authentication'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { PrivateRoute } from './components/global/routes/PrivateRoute'

const App = () => {
  return (
        <BrowserRouter>
          <AuthProvider>
            <Routes>
             {/* Private routes for teacher/officer should be like this: */}
              <Route exact path="/" element={    
                    <PrivateRoute>
                      <Landing />
                    </PrivateRoute>}
              />

              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/login" element={<LogIn/>}/>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
  )
}

export default App