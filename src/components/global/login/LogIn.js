//Log in page
import {React, useRef, useState} from 'react' 
import { useAuth } from '../auth/Authentication'
import { Link, useNavigate } from 'react-router-dom';
import ErrorRoute from '../routes/ErrorRoute';
import {ReactComponent as Logo} from '../../../assets/logo.svg';

import './Login.css'


const LogIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  //Retrive the sign up from context
  const { signIn, currentUser } = useAuth();
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  //Input validation
  const [error, setError] = useState('');

  //Loading to sign up
  const [loading, setLoading] = useState(false);

  //Get the routes
  const navigate = useNavigate();


  const handleSubmit = async e => {
      e.preventDefault();


      try{
          setError(''); //All inputs are correct
          setLoading(true);
          await signIn(emailRef.current.value, passwordRef.current.value);

          //redirect to home page
          navigate('/');
      } catch (e){
          switch(e.code){
            case 'auth/user-not-found':
              setError('Email has not been used yet');
              break;
            default:
              setError('Email or password are incorrect.');
          }
          console.log(e.code);
      }

      setLoading(false);
  }
      
  return (
  !currentUser ?
  <div className='container'>
      <form className='sign-in-form' onSubmit={handleSubmit}>
        <h1 className='logo'>
          <Logo style={{width:'5em'}}/>
        </h1>
        <h2>Log In</h2>
        <div className='input-field'>
          <input id='email' type = 'email' ref={emailRef} required autoComplete='off'/>
          <label className='control-label' htmlFor='email'>Email</label>
        </div>

        <div className='input-field'>
          <input id='password' type = {isPasswordShown ? "password" : "txt"} ref={passwordRef}  required autoComplete='off'/>
          <img className='eye-icon' id = 'eye-shown'src= {isPasswordShown? './closeEye.JPG': './eye.JPG'} alt = ""
          onClick={() => setIsPasswordShown(!isPasswordShown)}/>
          <label htmlFor='password'>Password</label>
          </div>
        <div className='error'>{error}</div>

        <div className='btn-position'>
          <button className='auth-btn' disabled = {loading} type="submit">Log in</button>
        </div>
      </form>

      <div>
        <p style={{color:'white'}}>
                Don't have an account? &nbsp;
                <Link to="/signup">
                     Sign Up
                </Link>
        </p>
      </div>
    </div> 
    : <ErrorRoute err='already-login'/>
  )
}

export default LogIn