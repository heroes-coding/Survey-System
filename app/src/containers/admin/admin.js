

import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { asleep } from '../../helpers/tiny_helpers'
import { auth } from '../auth/firebase'

class Admin extends Component {
  async componentDidMount () {
  }
  render() {
    return (
      <div
        onClick={() => {
          auth.signOut().then(function() {
            console.log('successfully logged out!')
          }, function(error) {
            // An error happened.
          });
        }}
        >{"DON'T LOGOUT NOOOOO"}</div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

export default connect(mapStateToProps,{})(Admin)
