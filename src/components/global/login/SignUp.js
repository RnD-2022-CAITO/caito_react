//Sign up page
import {React, useEffect, useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../auth/Authentication';
import ErrorRoute from '../routes/ErrorRoute';
import {ReactComponent as Logo} from '../../../assets/logo.svg';
import app, {func, auth} from '../../../utils/firebase'


import './SignUp.css'
import { Divider } from '@blueprintjs/core';
let timer = null;
let sendEmailSecond = 60;
const SignUp = () => {
  const emailRef = useRef();
  const emailValidRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  //Retrive the sign up from context
  const { signUp, currentUser } = useAuth();

  //Input validation
  const [error, setError] = useState('');

  //Loading to sign up
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [sentValidEmail, setSentValidEmail] = useState(false);
  const [second, setSecond] = useState(sendEmailSecond);
  useEffect(() => {
    if (sentValidEmail) {
      timer = setInterval(() => {
        sendEmailSecond --;
        if (sendEmailSecond === 0) {
          setSentValidEmail(false);
          clearInterval(timer);
          sendEmailSecond = 60;
        }
        setSecond(sendEmailSecond);

      }, 1000);
    }
  }, [sentValidEmail]);
  useEffect(() => {
    return () => {
      clearInterval(timer);
    }
  }, []);
  const handleClickSendValidEmail = async () => {
    if (!sentValidEmail) {
      const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!emailRef.current.value || !re.test(emailRef.current.value)) {
        return alert("Please enter a valid email!");
      }
      setSentValidEmail(true);
      const sendEmail = func.httpsCallable('auth_triggers-sendEmailValidCode');
      await sendEmail({
        email: emailRef.current.value
      });
      alert("We have sent a email to you, please check!");
    }

  }

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


    setLoading(true);

    const user = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value
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
    // Save user information into the database
    app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
    const addTeacher = func.httpsCallable('teacher-addTeacher');
    try {
        const response = await addTeacher({
            firstName: user.firstName,
            lastName: user.lastName,
        });

        setLoading(false);

        if(!loading){
          navigate('/');
        }

        // window.location.reload();

    } catch (e) {
        console.error(e);
    }
  }

  return (
  <div className='container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h1 className='logo'>
          <Logo style={{width:'5em'}}/>
        </h1>
        <h2>Sign Up</h2>
        <div className={'form-item'}>
          <label className={'form-label'}  htmlFor='email'>Email</label>
          <input className={'form-control'} style={{width: '65%'}} id="email" type="email" ref={emailRef} required autoComplete='off'/>
          <button onClick={handleClickSendValidEmail} type={'button'} style={{width: '30%', marginLeft: '5%'}}>
            {!sentValidEmail && ('Send Code')}
            {sentValidEmail && (
              second + 's'
            )}
          </button>

        </div>
        <div className={'form-item'}>
          <label className={'form-label'}  htmlFor='email-valid'>Email Valid Code</label>
          <input ref={emailValidRef} className={'form-control'} id={'email-valid'}  type="text"required autoComplete='off'/>

        </div>

        <div className='form-item'>
          <label className='form-label' htmlFor='password'>Password</label>
          <input className={'form-control'} id='password' type="password" ref={passwordRef} required autoComplete='off'/>
        </div>

        <div className='form-item'>
          <label className='form-label' htmlFor='confirm-pass'> Confirm Password</label>
          <input className={'form-control'} id='confirm-pass' type="password" ref={passwordConfirmRef} required autoComplete='off'/>
        </div>

        <div className='form-item'>
          <label className='form-label' htmlFor='first-name'>First name</label>
          <input className={'form-control'} id='first-name' type="text" ref={firstNameRef} required autoComplete='off'/>
        </div>

        <div className='form-item'>
          <label className='form-label' htmlFor='last-name'>Last name</label>
          <input className={'form-control'} id='last-name' type="text" ref={lastNameRef} required autoComplete='off'/>

        </div>

        {error && <p className='error'>{error}</p>}
        <div className='btn-position'>
          <button className='auth-btn' disabled={loading} type="submit">
            {loading?<span>Creating user...</span> :<span>Sign up</span>}

          </button>
        </div>
        <Divider />
        <h5 style={{textAlign:'center'}}>If you're and officer in charge of creating profiling tasks, 
          <br> 
          </br>please &nbsp;
          <a href = "mailto: bcis.caito@gmail.com">contact us</a> &nbsp;
          or your administrator to provide you an account.</h5>
      </form>

      <div>
        <p style={{color:'white'}}>
          Already have an account?  &nbsp;
          <Link to="/login">
              Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp