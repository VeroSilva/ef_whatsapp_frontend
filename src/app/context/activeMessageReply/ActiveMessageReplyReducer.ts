import { ACTIVE_CONVERSATION, ContainerActiveConversation, INITIAL_STATE } from './ActiveMessageReplyProvider'

type ActiveConversationAction =
  | { type: 'setActiveConversation'; payload: ContainerActiveConversation }
  | { type: 'resetActiveConversation' }

export const ActiveConversationReducer = (state: ContainerActiveConversation, action: ActiveConversationAction) => {
  switch (action.type) {
    case 'setActiveConversation':
      window.localStorage.setItem(ACTIVE_CONVERSATION, JSON.stringify(action.payload))
      return action.payload
    case 'resetActiveConversation':
      window.localStorage.removeItem(ACTIVE_CONVERSATION)
      return INITIAL_STATE
    default:
      return state
  }
}
