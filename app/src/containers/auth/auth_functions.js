import { auth } from './firebase';
import axios from 'axios'
window.axios = axios


export const getUserResults = async(getById, id) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const adminIdToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/getUserResults', {adminIdToken, getById, id})
      if (res.status === 200) resolve(res.data)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const getSurveyResults = async(surveyId) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const adminIdToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/getSurveyResults', {adminIdToken, surveyId})
      if (res.status === 200) resolve(res.data)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const getUserLists = async(surveyId) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const adminIdToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/getUserLists', {adminIdToken})
      if (res.status === 200) resolve(res.data)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const getUsers = async() => {
  // these are admin level users
  let promise = new Promise(async(resolve, reject) => {
    try {
      const res = await axios.get('/getUsers')
      if (res.status === 200) resolve(res.data)
      else resolve (null)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}
// Get user data
export const getRole = async() => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/getRoleFromIdToken', {idToken})
      if (res.status === 200) resolve(res.data)
      else resolve ("student")
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const addOrModifySurvey = async(survey) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const adminIdToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/addOrModifySurvey', {adminIdToken, survey })
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const setDefaultSurvey = async(surveyId) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/setDefault', {adminIdToken: idToken, surveyId })
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const addOrModifyElevatedUser = async(user) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/addOrModifyElevatedUser', {adminIdToken: idToken, user })
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const addSurveyResults = async(surveyId, results, user) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const res = await axios.post('/addSurveyResults', { surveyId, results, user })
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}

export const deleteElevatedUser = async(user) => {
  let promise = new Promise(async(resolve, reject) => {
    try {
      const idToken = await auth.currentUser.getIdToken()
      const res = await axios.post('/deleteElevatedUser', {adminIdToken: idToken, user })
      resolve(res)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
  return promise
}


// deleteElevatedUser


// Sign Up
export const createUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password)

export const signInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password)

export const getIdToken = async() =>
  auth.currentUser.getIdToken()

export const signOut = () =>
  auth.signOut()

export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email)

export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password)

export const verifyEmail = () =>
  auth.currentUser.sendEmailVerification()
