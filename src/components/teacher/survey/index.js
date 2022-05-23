import React from 'react'
import { useLocation } from 'react-router-dom'

const Survey = () => {
  const location = useLocation();

  return (
    <div>
        <h1>Survey page</h1>
        <p>Survey ID: {location.state.questionID}</p>
    </div>
  )
}

export default Survey