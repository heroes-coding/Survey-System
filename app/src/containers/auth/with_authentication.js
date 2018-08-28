import React from 'react'
import { auth } from './firebase'
import AuthUserContext from './auth_user_context'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        authUser: null,
      }
    }
    componentDidMount() {
      auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null })
      })
    }
    render() {
      const { authUser } = this.state;
      return (
        <AuthUserContext.Provider value={authUser}>
          <Component authUser={authUser} />
        </AuthUserContext.Provider>
      )
    }
  }

  return WithAuthentication
}

export default withAuthentication
