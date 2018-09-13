import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { populateSurveyDraft } from '../../actions'
import Survey from '../survey/survey'
import { defaultCoachLink, defaultStandaloneQuestion, defaultSurvey, defaultCategory, defaultLink, defaultQuestion, defaultAnswer } from '../../constants'
import _ from "lodash"
import { max } from 'd3'
import TextField from '../../components/text_field'
import AnswerField from '../../components/answer_field'
import CheckBox from '../../components/check_box'
import QuestionField from '../../components/question_field'
import MultiLine from '../../components/multi_line'
import DropDown from '../../components/drop_down'
import InlineTitleText from '../../components/inline_title_text'
import { addOrModifySurvey, setDefaultSurvey } from '../auth/auth_functions'

const Category = ({ addQuestion, coachLinks, coachAdvice, addLink, addAnswer, updateLink, deleteCategory, links, cutoffScore, advice, kudos, updateAnswer, name, title, answers, questions, updateCategory, updateQuestion, id, isOld }) =>
  <div className="categoryHolder">
    <div className="categoryHeader">
      <h6>{`Category ${id} - ${name}`}</h6>
      <button className="btn btn-sm btn-primary" type="button" data-toggle="collapse" data-target={`#collapse${id}`}>Collapse / Show Category</button>
    </div>
    <div className="collapse show" id={`collapse${id}`}>
      <InlineTitleText value={name} title="Category Name" updateFunction={(value) => updateCategory(id,"name",value)} />
      <InlineTitleText value={title} title="Category Title" updateFunction={(value) => updateCategory(id,"title",value)} />
      <div className="categoryHeader">Category Answers:</div>
      {!isOld && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => addAnswer(id)}>Add Answer</button>}
      {answers.map((a,i) => {
        return <AnswerField isOld={isOld} cat={id} answer={a} key={i} points={i+1} updateAnswer={(value) => {
          updateAnswer(id,i,value)
        }}/>
      })}
      <div className="categoryHeader">Category Questions:</div>
      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => addQuestion(id)}>Add Question</button>
      {Object.entries(questions).map(([i,q]) => {
        const { question, reverse } = q
        return <QuestionField cat={id} isOld={q.isOld} key={i} updateQuestion={(property,value) => {
          updateQuestion(id,i,property,value)
        }} question={question} reverse={reverse} number={parseInt(i)}/>
      })}
      <InlineTitleText value={cutoffScore} title={`Cutoff Score (1-${answers.length}, can be fractional)`} updateFunction={(value) => {
        const tail = value[value.length-1]
        if (value !== "") value = tail === "." ? value : parseFloat(value)
        if (!isNaN(tail) || tail === '.' || value === "") updateCategory(id,"cutoffScore",value)
      }}/>
      <div className="categoryHeader">Student resources:</div>
      <MultiLine text={advice} title="Advice (for scores at or below the cutoff score)" updateFunction={(value) => updateCategory(id,'advice', value) } />
      <MultiLine text={kudos} title="Compliments / Kudos (for scores above the cutoff score)" updateFunction={(value) => updateCategory(id,'kudos', value) } />
      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => addLink(id)}>Add Student Link</button>
      {links.map((l,i) => {
        const { goodLink, badLink, name, link } = l
        return (
          <div key={i} className="input-group mb-3">
            <div className="input-group-prepend"><span className="input-group-text">Link text: </span></div>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={event => updateLink(id, i, "name", event.target.value)}
              required
            ></input>
            <div className="input-group-prepend"><span className="input-group-text">Link: </span></div>
            <input
              type="text"
              className="form-control"
              value={link}
              onChange={event => updateLink(id, i, "link", event.target.value)}
              required
            ></input>
            <CheckBox label="&nbsp; &nbsp; Low Score Link: " checked={badLink} updateFunction={(checked) => updateLink(id,i,"badLink", checked)} />
            <CheckBox label="High Score Link: " checked={goodLink} updateFunction={(checked) => updateLink(id,i,"goodLink", checked)} />
            <button type="button" className="btn btn-danger" onClick={event => updateLink(id,i)}>Del</button>
          </div>
        )
      })}
      <div className="categoryHeader">Coach resources:</div>
      <MultiLine text={coachAdvice} title="Internal advice (for coaches)" updateFunction={(value) => updateCategory(id,'coachAdvice', value) } />
      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => addLink(id,true)}>Add Coach Link</button>
      {coachLinks.map((l,i) => {
        const { name, link } = l
        return (
          <div key={i} className="input-group mb-3">
            <div className="input-group-prepend"><span className="input-group-text">Link text: </span></div>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={event => updateLink(id, i, "name", event.target.value, true)}
              required
            ></input>
            <div className="input-group-prepend"><span className="input-group-text">Link: </span></div>
            <input
              type="text"
              className="form-control"
              value={link}
              onChange={event => updateLink(id, i, "link", event.target.value, true)}
              required
            ></input>
            <button type="button" className="btn btn-danger" onClick={event => updateLink(id,i,null,null, true)}>Del</button>
          </div>
        )
      })}

      {!isOld && <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => {
        if (window.confirm(`Are you sure you want to delete the ${name} category?`)) deleteCategory(id)
        }}>Delete Above Category</button>}
    </div>
  </div>

