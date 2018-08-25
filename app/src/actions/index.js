export const UPDATE_SURVEY = 'UPDATE_SURVEY'

export const updateSurvey = (categoryId, questionId, value) => {
  return { type: UPDATE_SURVEY, categoryId, questionId, value }
}
