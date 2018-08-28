import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { passwordIsStrong } from '../../helpers/tiny_helpers'
import { createUserWithEmailAndPassword, verifyEmail } from './auth_functions';
import { SIGN_UP, LOGIN } from '../../constants/routes';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
  disabled: false
}

const validatePassword = () => {
  const document = window.document
  const pass1 = document.getElementById("password1").value
  const pass2 = document.getElementById("password2").value
  // Consider a
  if (!passwordIsStrong(pass1)) {
    document.getElementById("password1").setCustomValidity("Password must be at least 8 characters long, and contain at least one upper & lower case character, one number, and a special character (*/#/$/%/@)")
  } else if (pass1 != pass2) {
    document.getElementById("password1").setCustomValidity('')
    document.getElementById("password2").setCustomValidity("Passwords don't Match")
  }
}

const byPropKey = (propertyName, value) => () => {
  // This resetting is a bit hacky, but I can't see another way to work around it
  window.document.getElementById("password1").setCustomValidity('')
  window.document.getElementById("password2").setCustomValidity('')
  return { [propertyName]: value, }
}

class SignUpForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_STATE }
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentDidMount() {
    window.document.getElementsByName("signup")[0].onclick = validatePassword
  }
  onSubmit = (event) => {
    const { history } = this.props
    const { username, email, passwordOne } = this.state
    this.setState(byPropKey('disabled', true))
    createUserWithEmailAndPassword(email,passwordOne)
      .then(authUser => {
        verifyEmail().then(function() {
          history.push(LOGIN)
        }).catch(function(error) {
          this.setState(byPropKey('error', error))
          this.setState(byPropKey('disabled', false))
        })
      })
      .catch(error => {
        this.setState(byPropKey('error', error))
        this.setState(byPropKey('disabled', false))
      })
    event.preventDefault()
  }

  render() {
    const { username, email, passwordOne, passwordTwo, error, disabled } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <div className="input-group mb-3">
          <input
            value={username}
            onChange={event => this.setState(byPropKey('username', event.target.value))}
            type="text"
            className="form-control"
            placeholder="Full Name"
            required
          />
          <input
            value={email}
            onChange={event => this.setState(byPropKey('email', event.target.value))}
            type="email"
            className="form-control"
            placeholder="Email Address"
            required
          />
          <input
            value={passwordOne}
            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            id="password1"
            className="form-control"
            placeholder="Password"
            required
          />
          <input
            value={passwordTwo}
            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            id="password2"
            className="form-control"
            placeholder="Confirm Password"
            required
          />
          <button disabled={disabled} className ="btn btn-secondary btn-md" type="submit" name="signup">
            Sign Up
          </button>
        </div>
        { error && <div className="alert alert-primary" role="alert">{error.message}</div> }
      </form>

    )
  }
}

const SignUpLink = () =>
  <p>
    Dont have an account?
    <Link to={SIGN_UP}>Sign Up</Link>
  </p>


const SignUpPage = ({ history }) => <SignUpForm history={history}/>
export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
}
