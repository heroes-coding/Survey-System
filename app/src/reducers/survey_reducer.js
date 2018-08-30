import _ from "lodash"
import { UPDATE_SURVEY, POPULATE_SURVEY } from '../actions'

//import { UPDATE_SURVEY } from '../actions'
let initialState = {
  id: 1,
  title: 'Student Readiness Survey',
  description: 'Please take a few minutes to complete the survey below.  The questions are designed to help better understand your academic strengths, behaviors, and values.  There are no  "right" or "wrong" answers.  Your honest responses will help your coach support you during the coming year.  Be sure to click the "Done" button at the end of the survey. Any information give will be kept private and used only to help students. Thank you!',
  additionalQuestions: {
    1: {
      name: "length",
      title: "Was this survey too long?",
      answers: ["Yes", "No", "A little bit"],
      value: null
    },
    2: {
      name: "age-old",
      title: "What's better?",
      answers: ["Dogs", "Cats"],
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

    },
    2: {
      answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
      name: "",
      title: "Please rate your agreement to the following statements about yourself",
      questions: {
        3: { value: null, question: "I start homework assignments early enough to avoid having to rush to complete them.", reverse: false },
        4: { value: null, question: "If I read a word I don't know, I take the time to look it up.", reverse: false },
        5: { value: null, question: "When I don't understand something I put it off until later.", reverse: true }
      },
      cutoffScore: 3,
      advice: "Someday Is Not a Day of the Week",
      links: [
        { link: "https://www.amazon.com/Someday-Not-Week-Denise-Brennan-Nelson-ebook/dp/B00H3VZHJS", name: "A Great Children's Book"}
      ]
    }
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
    console.log({ totalQuestionsCount, unansweredQuestionsCount, averageScores })
    return newState
  }
  return state
}
