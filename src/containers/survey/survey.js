import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { updateSurvey } from '../../actions'
import Category from './category'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitted: false
    }
    this.updateSurvey = this.updateSurvey.bind(this)
  }
  updateSurvey(categoryId, questionId, value) {
    this.props.updateSurvey(categoryId, questionId, value)
  }
  async componentDidMount () {
    window.axios = axios
    let result = await axios.get(`http://localhost:5300/test`)
  }
  render() {
    const { title, description, categories } = this.props.surveyData
    console.log(categories)
    return (
      <div className="surveyHolder">
        <h4 className="surveyTitle">{title}</h4>
        <div className="surveyDescription">{description}</div>
        {Object.entries(categories).map(entry => {
          const [ id, c ] = entry
          return (
            <Category key={id} id={id} answers={c.answers} submitted={this.state.submitted} name={c.name} title={c.title} questions={c.questions} updateSurvey={this.updateSurvey} />
          )
        })}
        <button className="btn btn-secondary btn-md"
          type="submit"
          onClick={() => {
            this.setState({... this.state, submitted: true})
          }}
        >
          Submit
        </button>


      </div>
    );
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

export default connect(mapStateToProps,{ updateSurvey })(App)
