import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withAuthentication from '../auth/with_authentication'
import DashboardNav from './dash_nav'
import SurveyEditor from '../survey_editor/survey_editor'
import UserEditor from '../user_editor/user_editor'
import { signOut } from '../auth/auth_functions'
import { LOGIN } from '../../constants/routes'
import { SURVEY_EDITOR, USER_EDITOR, REPORT_VIEWER } from './dash_nav'

class Dash extends Component {
  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
    this.setPage = this.setPage.bind(this)
    this.state = {
      page: USER_EDITOR,
      error: null
    }
  }
  setPage(page) {
    this.setState({ ...this.state, page })
  }
  signOut() {
    signOut()
      .then(() => {
        setTimeout(() => this.props.history.push(LOGIN), 10)
      }).catch(error => {
        this.setState({ ...this.state, error })
      })
  }
  componentDidMount() {
  }
  render() {
    const { surveyData, authUser, idToken } = this.props
    console.log({authUser, idToken })
    const { error, page } = this.state
    return (
      <div className="row dashHolder">
        <div className='col-sm-3' >
          <DashboardNav {...this.props} setPage={this.setPage} signOut={this.signOut} />
        </div>
        <div className='col-sm-9' >
          { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
          {page===SURVEY_EDITOR && idToken==="admin" && <SurveyEditor authUser={authUser} role={idToken} />}
          {page===USER_EDITOR && idToken==="admin" && <UserEditor authUser={authUser} role={idToken} />}
        </div>
      </div>

    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { authUser, idToken, history } = ownProps
  const { surveyData } = state
  return { surveyData, authUser, idToken, history }
}

export default withAuthentication(withRouter((connect(mapStateToProps,{})(Dash))))
