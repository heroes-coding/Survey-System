import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { asleep } from '../../helpers/tiny_helpers'
import { withRouter } from 'react-router-dom'
import { ADMIN, SIGN_UP } from '../../constants/routes'
import { signInWithEmailAndPassword, doPasswordReset } from './auth_functions'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null
    }
  }
  shouldComponentUpdate() {
    if (this.props.authUser) {
      this.props.history.push(ADMIN)
      return false
    }
    return true
  }
  render() {
    const { error } = this.state
    const { history } = this.props
    return (
      <form
        id="loginInfo"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="input-group mb-3">
          <div className="input-group-prepend"><span className="input-group-text">Email</span></div>
          <input type="email" className="form-control" placeholder="" required />
          <div className="input-group-prepend"><span className="input-group-text">Password</span></div>
          <input type="password" className="form-control" placeholder="Password" required />
          <button className="btn btn-secondary btn-md"
            onClick={(e) => {
              const emailAddress = window.$('#loginInfo input')[0].value
              const password = window.$('#loginInfo input')[1].value
              signInWithEmailAndPassword(emailAddress, password).then(authUser => {
                  this.props.history.push(ADMIN)
                }).catch(error => {
                  this.setState({ ...this.state, error })
                })
            }}
          >
            Login
          </button>
        </div>
        <span className="resetPassword"
          onClick={(e) => {
            // only submits the form if the student info fields are valid and there are no unanswered questions and it was not already submitted
            const emailAddress = window.$('#loginInfo input')[0].value
            doPasswordReset(emailAddress).then(() => {
              this.setState({ ...this.state, error: "Please check your email for a password reset email" })
            }).catch(error => {
              this.setState({ ...this.state, error })
            })
          }}
        >Forgot your password?  Type your email above and click here to reset your password</span>
        <span className="resetPassword"
          onClick={(e) => { history.push(SIGN_UP) }}
        >Need to register?  Click here to make a new account</span>

        { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
      </form>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  const { authUser, history } = ownProps
  return { surveyData, authUser, history }
}

export default withRouter(connect(mapStateToProps,{})(Login))
