import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyBeQ2Y7EjkzdAnU9j1zGEVczbWwJeNW6g4",
  authDomain: "studentequity-783ff.firebaseapp.com",
  databaseURL: "https://studentequity-783ff.firebaseio.com",
  projectId: "studentequity-783ff",
  storageBucket: "studentequity-783ff.appspot.com",
  messagingSenderId: "590767660493"
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
