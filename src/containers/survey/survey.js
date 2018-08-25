import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { updateSurvey } from '../../actions'
import Category from './category'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validationFailed: false,
      firstName: "",
      lastName: "",
      formSubmitted: false
    }
    this.updateSurvey = this.updateSurvey.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  updateSurvey(categoryId, questionId, value) {
    this.props.updateSurvey(categoryId, questionId, value)
  }
  submitForm() {
    console.log('should be submitting form... ')
    this.setState({... this.state, validationFailed: false, formSubmitted: true})
  }
  failValidation() {
    this.setState({... this.state, validationFailed: true})
  }
  async componentDidMount () {
    window.axios = axios
    let result = await axios.get(`http://localhost:5300/test`)
  }
  render() {
    const { title, description, categories } = this.props.surveyData
    const { validationFailed, formSubmitted } = this.state
    const unansweredQuestionsCount = Object.entries(categories).map(c => Object.entries(c[1].questions).map(q => q[1].value)).reduce((acc, val) => acc.concat(val), []).filter(x => !x).length
    return (
      <div className="surveyHolder">
        <h4 className="surveyTitle">{title}</h4>
        <div className="surveyDescription">{description}</div>

        {Object.entries(categories).map(entry => {
          const [ id, c ] = entry
          return (
            <Category key={id} id={id} answers={c.answers} validationFailed={validationFailed} name={c.name} title={c.title} questions={c.questions} updateSurvey={this.updateSurvey} />
          )
        })}
        {!!unansweredQuestionsCount&&validationFailed&&<div className="alert alert-info" role="alert">
          {`Please answer the remaining ${unansweredQuestionsCount} question${unansweredQuestionsCount > 1 ? 's' : '' } above.`}
        </div>}
        <form
          id="studentInfo"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Student</span>
            </div>
            <input type="text" className="form-control" placeholder="First / Given Name" required />
            <input type="text" className="form-control" placeholder="Last / Family Name" required />
            <div className="input-group-prepend">
              <span className="input-group-text">SRJC ID #</span>
            </div>
            <input type="text" className="form-control" placeholder="(Starts with an 8)" />
            <button className="btn btn-secondary btn-md"
              type="submit"
              onClick={(e) => {
                // only submits the form if the student info fields are valid and there are no unanswered questions and it was not already submitted
                if (window.$('#studentInfo')[0].checkValidity() && !unansweredQuestionsCount && !formSubmitted) this.submitForm()
                else this.failValidation()
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData }
}

export default connect(mapStateToProps,{ updateSurvey })(App)
