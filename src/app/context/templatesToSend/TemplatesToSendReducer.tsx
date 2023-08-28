import { TEMPLATES_TO_SEND_DATA, TemplatesToSendType } from './TemplatesToSendProvider'

type TemplatesAction =
  | { type: 'setTemplatesToSend'; payload: TemplatesToSendType[] }

export const ActiveConversationReducer = (state: TemplatesToSendType[], action: TemplatesAction) => {
  switch (action.type) {
    case 'setTemplatesToSend':
      window.localStorage.setItem(TEMPLATES_TO_SEND_DATA, JSON.stringify(action.payload))
      return action.payload
    default:
      return state
  }
}
