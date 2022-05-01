//Sign up page
import {React, useRef, useState} from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../auth/Authentication';
import {db} from '../../../utils/firebase'


const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();

  //Retrive the sign up from context
  const { signUp } = useAuth();

  //Input validation
  const [error, setError] = useState('');

  //Loading to sign up
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async e => {
      e.preventDefault();

      //Input validation
      if(passwordRef.current.value !== passwordConfirmRef.current.value){
          return setError('Passwords don\'t match');
          //exit the function
      } else if(passwordRef.current.value.length < 6){
          return setError('Weak password.');
      }

      try{
          setError(''); //All inputs are correct
          setLoading(true);

          const user = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value
          }
          
          await signUp(user);

          navigate('/');
      } catch (error) {
          //Email in use
          console.log(error.code, ':', error.message);
          setError('This email has already been in used.')
      }

      setLoading(false);
  }

  return (
    <div>
      <h1>enlight</h1>
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>Email
          <input type="email" ref={emailRef} required/>
        </div>

        <div>Password
          <input type="password" ref={passwordRef} required/>
        </div>

        <div>Confirm Password
          <input type="password" ref={passwordConfirmRef} required/>
        </div>

        <div>First name
          <input type="text" ref={firstNameRef} required/>
        </div>

        <div>Last name
          <input type="text" ref={lastNameRef} required/>
        </div>

        <button disabled={loading} type="submit">
          Create
        </button>
      </form>

      <div>
        Already have an account? 
        <Link to="/login">
            Log in
        </Link>
      </div>
    </div>
  )
}

export default SignUp