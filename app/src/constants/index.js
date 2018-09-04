import _ from "lodash"

export const STUDENT = "STUDENT"
export const ADMIN = "ADMIN"
export const COACH = "COACH"

export const defaultLink = {name:"Google It!", link: "https://google.com", goodLink:true, badLink:false}
export const defaultAnswer = "yes"
export const defaultQuestion = { question: "I like turtles", reverse: false, value: null }
export const defaultStandaloneQuestion = { title: 'Are you human?', answers: ['Yes','No','Maybe'], name: 'human', value: null }
export const newUser = { name: "Yoda", email: "yoda@gmail.com", role: "coach" }


export const defaultCategory = {
  answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
  name: "Awesomeness",
  title: "Please rate your agreement to the following statements about yourself",
  questions: {
    1: { question: "I give up when faced with Vader", reverse: true, value: null }
  },
  cutoffScore: 2.4,
  advice: "Do. There is no try.",
  kudos: "Well done, young padewon.",
  links: [_.clone(defaultLink,true)]
}

export const defaultSurvey = {
    id: "Readiness Survey",
    title: 'Sample Title',
    description: 'Sample Survey Description',
    additionalQuestions: {
      1: {
        name: "bias",
        title: "Is this a biased survey?",
        answers: ["Yes, but just a little", "No", "A little bit less than a little"],
        value: null
      }
    },
    categories: {
      1: _.clone(defaultCategory, true)
    }
}
