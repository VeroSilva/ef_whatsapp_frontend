import { CHAT_FILTERS_DATA, ChatFiltersType } from './ChatFiltersProvider'

type ChatFiltersAction =
  | { type: 'setChatFilters'; payload: ChatFiltersType }

export const ChatFiltersReducer = (state: ChatFiltersType, action: ChatFiltersAction) => {
  switch (action.type) {
    case 'setChatFilters':
      window.localStorage.setItem(CHAT_FILTERS_DATA, JSON.stringify(action.payload))
      return action.payload
    default:
      return state
  }
}
