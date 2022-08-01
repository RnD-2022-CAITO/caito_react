//Sign up page
import {React, useRef, useState} from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../auth/Authentication';
import ErrorRoute from '../routes/ErrorRoute';
import {ReactComponent as Logo} from '../../../assets/logo.svg';

import './SignUp.css'

const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const schoolRef = useRef();

  //Retrive the sign up from context
  const { signUp, currentUser } = useAuth();

  //Input validation
  const [error, setError] = useState('');

  //Loading to sign up
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    setError(''); //All inputs are correct
    setLoading(true);

    //Input validation
    if(passwordRef.current.value !== passwordConfirmRef.current.value){
        setLoading(false);
        return setError('Passwords don\'t match');
        //exit the function
    }

    if(!firstNameRef.current.value.match(/^[A-Za-z]+$/)){
      setLoading(false);
      return setError('First name should contain alphabetical letters only.');
    }

    if(!lastNameRef.current.value.match(/^[A-Za-z]+$/)){
      setLoading(false);
      return setError('Last name should contain alphabetical letters only.');
    }

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      school: schoolRef.current.value
    }
    try{
      await signUp(user);
    }catch(err){ 
      setLoading(false);
      console.log(err.code);
      switch(err.code){
        case 'auth/email-already-in-use':
          return setError('Email has been used, try another one');
        case 'auth/weak-password':
          return setError('Password is too weak. Try adding more characters!');
        default:
          return setError('Something is wrong... please try again later');
      }
    }

    navigate('/');
  }

  return (
  !currentUser ?
  <div className='container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h1 className='logo'>
          <Logo style={{width:'5em'}}/>
        </h1>
        <h2>Sign Up</h2>
        <div className='input-field'>
          <input id="email" type="email" ref={emailRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='email'>Email</label>

        </div>

        <div className='input-field'>
          <input id='password' type="password" ref={passwordRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='password'>Password</label>
        </div>

        <div className='input-field'>
          <input id='confirm-pass' type="password" ref={passwordConfirmRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='confirm-pass'> Confirm Password</label>
        </div>

        <div className='input-field'>
          <input id='first-name' type="text" ref={firstNameRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='first-name'>First name</label>
        </div>

        <div className='input-field'>
          <input id='last-name' type="text" ref={lastNameRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='last-name'>Last name</label>
        </div>

        <div className='input-field'>
        {/* <input id='school-name' type="select" ref={schoolRef} /> */}
          {/* <a>Graduate School</a> */}
            <input id='school-namex' type="text" list="schoollist" ref={schoolRef}/>
            <label className='control-label' htmlFor='school-name'>School name</label>
            <datalist id="schoollist">
                <option>Tribhuvan University(TU)</option>
                <option>Nepal Sanskrit University(NSU)</option>
            </datalist>
          </div>


        {error && <p className='error'>{error}</p>}
        <div className='btn-position'>
          <button className='auth-btn' disabled={loading} type="submit">
            {loading?<span>Creating user...</span> :<span>Sign up</span>}

          </button>
        </div>
      </form>

      <div>
        <p>
          Already have an account?  &nbsp;
          <Link to="/login">
              Log in
          </Link>
        </p>
      </div>
    </div>
    : <ErrorRoute err='already-login'/>
  )
}

export default SignUp