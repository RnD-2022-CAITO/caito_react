import React, { useState } from 'react'
import { useAuth } from './auth/Authentication'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
   // eslint-disable-next-line
  const [error, setError] = useState('');

  const {currentUser,  signOut} = useAuth();

  const navigate = useNavigate();

  const handleLogOut = async () => {

    try {
        await signOut();
        navigate('/login');
    }catch{
        setError('Something went wrong..');
    }
  }

  return (
    <div>
      <h1>Landing page</h1>
      <p>{currentUser.email}</p>
      <button onClick={handleLogOut}>
        Log out
      </button>
    </div>
  )
}

export default Landing