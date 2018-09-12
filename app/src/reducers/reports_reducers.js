import { SELECT_SURVEY_ID, UPDATE_STUDENT_DATA, SELECT_STUDENT_NAME, SELECT_STUDENT_ID, ADD_STUDENT_NAMES, ADD_SURVEY_IDS, ADD_STUDENT_IDS, ADD_SURVEY_DATA, SEARCH_STUDENT_NAME, SEARCH_STUDENT_ID } from '../actions'

export const studentId = (state=null, action) => {
  if (action.type === SELECT_STUDENT_ID ) return action.studentId
  return state
}

export const surveyId = (state=null, action) => {
  if (action.type === SELECT_SURVEY_ID ) return action.surveyId
  return state
}



export const studentData = (state=[], action) => {
  if (action.type === UPDATE_STUDENT_DATA ) return action.studentData
  return state
}

export const studentName = (state=null, action) => {
  if (action.type === SELECT_STUDENT_NAME ) return action.studentName
  return state
}


export const studentNameSearchTerm = (state=null, action) => {
  if (action.type === SEARCH_STUDENT_NAME ) return action.name
  return state
}

export const studentIdSearchTerm = (state=null, action) => {
  if (action.type === SEARCH_STUDENT_ID ) return action.id
  return state
}

export const studentIds = (state=[], action) => {
  if (action.type === ADD_STUDENT_IDS ) return action.studentIds
  return state
}

export const surveyIds = (state=[], action) => {
  if (action.type === ADD_SURVEY_IDS ) return action.surveyIds
  return state
}

export const surveyResults = (state=[], action) => {
  if (action.type === ADD_SURVEY_DATA ) return action.surveyData
  return state
}

export const studentNames = (state=[], action) => {
  if (action.type === ADD_STUDENT_NAMES ) return action.students
  return state
}
