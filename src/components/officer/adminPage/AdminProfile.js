import { Button, Classes } from '@blueprintjs/core'
import React from 'react'

export const AdminProfile = ({userData, currentUser, navigate}) => {
  return (
    <div className='admin-item profile'>
    <div style={{ textAlign: 'center' }}>
      <img
        className='admin-image'
        src="https://freerangestock.com/sample/120140/business-man-profile-vector.jpg"
        alt="profile pic" />
    </div>
    <h2>
      {userData &&
        userData.firstName + ' ' + userData.lastName}
    </h2>
    <h3>
      <Button icon="envelope" className={Classes.MINIMAL}></Button>
      {currentUser.email}</h3>
    <br></br>
    <hr></hr>
    <br></br>
    <button onClick={() => navigate('/edit-password')}>Change password</button>
  </div>
  )
}
