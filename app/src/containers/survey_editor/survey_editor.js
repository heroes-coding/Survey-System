import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { populateSurveyDraft } from '../../actions'
import Survey from '../survey/survey'



const TextField = ({ name, property, placeholder, updateForm }) =>
  <div className="form-group">
    <label>{name}</label>
    <input
      type="text"
      className="form-control"
      id="surveyTitle"
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

const AnswerField = ({ answer, points, placeholder, updateAnswer }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{`${points} point answer:`}</span></div>
    <input
      type="text"
      className="form-control"
      id="surveyTitle"
      value={answer}
      onChange={event => updateAnswer(event.target.value)}
      required
    ></input>
  </div>

const QuestionField = ({ question, reverse, number, updateQuestion }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{`Question ${number}:`}</span></div>
    <input
      type="text"
      className="form-control"
      id="surveyTitle"
      value={question}
      onChange={event => updateQuestion(event.target.value)}
      required
    ></input>
  </div>

const Category = ({ name, title, answers, questions, updateCategory, id, isOld }) =>
  <div className="categoryHolder">
    <TextField name='Category Name' property='title' placeholder='Please enter the title text for a category that users will see' updateForm={
      (property, value) => {
        console.log({id,property,value})
        updateCategory(id,property,value)
      }
    } />
    <div className="categoryHeader">Category Answers:</div>
    {answers.map((a,i) => {
      return <AnswerField answer={a} key={i} points={i+1} updateAnswer={(value) => console.log(value)} />
    })}
    <div className="categoryHeader">Category Questions:</div>
    {Object.entries(questions).map(([i,q],n) => {
      const { question, reverse } = q
      return <QuestionField question={question} reverse={reverse} number={n+1}/>
    })}
  </div>



const Form = ({ updateForm, submitForm, title, categories, additionalQuestions, updateCategory  }) =>
  <div>
    {Object.entries(categories).map(([i,c]) => <Category {...c} id={i} key={i} updateCategory={updateCategory}/>  )}
    <form onSubmit={submitForm}>
      <TextField name='Survey Title' property='title' placeholder='Please enter the title your users will see' updateForm={updateForm} />
      <TextField name='Survey ID' property='id' placeholder='Please enter an id for the survey, it will also be the path you input to get to the survey' updateForm={updateForm} />
      <div className="form-group">
        <label >Survey Description</label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          onChange={event => updateForm('description', event.target.value)}
          rows="3"
          required
        />
      </div>


      <div className="input-group mb-3">
        <button className ="btn btn-secondary btn-md" type="submit" name="signup">
          Update Sample Survey
        </button>
      </div>

    </form>
  </div>


class SurveyEditor extends Component {
  updateForm(key, value) {
    console.log('update form called with',{key, value})
    this.setState({[key]: value,})
  }
  updateCategory(id,key,value) {
    const tempState = this.state
    tempState.categories[id][key] = value
    console.log(tempState.categories[id])
    this.setState(tempState)
  }
  constructor(props) {
    super(props)
    this.populateSurveyDraft = this.populateSurveyDraft.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.state = {
        id: null,
        title: 'Sample Title',
        description: 'Sample Survey Description',
        additionalQuestions: {
          1: {
            name: "length",
            title: "Was this survey too long?",
            answers: ["Yes", "No", "A little bit"],
            value: null
          }
        },
        categories: {
          1: {
            answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
            name: "",
            title: "Please rate your agreement to the following statements about yourself",
            questions: {
              1: { question: "I do my best in my classes.", reverse: false, value: null },
              2: { question: "I consistently do my school work well.", reverse: false, value: null }
            },
            cutoffScore: 2,
            advice: "Remember, \"There is no try. Do or do not.\" -- Yoda. Here are some links to help you on your way:",
            links: [
              {link:"https://www.huffingtonpost.com/gabrielle-posard-/star-wars-quotes_b_3625405.html", name:"Star Wars Quotes"}
            ]

          }
        }
    }
    this.populateSurveyDraft()
  }
  populateSurveyDraft(e) {
    if (e) e.preventDefault()
    console.log(this.state)
    this.props.populateSurveyDraft({... this.state})
  }
  render() {
    const { categories, additionalQuestions } = this.state
    return (
      <div className="surveyEditor">
        <Form updateForm={this.updateForm} updateCategory={this.updateCategory} submitForm={this.populateSurveyDraft} categories={categories} additionalQuestions={additionalQuestions} />
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
