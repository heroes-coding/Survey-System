import { combineReducers } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import surveyData from './survey_reducer'
import userInfo from './user_info_reducer'
import { surveyId, studentData, studentId, studentName, studentNameSearchTerm, studentIdSearchTerm, studentIds, surveyIds, surveyResults, studentNames } from './reports_reducers'

const rootReducer = combineReducers({
  surveyId, studentData, studentId, studentName, studentNameSearchTerm, studentIdSearchTerm, studentIds, surveyIds, surveyResults, studentNames,
  surveyData,
  userInfo
})

// making store here so I can access it outside of react components elsewhere
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore)
const store = createStoreWithMiddleware(rootReducer)

export default store
