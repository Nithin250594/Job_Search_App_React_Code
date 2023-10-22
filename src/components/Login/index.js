import {Component} from 'react'

import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorText: '',
    invalidLogin: false,
  }

  onChangeUserInput = event => this.setState({username: event.target.value})

  onChangePasswordInput = event => this.setState({password: event.target.value})

  onSubmitSuccessfully = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 7})

    history.replace('/')
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const loginApi = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginApi, options)
    const data = await response.json()
    console.log(data)

    if (response.ok === true) {
      this.onSubmitSuccessfully(data.jwt_token)
    } else {
      this.setState({invalidLogin: true, errorText: data.error_msg})
    }
  }

  render() {
    const {username, password, invalidLogin, errorText} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-route-bg">
        <form onSubmit={this.onClickLogin}>
          <div className="form-section">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
            <label htmlFor="username" className="input-label">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              value={username}
              placeholder="Username"
              className="input-text-box"
              onChange={this.onChangeUserInput}
            />
            <label htmlFor="password" className="input-label">
              PASSWORD
            </label>
            <input
              id="password"
              value={password}
              type="password"
              placeholder="Password"
              className="input-text-box"
              onChange={this.onChangePasswordInput}
            />
            <button type="submit" className="login-btn">
              Login
            </button>
            {invalidLogin ? <p className="error-text"> *{errorText} </p> : null}
          </div>
        </form>
      </div>
    )
  }
}

export default Login
