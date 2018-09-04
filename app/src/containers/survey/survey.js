import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { updateSurvey, populateSurveyDraft } from '../../actions'
import Category from './category'
import MutipleChoice from './multiple_choice'
import { addSurveyResults } from '../auth/auth_functions'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validationFailed: false,
      firstName: "",
      lastName: "",
      studentId: "",
      formSubmitted: false,
      error: null
    }
    this.updateSurvey = this.updateSurvey.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }
  updateSurvey(categoryId, questionId, value) {
    this.props.updateSurvey(categoryId, questionId, value)
  }
  submitForm() {
    const { firstName, lastName, studentId } = this.state
    const surveyData = this.props.surveyData
    const additionalQuestions = Object.entries(surveyData.additionalQuestions).map(a => [parseInt(a[0]),a[1].value])
    const categories = Object.entries(surveyData.categories).map(c => [parseInt(c[0]),Object.entries(c[1].questions).map(q => [parseInt(q[0]),q[1].value])] )
    const results = { additionalQuestions, categories }
    addSurveyResults(surveyData.id, results, { firstName, lastName, studentId }).then((res) => {
      if (res.data ==="okay") this.setState({... this.state, error: "Survey successfully submitted!"})
      else this.setState({... this.state, validationFailed: false, formSubmitted: false, error: res.data})
    }).catch(error => {
      this.setState({... this.state, validationFailed: false, formSubmitted: false, error})
    })
    this.setState({... this.state, validationFailed: false, formSubmitted: true})
  }
  failValidation() {
    this.setState({... this.state, validationFailed: true})
  }
  async componentWillMount() {
    if (this.props.isSample) return
    const surveyId = this.props.match.params.id
    let result
    if (surveyId) result = await axios.get(`/getSurvey/${surveyId}`)
    else result = await axios.get(`/getDefault`)
    console.log(result.data)
    this.props.populateSurveyDraft(result.data)
  }
  render() {
    const { isDemo, surveyData } = this.props
    const { averageScores, title, description, categories, additionalQuestions, unansweredQuestionsCount, totalQuestionsCount } = surveyData
    const { validationFailed, formSubmitted, error } = this.state
    console.log({ formSubmitted })
    return (
      <div className="row">
        <div className='col-lg-1 col-xl-2' />
        <div className='col-sm-12 col-lg-10 col-xl-8 surveyHolder' id="contentHolder">
          <h4 className="surveyTitle">{title}</h4>
          <div className="surveyDescription">{description}</div>

          {Object.entries(categories).map(entry => {
            const [ id, c ] = entry
            const showAdvice = averageScores[id] <= c.cutoffScore
            return (
              <Category
                key={id}
                id={id}
                answers={c.answers}
                validationFailed={validationFailed}
                name={c.name}
                title={c.title}
                questions={c.questions}
                updateSurvey={this.updateSurvey}
                advice={c.advice}
                links={c.links}
                showAdvice={showAdvice}
                submitted={this.state.formSubmitted}
              />
            )
          })}
          <MutipleChoice
            key="multiple"
            id="multiple"
            validationFailed={validationFailed}
            questions={additionalQuestions}
            updateSurvey={this.updateSurvey}
          />
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
              <input type="text" className="form-control" onChange={(e) => this.setState({...this.state, firstName: e.target.value})} placeholder="First / Given Name" required />
              <input type="text" className="form-control" onChange={(e) => this.setState({...this.state, lastName: e.target.value})} placeholder="Last / Family Name" required />
              <div className="input-group-prepend">
                <span className="input-group-text">SRJC ID #</span>
              </div>
              <input type="text" className="form-control" onChange={(e) => this.setState({...this.state, studentId: e.target.value})} placeholder="(Starts with an 8)" />
              <button className="btn btn-secondary btn-md"
                type="submit"
                disabled={formSubmitted}
                onClick={(e) => {
                  // only submits the form if the student info fields are valid and there are no unanswered questions and it was not already submitted
                  if (window.$('#studentInfo')[0].checkValidity() && !unansweredQuestionsCount && !formSubmitted) this.submitForm()
                  else this.failValidation()
                }}
              >
                {formSubmitted ? 'Thanks!' : 'Submit'}
              </button>
            </div>
          </form>
          { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
        </div>
        <div className='col-lg-1 col-xl-2' />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { surveyData } = state
  return { surveyData, ownProps }
}

export default connect(mapStateToProps,{ updateSurvey, populateSurveyDraft })(App)