const AdditionalQuestions = ({  addSingleAnswer, addSingleQuestion, changeSingleAnswer, changeSingleQuestion, additionalQuestions }) =>
  <div className="categoryHolder">
    <div className="categoryHeader">
      <h6>Additional Standalone Questions</h6>
      <button className="btn btn-sm btn-primary" type="button" data-toggle="collapse" data-target="#collapseStandalone">Collapse / Show Questions</button>
    </div>
    <div className="collapse show" id="collapseStandalone">
      {Object.entries(additionalQuestions).map(([i,q]) => {
        const { name, title, answers, isOld } = q
        i = parseInt(i)
        return (
          <div className="additionalQuestion" key={i}>
            <InlineTitleText value={title} title="Question: " updateFunction={(value) => changeSingleQuestion(i,value)} />
            {answers.map((a,n) => <AnswerField isOld={isOld} standalone answer={a} key={n} points={i+1} updateAnswer={(value) => {
              changeSingleAnswer(i,n,value)
            }}/>)}
            {!isOld && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => addSingleAnswer(i)}>Add Answer</button>}
            {!isOld && <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() =>
              { changeSingleQuestion(i,i) }}>Delete Above Question</button>}
          </div>
        )
      })}
      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={addSingleQuestion}>Add New Standalone Multiple Choice Question</button>

    </div>
  </div>

