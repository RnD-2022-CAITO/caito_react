import React from 'react'
import { Link } from 'react-router-dom';

const AccountInfo = (props) => {
    const {user, data} = props;

    return (
        <div className='profile-section'>
            <h3>{data.firstName} {data.lastName}</h3>
            <h4>Industry Sector:  {data.sector}</h4>
            <h5 style={{textTransform:'capitalize'}}>{data.role}</h5>
            <p>Email: {user.email}</p>
            <Link to='/edit-password'>
            <button className='edit-btn'> 
                Change password
            </button>
            </Link>

            <Link to='/EditSchool'>
            <button className='edit-btn'> 
                Change School
            </button>
            <br></br>
           
           {/* button for more information */}
            </Link>

        </div>
    )
}

export default AccountInfo