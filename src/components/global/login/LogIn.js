//Log in page
import {React, useRef, useState} from 'react' 
import { useAuth } from '../auth/Authentication'
import { Link, useNavigate } from 'react-router-dom';


const LogIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  //Retrive the sign up from context
  const { signIn } = useAuth();

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
    <div>
      <h1>enlight</h1>
      <h2>log in</h2>

      <div>{error}</div>

      <form onSubmit={handleSubmit}>
        <div>
          Email
          <input type = 'email' ref={emailRef} required/>
        </div>

        <div>
          Password
          <input type = 'password' ref={passwordRef} required/>
        </div>

        <button disabled = {loading} type="submit">Log in</button>
      </form>

      <div>
                Don't have an account?
                <Link to="/signup">
                     Sign Up
                </Link>
      </div>
    </div>
  )
}

export default LogIn