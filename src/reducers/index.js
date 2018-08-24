import { combineReducers } from 'redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import surveyData from './survey_reducer'

const rootReducer = combineReducers({
  surveyData
})

// making store here so I can access it outside of react components elsewhere
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore)
const store = createStoreWithMiddleware(rootReducer)

export default store
