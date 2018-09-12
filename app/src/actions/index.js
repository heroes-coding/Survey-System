export const UPDATE_SURVEY = 'UPDATE_SURVEY'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const POPULATE_SURVEY = 'POPULATE_SURVEY'

export const ADD_STUDENT_NAMES = 'ADD_STUDENT_NAMES'
export const ADD_SURVEY_IDS = 'ADD_SURVEY_IDS'
export const ADD_STUDENT_IDS = 'ADD_STUDENT_IDS'
export const ADD_SURVEY_DATA = 'ADD_SURVEY_DATA'
export const SEARCH_STUDENT_NAME = 'SEARCH_STUDENT_NAME'
export const SEARCH_STUDENT_ID = 'SEARCH_STUDENT_ID'
export const SELECT_STUDENT_NAME = 'SELECT_STUDENT_NAME'
export const SELECT_STUDENT_ID = 'SELECT_STUDENT_ID'
export const SELECT_SURVEY_ID = 'SELECT_SURVEY_ID'
export const UPDATE_STUDENT_DATA = 'UPDATE_STUDENT_DATA'


export const selectSurveyId = (surveyId) => { return { type: SELECT_SURVEY_ID, surveyId }}
export const updateStudentData = (studentData) => {
  studentData.map(d => {
    d.fullName = `${d.lastName} ${d.firstName}`
    if (d.studentId) d.studentId = parseInt(d.studentId)
    d.categoryResults = {}
    d.additionalResults = {}
    d.categories.map(([i,c]) => {
      d.categoryResults[i] = {}
      c.map(([qI, v]) => {
        d.categoryResults[i][qI] = v
      })
    })
    d.additionalQuestions.map(([i,v]) => {
      d.additionalResults[i] = v
    })
    
  })
  return { type: UPDATE_STUDENT_DATA, studentData }
}
export const selectStudentId = (studentId) => {
  if (studentId) studentId = parseInt(studentId)
  return { type: SELECT_STUDENT_ID, studentId }
}
export const selectStudentName = (studentName) => { return { type: SELECT_STUDENT_NAME, studentName }}
export const searchStudentName = (name) => { return { type: SEARCH_STUDENT_NAME, name }}
export const searchStudentId = (id) => {
  if (!isNaN(id)) id = parseInt(id)
  else id = null
  return { type: SEARCH_STUDENT_ID, id }
}
export const addSurveyIds = (surveyIds) => { return { type: ADD_SURVEY_IDS, surveyIds }}
export const addStudentNames = (students) => { return { type: ADD_STUDENT_NAMES, students }}
export const addStudentIds = (studentIds) => {
  studentIds = studentIds.map(id => parseInt(id)).filter(x => !isNaN(x))
  return { type: ADD_STUDENT_IDS, studentIds }
}

export const addSurveyData = (surveyData) => {
  surveyData.map(d => {
    d.fullName = `${d.lastName} ${d.firstName}`
    if (d.studentId) d.studentId = parseInt(d.studentId)
  })
  return { type: ADD_SURVEY_DATA, surveyData }
}


export const updateSurvey = (categoryId, questionId, value) => {
  return { type: UPDATE_SURVEY, categoryId, questionId, value }
}

export const updateUserInfo = (update) => {
  return { type: UPDATE_USER_INFO, update }
}

export const populateSurveyDraft = (newSurvey) => {
  return { type: POPULATE_SURVEY, newSurvey }
}
