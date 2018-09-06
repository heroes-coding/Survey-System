import _ from "lodash"
import { UPDATE_SURVEY, POPULATE_SURVEY } from '../actions'

//import { UPDATE_SURVEY } from '../actions'
let initialState = {
  id: 1,
  title: '',
  description: '',
  additionalQuestions: {
  },
  categories: {
  }
}

const getQuestionCounts = (surveyData) => {
  const { categories, additionalQuestions } = surveyData
  // category questions

  // pull of length of answers for base score range (for reverse values)
  let averageScores = {}
  let allQuestions = Object.entries(categories).map(c => {
    const scoreRange = c[1].answers.length + 1
    const scores = Object.entries(c[1].questions).map(q => q[1].value && q[1].reverse ? scoreRange - q[1].value : q[1].value)
    // stores the average score by category id
    const answeredScores = scores.filter(x => x)
    averageScores[c[0]] = answeredScores.length ? answeredScores.reduce((a,b) => a+b)/answeredScores.length : 10000
    return scores
  }).reduce((acc, val) => acc.concat(val), [])
  allQuestions = allQuestions.concat(Object.entries(additionalQuestions).map(q => q[1].value))
  const totalQuestionsCount = allQuestions.length
  const unansweredQuestionsCount = allQuestions.filter(x => !x).length
  const answeredQuestionScores = allQuestions.filter(x => x)
  const answeredQuestionsCount = answeredQuestionScores.length
  return { totalQuestionsCount, unansweredQuestionsCount, averageScores }
}

initialState = { ...initialState, ...getQuestionCounts(initialState)}

export default function(state = initialState, action) {
  let newState
  if (action.type === POPULATE_SURVEY) {
    newState = action.newSurvey
  } else if (action.type === UPDATE_SURVEY) {
    const { categoryId, questionId, value } = action
    newState = _.cloneDeep(state)
    // currently only two possible kinds of questions for survey.  Single multiple choice and category based multiple choice.
    if (categoryId === 'multiple') {
      newState.additionalQuestions[questionId].value = value
    } else newState.categories[categoryId].questions[questionId].value = value
  } if (action.type === UPDATE_SURVEY || action.type === POPULATE_SURVEY) {
    const { totalQuestionsCount, unansweredQuestionsCount, averageScores } = getQuestionCounts(newState)
    newState.totalQuestionsCount = totalQuestionsCount
    newState.unansweredQuestionsCount = unansweredQuestionsCount
    newState.averageScores = averageScores
    return newState
  }
  return state
}
