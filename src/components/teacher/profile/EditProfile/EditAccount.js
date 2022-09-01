import React, { useRef, useState } from 'react'
import { useAuth } from '../../../global/auth/Authentication';
import { useNavigate } from 'react-router-dom';

import "./EditAccount.css"

const EditAccount = () => {
    const oldPasswordRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const { updatePassword } = useAuth();

    //Input validation
    const [error, setError] = useState('');

    //Loading to sign up
    const [loading, setLoading] = useState(false);

    //Navigate the user 
    const navigate = useNavigate();


    const handleSubmit = e => {
        e.preventDefault();
        console.log(passwordRef);
        //Input validation
        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setError('Passwords don\'t match');
            //exit the function
        } else if(passwordRef.current.value.length < 6){
            return setError('Weak password.');
        }

        const promises = [];
        setLoading(true);
        setError("");

        if(passwordRef.current.value){
            promises.push(updatePassword(oldPasswordRef.current.value,passwordConfirmRef.current.value))
        }

        Promise.all(promises)
        .then(()=>{
            window.alert('Success');
            navigate('/profile');
        })
        .catch((e) => {
            console.log(e.code)
            switch(e.code){
                case 'auth/requires-recent-login':
                    setError('Please log in and try again');
                    break;
                case 'auth/wrong-password':
                    setError('Wrong old password.');
                    break;
                default:
                    setError('Unable to update password')
            }
        })
        .finally(() => {
            setLoading(false)
        });

    }

    return (
        <div className='container light'>
            <form className='edit-acc-form' onSubmit={handleSubmit}>
                <h1 style={{textAlign:'center'}}>Account Management</h1>

                <div className='input-field'>
                    <input type='password' ref={oldPasswordRef} required/>
                    <label>Old Password</label>
                </div>


                <div className='input-field'>
                    <input type='password' ref={passwordRef} required/>
                    <label>New Password</label>
                </div>

                <div className='input-field'>
                    <input type='password' ref={passwordConfirmRef} required/>
                    <label>Confirm new password</label>
                </div>

                <div>
                    {error && <p className='error'>{error}</p>}
                </div>

                <div>
                    <button disabled = {loading } className='edit-submit' type="submit">Confirm</button>
                </div>
            </form>
        </div>
    )
}

export default EditAccount