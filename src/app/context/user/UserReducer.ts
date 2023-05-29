import { User } from '../../interfaces/user'
import { INITIAL_STATE, LS_USER_ID, LS_USER_DATA } from './UserProvider'

type UserAction =
  | { type: 'login'; payload: User }
  | { type: 'logout'; payload: User }
  | { type: 'set'; payload: User }

export const UserReducer = (state: User, action: UserAction) => {
  switch (action.type) {
    case 'login':
      window.localStorage.setItem(LS_USER_ID, action.payload.token)
      window.localStorage.setItem(LS_USER_DATA, JSON.stringify(action.payload))
      return action.payload
    case 'logout':
      window.localStorage.clear();
      return INITIAL_STATE
    case 'set':
      return action.payload
    default:
      return state
  }
}