const Form = ({ overallSuccess, positiveSuccess, negativeSuccess, setDefaultSurvey, isOld, addNewSurvey, addSingleAnswer, addSingleQuestion, changeSingleAnswer, changeSingleQuestion, addQuestion, addLink, addAnswer, updateLink, addCategory, deleteCategory, updateAnswer, updateForm, submitForm, title, description, id, categories, additionalQuestions, updateCategory, updateQuestion }) =>
  <div>
    <form onSubmit={addNewSurvey}>
      <TextField name='Survey Title' value={title} property='title' placeholder='Please enter the title your users will see' updateForm={updateForm} />
      {!isOld && <TextField name='Survey ID' value={id} property='id' placeholder='Please enter an id for the survey, it will also be the path you input to get to the survey' updateForm={updateForm} />}
      {isOld && <div>{`Survey ID: ${id}`}<br/><br/></div>}
      <MultiLine text={description} title="Survey Description" updateFunction={(value) => updateForm('description', value) } />
      <MultiLine text={positiveSuccess} title="Positive portion of success message (must include [P] where you want the categories scored above the cutoff to show up)" updateFunction={(value) => updateForm('positiveSuccess', value) } />
      <MultiLine text={negativeSuccess} title="Negative portion of success message (must include [N] where you want the categories scored at or below the cutoff to show up).  Try not to use a transition, as there may be no positive results." updateFunction={(value) => updateForm('negativeSuccess', value) } />
      <MultiLine text={overallSuccess} title="The rest of the success message (will always show up, the positive or negative portion might not)" updateFunction={(value) => updateForm('overallSuccess', value) } />

      {Object.entries(categories).map(([i,c]) => <Category addQuestion={addQuestion} addLink={addLink} addAnswer={addAnswer} updateLink={updateLink} deleteCategory={deleteCategory} {...c} id={i} key={i} updateAnswer={updateAnswer} updateCategory={updateCategory} updateQuestion={updateQuestion}/>  )}
      <button type="button" className="btn btn-primary btn-sm btn-block" onClick={addCategory}>Add New Category</button>

      <AdditionalQuestions addSingleAnswer={addSingleAnswer} addSingleQuestion={addSingleQuestion} changeSingleAnswer={changeSingleAnswer} changeSingleQuestion={changeSingleQuestion} additionalQuestions={additionalQuestions} />
      {isOld && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={setDefaultSurvey}>Set as default (site root) survey</button>}

      <button type="submit" className="btn btn-info btn-sm btn-block" >{`${isOld ? 'Modify' : 'Add'} Above Survey (this saves permanently)`}</button>


      <div className="input-group mb-3">
        <button className ="btn btn-secondary btn-md" type="button" name="signup" onClick={submitForm}>
          Preview survey changes (update preview survey below - this does not save changes)
        </button>
      </div>

    </form>
  </div>

const getNewKey = (object) => {
  const newKey = max(Object.keys(object).map(x => parseInt(x)))+1
  return isNaN(newKey) ? 1 : newKey
}

