import { useState } from 'react'
import Cookies from 'js-cookie'
import { Redirect, withRouter } from 'react-router-dom'

import './index.css'

const LoginForm = (props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loginForm, setLoginForm] = useState(true)
  const [createUsername, setCreateUsername] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [showSubmitErrorOfCreateAccount, setShowSubmitErrorOfCreateAccount] = useState(false) 

  const onChangeUsername = event => {
    setUsername(event.target.value)
  }

  const onChangePassword = event => {
    setPassword(event.target.value)
  }

  const onChangecrUsername = event => {
    setCreateUsername(event.target.value)
  }

  const onChangecrEmail = event => {
    setCreateEmail(event.target.value)
  }

  const onChangecrPassword = event => {
    setCreatePassword(event.target.value)
  }

  const onSubmitSuccess = jwtToken => {
    const { history } = props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  const onSubmitFailure = msg => {
    setShowSubmitError(true)
    setErrorMsg(msg)
  }

  const onSubmitCreateAccountSuccess = () => {
    props.history.replace("/login")
    setLoginForm(true)
    setShowSubmitErrorOfCreateAccount(false);
    setErrorMsg(''); 
  }

  const onSubmitCreateAccountFailure = msg => {
    setShowSubmitErrorOfCreateAccount(true)
    setErrorMsg(msg)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = { username, password }
    const url = 'http://localhost:5000/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  const onSubmitCreateAccount = async (event) => {
    event.preventDefault()
    const userDetails = { username: createUsername, email: createEmail, password: createPassword }
    const url = "http://localhost:5000/register"
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      onSubmitCreateAccountSuccess()
    } else {
      onSubmitCreateAccountFailure(data.error_msg)
    }
  }

  const renderPasswordField = () => {
    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  const renderUsernameField = () => {
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  const onClickCreateAccount = (event) => {
    event.preventDefault()
    setLoginForm(false)
    setShowSubmitError(false); // Clear login error when switching to create account
    setErrorMsg(''); // Clear error message
  }

  const onClickLoginAccount = (event) => {
    event.preventDefault()
    setLoginForm(true)
    setShowSubmitErrorOfCreateAccount(false); // Clear create account error when switching to login
    setErrorMsg(''); // Clear error message
  }

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div>
      <div className="login-form-container">
        <img
          src="img/e_cart_logo.png"
          className="login-website-logo-mobile-image"
          alt="website logo"
        />
        <img
          src="img/Login_page_image.png"
          className="login-image"
          alt="website login"
        />
        <div>
          {/* Main login form */}
          {loginForm && (
            <form className="login-form-container-desktop" onSubmit={submitForm}>
              <img
                src="img/e_cart_logo.png"
                className="login-website-logo-desktop-image"
                alt="website logo"
              />
              <div className='abcd'>
                <h1 className='login-page-heading'>Login</h1>
                <div className="input-container">
                  {renderUsernameField()}
                </div>
                <div className="input-container">
                  {renderPasswordField()}
                </div>
                <button type="submit" className="login-button">
                  Login
                </button>
                <div className='forgot-pass-container'>
                  <button className='create-account' type='button'><p>Forgot Password</p></button>
                </div>
                {showSubmitError && <p className="error-message">*{errorMsg}</p>}
              </div>
            </form>
          )}

          {/* Create account form */}
          {!loginForm && (
            <form onSubmit={onSubmitCreateAccount} className='form-container'>
              <img
                src="img/e_cart_logo.png"
                className="login-website-logo-desktop-image"
                alt="website logo"
              />
              <div className='dcba'>
                <h1 className='login-page-heading'>Create Account</h1>
                <>
                  <label className="input-label" htmlFor='crUsername'>
                    Username
                  </label><br />
                  <input type='text' placeholder='Enter Username' className='username-input-field' id='crUsername' onChange={onChangecrUsername} value={createUsername} />
                  <br />
                  <label className="input-label" htmlFor='crEmail'>
                    Email
                  </label><br />
                  <input type='mail' placeholder='Enter Email' className='username-input-field' id='crEmail' onChange={onChangecrEmail} value={createEmail} />
                  <br />
                  <label className="input-label" htmlFor='crPassword'>
                    Password
                  </label><br />
                  <input type='password' placeholder='Enter Password' className='username-input-field' id='crPassword' onChange={onChangecrPassword} value={createPassword} /><br />
                  <button type="submit" className="login-button">
                    Register
                  </button>
                  {showSubmitErrorOfCreateAccount && <p className="error-message">*{errorMsg}</p>}
                </>
              </div>
            </form>
          )}

          {/* Toggle buttons for Login/Create Account */}
          {loginForm && (
            <form className='account-creation' onSubmit={onClickCreateAccount}>
              <button className='create-account' type='submit'><p>Don't have account? Create Account</p></button>
            </form>
          )}
          {!loginForm && (
            <form className='account-creation' onSubmit={onClickLoginAccount}>
              <button className='create-account' type='submit'><p>Already have account? Login</p></button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(LoginForm)