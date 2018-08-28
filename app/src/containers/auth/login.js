import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { asleep } from '../../helpers/tiny_helpers'
import { auth } from './firebase'



const getIdToken = async() => {
  let promise = new Promise(async(resolve, reject) => {
    auth.currentUser.getIdToken().then(function(idToken) {
    	return resolve(idToken)
    }).catch(function(error) {
      return resolve(error)
    })
  })
  return promise
}


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      idToken: null
    }
    this.getIdToken = this.getIdToken.bind(this)
  }
  async getIdToken() {
    const idToken = await getIdToken()
    this.setState({...this.state, idToken})
  }
  async componentDidMount () {
    if (auth.currentUser) this.getIdToken()
    auth.onAuthStateChanged(user => {
      console.log({user})
      this.setState({...this.state, user})
      if (user) this.getIdToken()
    })
  }
  render() {
    console.log(this.state)
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
            type="submit"
            onClick={(e) => {
              const emailAddress = window.$('#loginInfo input')[0].value
              const password = window.$('#loginInfo input')[1].value
              auth.signInWithEmailAndPassword(emailAddress, password).catch(function(error) {
              // Handle Errors here.
              const errorCode = error.code
              const errorMessage = error.message
              console.log({errorCode,errorMessage})
            })
            }}
          >
            Login
          </button>
        </div>
        <div className="input-group mb-3">
        <button className="btn btn-secondary btn-md"
          type="submit"
          onClick={(e) => {
            // only submits the form if the student info fields are valid and there are no unanswered questions and it was not already submitted
            const emailAddress = window.$('#loginInfo input')[0].value
            auth.sendPasswordResetEmail(emailAddress).then(function() {
              console.log('email sent!')
            }).catch(function(error) {
              console.log({error})
              // An error happened.
            })
          }}
        >Reset Password</button>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

export default connect(mapStateToProps,{})(Login)