class SurveyEditor extends Component {
  updateForm(key, value) {
    const tempState = this.state.survey
    tempState[key] = value
    this.setState({...this.state, survey: tempState, error: null})
  }
  addSingleQuestion() {
    const tempState = this.state.survey
    const newKey = getNewKey(tempState.additionalQuestions)
    tempState.additionalQuestions[newKey] = JSON.parse(JSON.stringify(defaultStandaloneQuestion))
    this.setState({...this.state, survey: tempState, error: null})
  }
  addSingleAnswer(q) {
    const tempState = this.state.survey
    tempState.additionalQuestions[q].answers.push("")
    this.setState({...this.state, survey: tempState, error: null})
  }
  changeSingleQuestion(q,question) {
    const tempState = this.state.survey
    if (typeof question === 'number') delete tempState.additionalQuestions[q]
    else tempState.additionalQuestions[q].title = question
    this.setState({...this.state, survey: tempState, error: null})
  }
  changeSingleAnswer(q,a,answer) {
    const tempState = this.state.survey
    // delete answer
    if (typeof answer === 'number') tempState.additionalQuestions[q].answers.splice(a,1)
    else tempState.additionalQuestions[q].answers[a] = answer
    this.setState({...this.state, survey: tempState, error: null})
  }
  addCategory() {
    const tempState = this.state.survey
    const newCategory = JSON.parse(JSON.stringify(defaultCategory))
    const newKey = getNewKey(tempState.categories)
    tempState.categories[newKey] = newCategory
    this.setState({...this.state, survey: tempState, error: null})
  }
  addLink(id,isCoachLink) {
    const tempState = this.state.survey
    if (isCoachLink) {
      tempState.categories[id].coachLinks.push(_.clone(defaultLink,true))
      this.setState({...this.state, survey: tempState, error: null})
    } else {
      tempState.categories[id].links.push(_.clone(defaultCoachLink,true))
      this.setState({...this.state, survey: tempState, error: null})
    }

  }
  addQuestion(id) {
    const tempState = this.state.survey
    const newKey = getNewKey(tempState.categories[id].questions)

    tempState.categories[id].questions[newKey] = _.clone(defaultQuestion,true)
    this.setState({...this.state, survey: tempState, error: null})
  }
  addAnswer(id) {
    const tempState = this.state.survey
    tempState.categories[id].answers.push(defaultAnswer)
    this.setState({...this.state, survey: tempState, error: null})
  }
  updateLink(id,linkId,key,value,isCoachLink) {
    const tempState = this.state.survey
    if (isCoachLink) {
      if (!key) tempState.categories[id].coachLinks.splice(linkId,1) // no key == delete
      else tempState.categories[id].coachLinks[linkId][key] = value
    } else {
      if (!key) tempState.categories[id].links.splice(linkId,1) // no key == delete
      else tempState.categories[id].links[linkId][key] = value
    }
    this.setState({...this.state, survey: tempState, error: null})
  }
  deleteCategory(id) {
    const tempState = this.state.survey
    delete tempState.categories[id]
    this.setState({...this.state, survey: tempState, error: null})
  }
  updateCategory(id,key,value) {
    const tempState = this.state.survey
    tempState.categories[id][key] = value
    this.setState({...this.state, survey: tempState, error: null})
  }
  updateAnswer(id,i,value) {
    const tempState = this.state.survey
    // delete answer
    if (typeof value === 'number') tempState.categories[id].answers.splice(value-1,1)
    else tempState.categories[id].answers[i] = value
    this.setState({...this.state, survey: tempState, error: null})
  }
  updateQuestion(id,i,property,value) {
    // id is category id, i is question id
    const tempState = this.state.survey
    if (typeof value === 'number') delete tempState.categories[id].questions[i]
    else tempState.categories[id].questions[i][property] = value
    this.setState({...this.state, survey: tempState, error: null})
  }
  constructor(props) {
    super(props)
    this.changeSurvey = this.changeSurvey.bind(this)
    this.setDefaultSurvey = this.setDefaultSurvey.bind(this)
    this.addNewSurvey = this.addNewSurvey.bind(this)
    this.addSingleQuestion = this.addSingleQuestion.bind(this)
    this.addSingleAnswer= this.addSingleAnswer.bind(this)
    this.changeSingleQuestion = this.changeSingleQuestion.bind(this)
    this.changeSingleAnswer= this.changeSingleAnswer.bind(this)
    this.addLink = this.addLink.bind(this)
    this.addQuestion = this.addQuestion.bind(this)
    this.addAnswer = this.addAnswer.bind(this)
    this.addCategory = this.addCategory.bind(this)
    this.updateLink = this.updateLink.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
    this.populateSurveyDraft = this.populateSurveyDraft.bind(this)
    this.updateForm = this.updateForm.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
    this.updateAnswer = this.updateAnswer.bind(this)
    this.copySurvey = this.copySurvey.bind(this)
    this.state = {
      survey: JSON.parse(JSON.stringify(defaultSurvey)),
      isOld: false,
      error: null,
      surveyIds: ['New Survey']
    }
    axios.get('/getSurveyIds').then(res => {
      this.setState({...this.state, surveyIds: ['New Survey'].concat(res.data) })
    })
    // setTimeout(this.populateSurveyDraft(),500)
  }
  changeSurveyAge(survey, isOld=true) {
    // mutates survey with isOld modifiers
    // sets isOld markers throughout survey so that they won't be edited further
    const categoryKeys = Object.keys(survey.categories)
    for (let c=0; c < categoryKeys.length; c++) {
      survey.categories[categoryKeys[c]].isOld = isOld
      const questionKeys = Object.keys(survey.categories[categoryKeys[c]].questions)
      for (let q=0; q < questionKeys.length; q++) survey.categories[categoryKeys[c]].questions[questionKeys[q]].isOld = isOld
    }
    const additionalKeys = Object.keys(survey.additionalQuestions)
    for (let q =0; q < additionalKeys.length; q++) survey.additionalQuestions[additionalKeys[q]].isOld = isOld
  }
  setDefaultSurvey() {
    const surveyId = this.state.survey.id
    setDefaultSurvey(surveyId).then(r => {
      if (r.data === "okay") this.setState({...this.state, error: `Survey ${surveyId} added as default survey`, isOld: true })
      else this.setState({...this.state, error: r.data })
    })
  }
  addNewSurvey(e) {
    e.preventDefault()
    const { survey, isOld } = this.state
    if (!isOld && this.state.surveyIds.includes(survey.id)) {
      this.setState({...this.state, error: `Cannot add a second survey with the id: ${survey.id}`})
      return
    }
    this.changeSurveyAge(survey) // mutates survey
    addOrModifySurvey(survey).then(r => {
      const survey = this.state.survey
      if (r.data === "okay") this.setState({
        ...this.state,
        survey,
        error:
        `Survey ${survey.id} successfully ${this.state.isOld ? 'modified' : 'added'}.`,
        isOld: true,
        surveyIds: isOld ? this.state.surveyIds : this.state.surveyIds.concat([survey.id])
      })
      else this.setState({...this.state, error: r.data })
    })
  }
  copySurvey() {
    // copies survey in place, and makes all fields editable again
    const survey = JSON.parse(JSON.stringify(this.state.survey))
    this.changeSurveyAge(survey,false)
    this.setState({...this.state, survey, isOld: false})
  }
  changeSurvey(surveyId) {
    if (surveyId === "New Survey") {
      this.setState({...this.state,
            survey: JSON.parse(JSON.stringify(defaultSurvey)),
            isOld: false,
            error: null})
    } else {
      axios.get(`/getSurvey/${surveyId}`).then(r => {
        this.setState({...this.state, survey: r.data, isOld: true})
      })
    }
  }
  populateSurveyDraft(e) {
    if (e) e.preventDefault()
    this.props.populateSurveyDraft({... this.state.survey})
    this.setState({...this.state, error: null})
  }
  render() {
    const { survey, error, isOld } = this.state
    const { overallSuccess, positiveSuccess, negativeSuccess, categories, additionalQuestions, title, id, description } = survey

    return (
      <div className="surveyEditor">
        <DropDown
          currentSelection={""}
          name='Select Survey to Edit'
          id='surveySelector'
          dropdowns={this.state.surveyIds}
          updateFunction={(survey) => this.changeSurvey(survey)}
          renderDropdownName={true}
          currentID={0}
        />
        {isOld && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={this.copySurvey}>Copy to new, editable survey (must change id)</button>}
        <Form
          isOld={isOld}
          copySurvey={this.copySurvey}
          setDefaultSurvey={this.setDefaultSurvey}
          addNewSurvey={this.addNewSurvey}
          addSingleAnswer={this.addSingleAnswer}
          changeSingleAnswer={this.changeSingleAnswer}
          addSingleQuestion={this.addSingleQuestion}
          changeSingleQuestion={this.changeSingleQuestion}
          updateAnswer={this.updateAnswer}
          updateQuestion={this.updateQuestion}
          updateForm={this.updateForm}
          updateCategory={this.updateCategory}
          submitForm={this.populateSurveyDraft}
          addCategory={this.addCategory}
          deleteCategory={this.deleteCategory}
          updateLink={this.updateLink}
          addLink={this.addLink}
          addQuestion={this.addQuestion}
          addAnswer={this.addAnswer}
          categories={categories}
          title={title}
          description={description}
          id={id}
          additionalQuestions={additionalQuestions}
          positiveSuccess={positiveSuccess}
          negativeSuccess={negativeSuccess}
          overallSuccess={overallSuccess}
        />
        { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
        <h5>Sample Survey</h5>
        <Survey isSample />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  return {}
}

export default connect(mapStateToProps, { populateSurveyDraft } )(SurveyEditor)
