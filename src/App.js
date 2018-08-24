import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import Survey from './containers/survey/survey'
import 'font-awesome/css/font-awesome.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as styles from './style.css'

class App extends Component {
  async componentDidMount () {
    window.axios = axios
    let result = await axios.get(`http://localhost:5300/test`)
    console.log({result})
  }
  render() {
    return (
      <div className='container-fluid' >
          <div className="row">
            <div className="bannerHolder">
              <img className="banner" src="banner.png" />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-1 col-xl-2"></div>
            <div className='col-sm-12 col-lg-10 col-xl-8' id="contentHolder">
              <Survey />
            <div className="col-lg-1 col-xl-2"></div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

export default connect(mapStateToProps,{})(App)
