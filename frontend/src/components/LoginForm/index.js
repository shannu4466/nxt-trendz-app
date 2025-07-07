import { Component } from 'react'
import Cookies from 'js-cookie'
import { Redirect } from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    loginForm: true,
    createUsername: '',
    createEmail: '',
    createPassword: '',
    showSubmitErrorofCreateAccount: ''
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  onChangecrUsername = event => {
    this.setState({ createUsername: event.target.value })
  }

  onChangecrEmail = event => {
    this.setState({ createEmail: event.target.value })
  }

  onChangecrPassword = event => {
    this.setState({ createPassword: event.target.value })
  }

  onSubmitSuccess = jwtToken => {
    const { history } = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg })
  }

  onSubmitCreateAccountSuccess = () => {
    this.props.history.replace("/login")
    this.setState({ loginForm: true })
  }

  onSubmitcreateAccountFailure = errorMsg => {
    this.setState({ showSubmitErrorofCreateAccount: true, errorMsg })
  }

  submitForm = async event => {
    event.preventDefault()
    const { username, password } = this.state
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
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onSubmitCreateAccount = async (event) => {
    event.preventDefault()
    const { createUsername, createEmail, createPassword } = this.state
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
      this.onSubmitCreateAccountSuccess(data.jwt_token)
    } else {
      this.onSubmitcreateAccountFailure(data.error_msg)
    }
  }

  renderPasswordField = () => {
    const { password } = this.state
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
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  renderUsernameField = () => {
    const { username } = this.state
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
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  onClickCreateAccount = async (event) => {
    event.preventDefault()
    this.setState({ loginForm: false })
  }

  onClickLoginAccount = async (event) => {
    event.preventDefault()
    this.setState({ loginForm: true })
  }

  render() {
    const { showSubmitError, showSubmitErrorofCreateAccount, errorMsg, loginForm, createUsername, createEmail, createPassword } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div>
        <div className="login-form-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-mobile-image"
            alt="website logo"
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
            className="login-image"
            alt="website login"
          />
          <div>
            <form className="login-form-container-desktop" onSubmit={this.submitForm}>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                className="login-website-logo-desktop-image"
                alt="website logo"
              />
              {loginForm && (
                <div className='abcd'>
                  <h1 className='login-page-heading'>Login</h1>
                  <div className="input-container">
                    {this.renderUsernameField()}
                  </div>
                  <div className="input-container">
                    {this.renderPasswordField()}
                  </div>
                  <button type="submit" className="login-button">
                    Login
                  </button>
                  <div className='forgot-pass-container'>
                    <button className='create-account' type='button'><p>Forgot Password</p></button>
                  </div>
                  {showSubmitError && <p className="error-message">*{errorMsg}</p>}
                </div>
              )}
            </form>
            <form onSubmit={this.onSubmitCreateAccount} className='form-container'>
              {!loginForm && (
                <div className='dcba'>
                  <h1 className='login-page-heading'>Create Account</h1>
                  <>
                    <label className="input-label" htmlFor='crUsername'>
                      Username
                    </label><br />
                    <input type='text' placeholder='Enter Username' className='username-input-field' id='crUsername' onChange={this.onChangecrUsername} value={createUsername} />
                    <br />
                    <label className="input-label" htmlFor='crEmail'>
                      Email
                    </label><br />
                    <input type='mail' placeholder='Enter Email' className='username-input-field' id='crEmail' onChange={this.onChangecrEmail} value={createEmail} />
                    <br />
                    <label className="input-label" htmlFor='crPassword'>
                      Password
                    </label><br />
                    <input type='password' placeholder='Enter Password' className='username-input-field' id='crPassword' onChange={this.onChangecrPassword} value={createPassword} /><br />
                    <button type="submit" className="login-button">
                      Register
                    </button>
                    {showSubmitErrorofCreateAccount && <p className="error-message">*{errorMsg}</p>}
                  </>
                </div>
              )}
            </form>
            {loginForm && (
              <form className='account-creation' onSubmit={this.onClickCreateAccount}>
                <button className='create-account' type='submit'><p>Don't have account? Create Account</p></button>
              </form>
            )}
            {!loginForm && (
              <form className='account-creation' onSubmit={this.onClickLoginAccount}>
                <button className='create-account' type='submit'><p>Already have account? Login</p></button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
