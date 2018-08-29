import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import withAuthentication from '../auth/with_authentication'
import DashboardNav from './dash_nav'
import SurveyEditor from '../survey_editor/survey_editor'

class Dash extends Component {
  componentDidMount() {
  }
  render() {
    const { surveyData, authUser, idToken } = this.props
    console.log({ surveyData, authUser, idToken })
    return (
      <div>
        <DashboardNav {...this.props} />
        <SurveyEditor />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { authUser, idToken } = ownProps
  const { surveyData } = state
  return { surveyData, authUser, idToken }
}

export default withRouter(withAuthentication((connect(mapStateToProps,{})(Dash))))
