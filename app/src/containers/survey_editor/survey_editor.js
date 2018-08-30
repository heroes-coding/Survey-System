import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { populateSurveyDraft } from '../../actions'
import Survey from '../survey/survey'
import { defaultSurvey, defaultCategory } from '../../constants'
import _ from "lodash"

const TextField = ({ name, value, property, placeholder, updateForm }) =>
  <div className="form-group">
    <label>{name}</label>
    <input
      type="text"
      className="form-control"
      id="surveyTitle"
      value={value || ""}
      placeholder={placeholder}
      onChange={event => updateForm(property, event.target.value)}
      required
    />
  </div>



/*
  {
    answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
    name: "",
    title: "Please rate your agreement to the following statements about yourself",
    questions: {
      1: { question: "I do my best in my classes.", reverse: false, value: null },
      2: { question: "I consistently do my school work well.", reverse: false, value: null }
    }
*/

const AnswerField = ({ cat, answer, points, placeholder, updateAnswer, deleteAnswer, isOld }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{`${points} point answer:`}</span></div>
    <input
      type="text"
      className="form-control"
      id={`category${cat}Answer${answer}`}
      value={answer}
      onChange={event => updateAnswer(event.target.value)}
      required
    ></input>
    {!isOld&&<button type="button" className="btn btn-danger" onClick={event => updateAnswer(points)}>Delete</button>}

  </div>

const QuestionField = ({ cat, question, reverse, number, updateQuestion, isOld }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{`Question ${number}:`}</span></div>
    <input
      type="text"
      className="form-control"
      id={`category${cat}Question${number}`}
      value={question}
      onChange={event => updateQuestion("question",event.target.value)}
      required
    ></input>
    <button type="button" className="btn btn-light" data-toggle="button" onClick={event => {
      event.preventDefault()
      updateQuestion("reverse",!reverse)
    }} >
      {reverse ? 'Reverse Encoded' : 'Encoded Normally'}
    </button>
    {!isOld&&<button type="button" className="btn btn-danger" onClick={event => updateQuestion("question",number)}>Delete</button>}
  </div>

const Category = ({ deleteCategory, updateAnswer, name, title, answers, questions, updateCategory, updateQuestion, id, isOld }) =>
  <div className="categoryHolder">
    <div className="input-group mb-3">
      <div className="input-group-prepend"><span className="input-group-text">Category Name</span></div>
      <input
        type="text"
        className="form-control"
        id="surveyTitle"
        value={name}
        onChange={event => updateCategory(id,"name",event.target.value)}
        required
      ></input>
    </div>
    <div className="input-group mb-3">
      <div className="input-group-prepend"><span className="input-group-text">Category Title</span></div>
      <input
        type="text"
        className="form-control"
        id="surveyTitle"
        value={title}
        onChange={event => updateCategory(id,"title",event.target.value)}
        required
      ></input>
    </div>
    <div className="categoryHeader">Category Answers:</div>
    {answers.map((a,i) => {
      return <AnswerField cat={id} answer={a} key={i} points={i+1} updateAnswer={(value) => {
        updateAnswer(id,i,value)
      }}/>
    })}
    <div className="categoryHeader">Category Questions:</div>
    {Object.entries(questions).map(([i,q],n) => {
      const { question, reverse } = q
      return <QuestionField cat={id} key={n} updateQuestion={(property,value) => {
        updateQuestion(id,i,property,value)
      }} question={question} reverse={reverse} number={n+1}/>
    })}
    {!isOld && <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => deleteCategory(id)}>Delete Above Category</button>}
  </div>



const Form = ({ addCategory, deleteCategory, updateAnswer, updateForm, submitForm, title, description, id, categories, additionalQuestions, updateCategory, updateQuestion }) =>
  <div>
    <form onSubmit={submitForm}>
      <TextField name='Survey Title' value={title} property='title' placeholder='Please enter the title your users will see' updateForm={updateForm} />
      <TextField name='Survey ID' value={id} property='id' placeholder='Please enter an id for the survey, it will also be the path you input to get to the survey' updateForm={updateForm} />
      <div className="form-group">
        <label >Survey Description</label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          onChange={event => updateForm('description', event.target.value)}
          rows="3"
          value={description}
          required
        />
      </div>

      {Object.entries(categories).map(([i,c]) => <Category deleteCategory={deleteCategory} {...c} id={i} key={i} updateAnswer={updateAnswer} updateCategory={updateCategory} updateQuestion={updateQuestion}/>  )}

      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={addCategory}>Add New Category</button>

      <div className="input-group mb-3">
        <button className ="btn btn-secondary btn-md" type="submit" name="signup">
          Update Sample Survey
        </button>
      </div>

    </form>
  </div>


class SurveyEditor extends Component {
  updateForm(key, value) {
    this.setState({[key]: value,})
  }
  addCategory() {
    const tempState = {... this.state}
    const newCategory = _.clone(defaultCategory, true)
    newCategory.questions = _.clone(defaultCategory.questions,true)
    newCategory.answers = _.clone(defaultCategory.answers,true)
    const newKey = Object.keys(this.state.categories).length + 1
    tempState.categories[newKey] = newCategory
    this.setState(tempState)
  }
  deleteCategory(id) {
    const tempState = {... this.state}
    delete tempState.categories[id]
    this.setState(tempState)
  }
  updateCategory(id,key,value) {
    const tempState = {... this.state}
    tempState.categories[id][key] = value
    this.setState(tempState)
  }
  updateAnswer(id,i,value) {
    const tempState = {... this.state}
    if (typeof value === 'number') tempState.categories[id].answers.splice(value-1,1)
    else tempState.categories[id].answers[i] = value
    this.setState(tempState)
  }
  updateQuestion(id,i,property,value) {
    // id is category id, i is question id
    const tempState = _.clone(this.state, true)
    if (typeof value === 'number') delete tempState.categories[id].questions[i]
    else tempState.categories[id].questions[i][property] = value
    this.setState(tempState)
  }
  constructor(props) {
    super(props)
    this.addCategory = this.addCategory.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
    this.populateSurveyDraft = this.populateSurveyDraft.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
    this.updateAnswer = this.updateAnswer.bind(this)
    this.state = _.clone(defaultSurvey, true)
    this.populateSurveyDraft()
  }
  populateSurveyDraft(e) {
    if (e) e.preventDefault()
    this.props.populateSurveyDraft({... this.state})
  }
  render() {
    const { categories, additionalQuestions, title, id, description } = this.state
    return (
      <div className="surveyEditor">
        <Form
          updateAnswer={this.updateAnswer}
          updateQuestion={this.updateQuestion}
          updateForm={this.updateForm}
          updateCategory={this.updateCategory}
          submitForm={this.populateSurveyDraft}
          addCategory={this.addCategory}
          deleteCategory={this.deleteCategory}
          categories={categories}
          title={title}
          description={description}
          id={id}
          additionalQuestions={additionalQuestions}
        />
        <h5>Sample Survey</h5>
        <Survey />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  return {}
}

export default connect(mapStateToProps, { populateSurveyDraft } )(SurveyEditor)
