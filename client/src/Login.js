import React, { useState } from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';

function Login(props) {
  const [disabled, cDisabled] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    cDisabled(true);
    props.client.login(e.target.username.value, e.target.password.value)
      .then((response) => {
        cDisabled(false)
        props.loggedIn(response.data.token)
      })
      .catch(() => {
        alert('an error occured please try again')
        cDisabled(false)
      })
  };

  return (
    <div>
    <div className = 'd-flex justify-content-center'>
    <Card className = 'login-card' style = {{maxWidth: '30rem'}}>
      <Card.Header className = 'login-header large-header'>Sign In</Card.Header>
      <Card.Body>
        <form onSubmit={(e) => submitHandler(e)}>
          <br />
          <input 
            className = 'login-field' 
            type = 'text' 
            name = 'username' 
            placeholder = 'Username' 
            disabled = {disabled} 
            autoComplete = 'off'
          />
          <br />
          <input 
            className = 'login-field' 
            type = 'password' 
            name = 'password' 
            placeholder = 'Password' 
            disabled = {disabled} 
            autoComplete = 'off'
          />
          <br />
          <br />
          <div className = 'login-button'>
            <button className = 'button-62' type='submit' disabled={disabled}>
              {' '}
              Sign In{' '}
            </button>
          </div>
          <br />
        </form>
      </Card.Body>
    </Card>
    </div>
    </div>
  );
}

export default Login;
