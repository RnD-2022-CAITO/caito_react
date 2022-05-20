import React from 'react'
import { Link } from 'react-router-dom';

const AccountInfo = (props) => {
    const {user, data} = props;

    return (
        <div className='profile-section'>
            <h3>{data.firstName} {data.lastName}</h3>
            <h5 style={{textTransform:'capitalize'}}>{data.role}</h5>
            <p>Email: {user.email}</p>
            <Link to='/profile/edit'>
            <button className='edit-btn'> 
                Change password
            </button>
            <br></br>
           
           {/* button for more information */}
            </Link>

        </div>
    )
}

export default AccountInfo