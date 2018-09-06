import _ from "lodash"

export const STUDENT = "STUDENT"
export const ADMIN = "ADMIN"
export const COACH = "COACH"

export const defaultLink = {name:"", link: "https://", goodLink:true, badLink:false}
export const defaultCoachLink = {name:"", link: "https://"}
export const defaultAnswer = "yes"
export const defaultQuestion = { question: "", reverse: false, value: null }
export const defaultStandaloneQuestion = { title: '', answers: ['Yes','No','Maybe'], name: 'human', value: null }
export const newUser = { name: "Yoda", email: "yoda@gmail.com", role: "coach" }


export const defaultCategory = {
  answers: ["never like me", "once in a while like me", "sometimes like me", "often like me", "always like me"],
  name: "",
  title: "",
  questions: {
    1: { question: "", reverse: false, value: null }
  },
  cutoffScore: 2.4,
  advice: "",
  kudos: "",
  links: [],
  coachLinks: [],
  coachAdvice: ""
}

export const defaultSurvey = {
    id: "",
    title: '',
    description: '',
    additionalQuestions: {
      1: JSON.parse(JSON.stringify(defaultStandaloneQuestion))
    },
    categories: {
      1: JSON.parse(JSON.stringify(defaultCategory))
    },
    positiveSuccess: "You did well on [P].  Great job!",
    negativeSuccess: "You could use some help on [N].",
    overallSuccess: "Please see the advice boxes above for more advice and helpful resources!"
}
