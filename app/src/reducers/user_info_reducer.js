import { UPDATE_USER_INFO } from '../actions'
import { STUDENT, ADMIN, COACH } from '../constants'

const emptyUser = {
  displayName: null,
  email: null,
  emailVerified: null,
  authLevel: STUDENT
}

export default function(state = emptyUser, action) {
  if (action.type === UPDATE_USER_INFO) {
    if (action.update === "RESET") return {... emptyUser}
    const newState = {...state}
    const entries = Object.entries(action.update)
    for (let e = 0; e < entries.length; e++) {
      const [ key, value ] = entries[e]
      newState[action.key] = action.value
    }
    return newState
  }
  return state
}
