import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import Survey from './containers/survey/survey'
import Login from './containers/auth/login'
import PasswordForgetPage from './containers/auth/password_forget'
import SignUp from './containers/auth/sign_up'
import Admin from './containers/admin/admin'
import * as routes from './constants/routes'
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
    const { authUser } = this.props
    return (
      <div className='container-fluid' >
          <div className="row">
            <div className="bannerHolder">
              <img className="banner" src="banner.png" />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 col-xl-2"></div>
            <div className='col-sm-12 col-lg-10 col-xl-8' id="contentHolder">
            <Switch>
              <Route
                path={routes.LOGIN}
                render={(props) => <Login {...props} authUser={authUser} />}
              />
              <Route
                path={routes.ADMIN}
                render={(props) => <Admin {...props} authUser={authUser} />}
              />
              <Route
                path={routes.PASSWORD_FORGET}
                render={(props) => <PasswordForgetPage {...props} authUser={authUser} />}
              />
              <Route
                path={routes.SIGN_UP}
                render={(props) => <SignUp {...props} authUser={authUser} />}
              />
              {/* <Route path="/players/:id" component={PlayerPage} /> */}
              <Route
                path="/"
                render={(props) => <Survey {...props} authUser={authUser} />}
              />
            </Switch>
            <div className="col-lg-1 col-xl-2"></div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  const { authUser } = ownProps
  return { surveyData, authUser }
}

export default withAuthentication(withRouter(connect(mapStateToProps, {})(App)))
