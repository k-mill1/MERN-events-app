import React, { useState } from 'react'
import './App.css'
import Card from 'react-bootstrap/Card'
import { ToastContainer, toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'

function Login(props) {
  const [signUp, cSignUp] = useState(false)
  const [disabled, cDisabled] = useState(false)

  const showSuccess = () => {
    toast.success("New user added")
  }

  const submitHandler = (e) => {
    if (signUp) { // sign up new user
      e.preventDefault();
      props.client.addUser(e.target.username.value, e.target.password.value)
      .then((response) => {
        cDisabled(false)
        showSuccess()
        cSignUp(false)
        resetInput() 
      })
      .catch(() => {
        alert('please fill in both the username and password')
        cDisabled(false)
        resetInput()
      })
    } else { // log in with existing user
    e.preventDefault()
    cDisabled(true)
    props.client.login(e.target.username.value, e.target.password.value)
      .then((response) => {
        cDisabled(false)
        props.loggedIn(response.data.token)
      })
      .catch(() => {
        alert('not a valid username or password')
        cDisabled(false)
        resetInput()
      })
    }
  }

  const resetInput = () => {
    document.getElementById('addLogin').reset()
  }

  const showSignUp = () => {
    if (signUp) {
      return <div className = 'account-sign-up'>Already have an account? <a href="#" className = 'purple-text' onClick = {() => {cSignUp(false); resetInput()}}> Log In</a></div>
    } else {
      return <div className = 'account-sign-up'>Don't have an account? <a href="#" className = 'purple-text'onClick = {() => {cSignUp(true); resetInput()}}> Sign Up</a></div>
    }
  }

  return (
    <div>
      <div className = 'd-flex justify-content-center'>
        <Card className = 'login-card' style = {{maxWidth: '30rem'}}>
          <Card.Header className = 'login-header large-header'>{signUp ? 'Sign Up' : 'Sign In'}</Card.Header>
          <Card.Body>
            <form onSubmit={(e) => submitHandler(e)} id = 'addLogin'>
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
                <button className = 'button-62' type = 'submit' disabled = {disabled}>
                  {' '}
                  {signUp ? 'Sign Up' : 'Sign In'}{' '}
                </button>
                <ToastContainer position = 'bottom-center' />
              </div>
              <br />
            </form>
            {showSignUp()}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Login
