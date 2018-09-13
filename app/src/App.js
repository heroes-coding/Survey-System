import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import Survey from './containers/survey/survey'
import Login from './containers/auth/login'
import PasswordForgetPage from './containers/auth/password_forget'
import SignUp from './containers/auth/sign_up'
import Dashboard from './containers/dashboard/dashboard'
import { DASHBOARD, SIGN_UP, LOGIN, PASSWORD_FORGET } from './constants/routes'
import withAuthentication from './containers/auth/with_authentication'
import DropDown from './components/drop_down'

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as styles from './style.css'
import { Redirect, BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'

class App extends Component {
  async componentDidMount () {
    window.axios = axios
    let result = await axios.get(`/test`)
  }
  constructor(props) {
    super(props)
    this.state = {
      font: 'Default'
    }
  }
  render() {
    const { authUser, idToken } = this.props
    return (
      <div className='container-fluid' >
          <div className="row">
            <div className="bannerHolder">
              <img className="banner" src="/banner.png" />
            </div>
          </div>
          <DropDown
            currentSelection={""}
            name={`Select Font (is not permanent) - Current Selection - ${this.state.font}`}
            id='surveySelector'
            dropdowns={[
              'Oswald,sans-serif',
              'Roboto Condensed, sans-serif',
              'Lato,sans-serif',
              'Magra,sans-serif',
              'Noto Serif KR,sans-serif',
              'Montserrat,sans-serif',
              'Mukta Malar,sans-serif',
              'Titillium Web,sans-serif',
              'Fira Sans,sans-serif',
              'Inconsolata,sans-serif',
              'Cabin,sans-serif',
              'Karla,sans-serif',
              'Libre Franklin,sans-serif',
            ]}
            updateFunction={(font) => {
              this.setState({... this.state, font })
              window.document.getElementsByTagName("body")[0].style.fontFamily = font
            }}
            renderDropdownName={true}
            currentID={0}
          />
          <div className="row">
            <div className='col'>
            <Switch>
              <Route
                path={LOGIN}
                render={(props) => <Login {...props} authUser={authUser} idToken={idToken} />}
              />
              <Route
                path={DASHBOARD}
                render={(props) => <Dashboard {...props} authUser={authUser} idToken={idToken} />}
              />
              <Route
                path={PASSWORD_FORGET}
                render={(props) => <PasswordForgetPage {...props} authUser={authUser} idToken={idToken} />}
              />
              <Route
                path={SIGN_UP}
                render={(props) => <SignUp {...props} authUser={authUser} idToken={idToken} />}
              />
              <Route
                path="/surveys/:id"
                render={(props) => <Survey {...props} authUser={authUser} idToken={idToken} />}
              />
              <Route
                path="/"
                render={(props) => <Survey {...props} authUser={authUser} idToken={idToken} />}
              />
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  const { authUser, idToken } = ownProps
  return { surveyData, authUser, idToken }
}

export default withAuthentication(withRouter(connect(mapStateToProps, {})(App)))
