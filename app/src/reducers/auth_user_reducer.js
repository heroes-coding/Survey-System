import { UPDATE_AUTH_USER } from '../actions'

export default function(state = null, action) {
  if (action.type === UPDATE_AUTH_USER) {
    return action.authUser
  }
  return state
}
