//Sign up page
import {React, useEffect, useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../auth/Authentication';
import {ReactComponent as Logo} from '../../../assets/logo.svg';
import app, {func} from '../../../utils/firebase'
import { Divider } from '@blueprintjs/core';

import './SignUp.css';

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
  const { signUp } = useAuth();

  const [emailSave, setemailSave] = useState('');

  //Input validation
  const [error, setError] = useState('');

  //Loading to sign up
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const Steps = {
    ValidEmail: 'ValidEmail',
    FillData: 'FillData'
  }
  const [step, setStep] = useState(Steps.ValidEmail);
  const [sentValidEmail, setSentValidEmail] = useState(false);
  const [second, setSecond] = useState(sendEmailSecond);
  
  //set timer to reuse the button
  useEffect(() => {
    if (sentValidEmail) {
      timer = setInterval(() => {
        sendEmailSecond --;
        if (sendEmailSecond === 0) {
          setSentValidEmail(false);
          setError('');
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

  //check and send the email
  const handleClickSendValidEmail = async () => {
    if (!sentValidEmail) {
      const re =
        // eslint-disable-next-line no-useless-escape
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if (!emailRef.current.value || !re.test(emailRef.current.value)) {
        return setError("Please enter a valid email!");
      }
      app.appCheck().activate(process.env.REACT_APP_SITE_KEY, true);
      const sendEmail = func.httpsCallable('auth_triggers-sendEmailValidCode');
      const res = await sendEmail({
        email: emailRef.current.value
      });
      console.log(res)
      setSentValidEmail(true);
      setError("We have sent a email to you, please check!");

    }

  }

  //check the email vaild code
  const handleCheckEmailCode = async () => {
    const emailValidCode = emailValidRef.current.value;
    const email = emailRef.current.value;
    const checkEmailCode = func.httpsCallable('auth_triggers-checkEmailValidCode');
    const checkRes = await checkEmailCode({
      code: emailValidCode,
      email
    });
    setError('');
    setemailSave(email);
    if (!checkRes.data.emailValidPass) {
     return setError('Email validation code is incorrect!');
    }
    setStep(Steps.FillData);
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
      email: emailSave,
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
          setStep(Steps.ValidEmail);
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
        await addTeacher({
            firstName: user.firstName,
            lastName: user.lastName,
        });

        setLoading(false);

        if(!loading){
          navigate('/');

          //reload the window
          window.location.reload();
        }

    } catch (e) {
    }
  }

  return (
  <div className='container'>
      <form className='sign-up-form' onSubmit={handleSubmit}>
        <h1 className='logo'>
          <Logo style={{width:'5em'}}/>
        </h1>
        <h2>Sign Up</h2>
        {step === Steps.ValidEmail && (
          <>
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
              <label className={'form-label'}  htmlFor='email-valid'>Email Validation Code</label>
              <input ref={emailValidRef} className={'form-control'} id={'email-valid'}  type="text"required autoComplete='off'/>

            </div>
          </>
        )}

        {step === Steps.ValidEmail && (
          <button type={'button'} onClick={handleCheckEmailCode}>NEXT</button>
        )}

        {step === Steps.FillData && (
          <>
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
          </>
        )}

        {error && <p className='error'>{error}</p>}
        {step === Steps.FillData && (
          <div className='btn-position'>
            <button className='auth-btn' disabled={loading} type="submit">
              {loading?<span>Creating user...</span> :<span>Sign up</span>}

            </button>
          </div>
        )}

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