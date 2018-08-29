import React from 'react'
import { auth } from './firebase'
import AuthUserContext from './auth_user_context'
import { getIdToken } from './auth_functions'
import { updateUserInfo } from '../../actions'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
        idToken: null
      }
    }
    componentDidMount() {
      auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null, idToken: null })
        if (authUser) {
          getIdToken().then((idToken) => {
            this.setState({ ...this.state, idToken })
          }).catch((error) => {
            console.log("Couldn't get idToken",error)
          })
        }
      })
    }
    render() {
      const { authUser, idToken } = this.state
      return (
        <AuthUserContext.Provider value={ {authUser,idToken} }>
          <Component authUser={authUser} idToken={idToken} />
        </AuthUserContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
