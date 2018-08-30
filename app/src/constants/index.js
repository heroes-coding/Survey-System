import _ from "lodash"

export const STUDENT = "STUDENT"
export const ADMIN = "ADMIN"
export const COACH = "COACH"

export const defaultCategory = {
  answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
  name: "Steadfastness",
  title: "Please rate your agreement to the following statements about yourself",
  questions: {
    1: { question: "I give up when faced with Vader", reverse: false, value: null }
  },
  cutoffScore: 2,
  advice: "Do. There is no try.",
  links: []
}

export const defaultSurvey = {
    id: "Readiness Survey",
    title: 'Sample Title',
    description: 'Sample Survey Description',
    additionalQuestions: {
      1: {
        name: "length",
        title: "Is this a biased survey?",
        answers: ["Yes, but just a little", "No", "A little bit less than a little"],
        value: null
      }
    },
    categories: {
      1: _.clone(defaultCategory, true)
    }
}
