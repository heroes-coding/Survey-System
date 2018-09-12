import { createSelector } from 'reselect'
import Fuse from 'fuse.js'

const studentNameSearchTerm = state => state.studentNameSearchTerm
const studentIdSearchTerm = state => state.studentIdSearchTerm
const studentIds = state => state.studentIds
const studentData = state => state.studentData
const surveyIds = state => state.surveyIds
const surveyResults = state => state.surveyResults // this is a list of survey results for a given survey
const studentNames = state => state.studentNames
const surveyData = state => state.surveyData // this is a single / empty full survey
const studentName = state => state.studentName
const studentId = state => state.studentId
const surveyId = state => state.surveyId


const getSurveyData = createSelector(
  surveyResults,
  surveyData,
  surveyId,
  studentId,
  studentName,
  (results, survey, surveyId, studentId, studentName) => {
    if (!results.length || survey.id !== results[0].id) return { survey, results }
    const catKeys = Object.keys(survey.categories)
    const qKeys = Object.keys(survey.additionalQuestions)
    for (let c = 0; c < catKeys.length; c++) {
      const catKey = catKeys[c]
      const cat = survey.categories[catKey]
      cat.results = []
      const catQKeys = Object.keys(cat.questions)
      for (let q = 0; q < catQKeys.length; q++) {
        const qKey = catQKeys[q]
        cat.questions[qKey].results = []
      }
    }
    for (let q = 0; q < qKeys.length; q++) {
      const qKey = qKeys[q]
      survey.additionalQuestions[qKey].results = []
    }
    const n = results.length
    for (let r = 0; r < n; r++) {
      const result = results[r]
      const nCats = result.categories.length
      const nQ = result.additionalQuestions.length
      for (let q = 0; q < nQ; q++) {
        const [ qNumber, qAnswer ] = result.additionalQuestions[q]
        if (survey.additionalQuestions[qNumber]) survey.additionalQuestions[qNumber].results.push(qAnswer)
      }
      for (let c = 0; c < nCats; c++) {
        const [ catId, catQs ] = result.categories[c]
        if (!survey.categories[catId]) continue // not loaded yet
        const nQ = catQs.length
        const maxScore = survey.categories[catId].answers.length+1
        let total = 0
        for (let q = 0; q < nQ; q++) {
          let [ qId, qAns ] = catQs[q]
          const reverse = survey.categories[catId].questions[qId].reverse
          qAns = reverse ? maxScore - qAns : qAns
          total += qAns
          survey.categories[catId].questions[qId].results.push(qAns)
        }
        survey.categories[catId].results.push(total/nQ)
      }
    }
    return { results, survey }
  }
)

const getNamesList = createSelector(
  studentNames,
  (names) => {
    const options = {
      shouldSort: true,
      threshold: 0.25,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['handle']
    }
    return new Fuse(names, options)
  }
)

const getIdsList = createSelector(
  studentIds,
  (ids) => {
    const options = {
      shouldSort: true,
      threshold: 0.25,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['handle']
    }
    const fuse = new Fuse(ids.map(x => String(x)), options)
    window.fuse = fuse
    return fuse
  }
)


const getFilteredNames = createSelector(
  studentNames,
  getNamesList,
  studentNameSearchTerm,
  (names, fuse, term) => {
    if (!term) return names
    const results = fuse.search(term).slice(0,15)
    const studentNames = []
    results.map(r => studentNames.push(fuse.list[r]))
    return studentNames
  }
)

const getFilteredIds = createSelector(
  studentIds,
  getIdsList,
  studentIdSearchTerm,
  (ids,fuse,term) => {
    if (!term) return ids
    const results = fuse.search(String(term)).slice(0,15)
    const studentIds = []
    results.map(r => studentIds.push(parseInt(fuse.list[r])))
    return studentIds
  }
)


export default createSelector(
  studentData,
  studentId,
  studentName,
  getFilteredIds,
  getFilteredNames,
  surveyIds,
  surveyId,
  getSurveyData,
  (data, id, name, studentIds, studentNames, surveyIds, surveyId, { results, survey }) => {
    const hasData = data.length > 0
    if (id && hasData) {
      data = data.filter(d => d.studentId === id )
    }
    if (name && hasData) {
      data = data.filter(d => d.fullName === name )
    }
    if (surveyId && hasData) {
      data = data.filter(d => d.id === surveyId)
    }
    if (hasData) {
      const names = data.map(d => d.fullName)
      const ids = data.map(d => d.studentId)
      studentIds = studentIds.filter(id => ids.includes(id))
      studentNames = studentNames.filter(name => names.includes(name))
      if (surveyId) {
        surveyIds = surveyIds.filter(id => surveyId === id)
      } else {
        const usedSurveyIds = data.map(d => d.id)
        surveyIds = surveyIds.filter(id => usedSurveyIds.includes(id))
      }
    }
    if (results.length) {
      const names = results.map(d => d.fullName)
      const ids = results.map(d => d.studentId)
      studentIds = studentIds.filter(id => ids.includes(id))
      studentNames = studentNames.filter(name => names.includes(name))
    }
    // some ugly extra handling of ids and names here and everywhere, because there is no one single identifier for each student
    if (id && !name && studentNames.length===1) name = studentNames[0]
    if (name && !id && studentIds.length===1) id = studentIds[0]
    return {studentData: data, studentIds, studentNames, surveyIds, results, survey, studentId: id, studentName: name }
  }
)
