export const UPDATE_SURVEY = 'UPDATE_SURVEY'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const POPULATE_SURVEY = 'POPULATE_SURVEY'

export const updateSurvey = (categoryId, questionId, value) => {
  return { type: UPDATE_SURVEY, categoryId, questionId, value }
}

export const updateUserInfo = (update) => {
  return { type: UPDATE_USER_INFO, update }
}

export const populateSurveyDraft = (newSurvey) => {
  return { type: POPULATE_SURVEY, newSurvey }
}
