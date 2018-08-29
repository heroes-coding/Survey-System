import React from 'react'
import { withRouter } from 'react-router-dom'
import AuthUserContext from './auth_user_context'
import { auth} from './firebase'
import { LOGIN } from '../../constants/routes'

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      auth.onAuthStateChanged(authUser => {
        if (!authCondition(authUser)) {
          this.props.history.push(LOGIN)
        }
      })
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component /> : null}
        </AuthUserContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization)
}

export default withAuthorization
