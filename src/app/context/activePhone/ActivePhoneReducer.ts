import { ACTIVE_PHONE } from './ActivePhoneProvider'

type ActivePhoneAction =
  | { type: 'set'; payload: number }

export const ActivePhoneReducer = (state: number, action: ActivePhoneAction) => {
  switch (action.type) {
    case 'set':
      window.localStorage.setItem(ACTIVE_PHONE, JSON.stringify(action.payload))
      return action.payload
    default:
      return state
  }
}
