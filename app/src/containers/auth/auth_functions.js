import { auth } from './firebase';

// Sign Up
export const createUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password)

export const signInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password)

export const signOut = () =>
  auth.signOut()

export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email)

export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password)

export const verifyEmail = () => 
  auth.currentUser.sendEmailVerification()
