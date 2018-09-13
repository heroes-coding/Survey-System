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

import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as styles from './style.css'
import { Redirect, BrowserRouter, Route, Switch, withRouter } from 'react-router-dom'

class App extends Component {
  async componentDidMount () {
    window.axios = axios
    let result = await axios.get(`/test`)
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
