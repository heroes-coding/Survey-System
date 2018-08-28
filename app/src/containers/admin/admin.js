

import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import withAuthorization from '../auth/with_authorization'
import SignOut from '../auth/sign_out'

class Admin extends Component {
  async componentDidMount () {
  }
  render() {
    return (
      <SignOut />
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

const authCondition = (authUser) => {
  console.log({authUser})
  return !!authUser
}

export default withAuthorization(authCondition)(connect(mapStateToProps,{})(Admin))
