import _ from "lodash"
import { UPDATE_SURVEY } from '../actions'

//import { UPDATE_SURVEY } from '../actions'
const initialState = {
  id: 1,
  title: 'Student Readiness Survey',
  description: 'Please take a few minutes to complete the survey below.  The questions are designed to help better understand your academic strengths, behaviors, and values.  There are no  "right" or "wrong" answers.  Your honest responses will help your coach support you during the coming year.  Be sure to click the "Done" button at the end of the survey. Any information give will be kept private and used only to help students. Thank you!',
  additionalQuestions: {
    1: {
      name: "length",
      title: "Was this survey too long?",
      answers: ["Yes", "No", "A little bit"]
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
      }
    },
    2: {
      answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
      name: "",
      title: "Please rate your agreement to the following statements about yourself",
      questions: {
        3: { value: null, question: "I start homework assignments early enough to avoid having to rush to complete them.", reverse: false },
        4: { value: null, question: "If I read a word I don't know, I take the time to look it up.", reverse: false }
      }
    }
  }
}

export default function(state = initialState, action) {
  if (action.type === UPDATE_SURVEY) {
    const { categoryId, questionId, value } = action
    const newState = _.cloneDeep(state)
    newState.categories[categoryId].questions[questionId].value = value
    return newState
  }
  return state
}
