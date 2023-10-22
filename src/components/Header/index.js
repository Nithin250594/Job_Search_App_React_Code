import Cookies from 'js-cookie'

import {withRouter, Link} from 'react-router-dom'

import './index.css'

const Header = props => {
  const {history} = props

  const clickLogout = () => {
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <div className="header-section">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>

      <ul className="route-links-list">
        <Link to="/" className="link-style">
          <li>
            <p className="route-text">Home</p>
          </li>
        </Link>

        <Link to="/jobs" className="link-style">
          <li>
            <p className="route-text">Jobs</p>
          </li>
        </Link>
        <li>
          <button type="button" className="logout-button" onClick={clickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
