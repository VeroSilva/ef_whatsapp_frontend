import { TEMPLATES_DATA, TemplatesType } from './TemplatesProvider'

type TemplatesAction =
  | { type: 'setTemplates'; payload: TemplatesType[] }

export const ActiveConversationReducer = (state: TemplatesType[], action: TemplatesAction) => {
  switch (action.type) {
    case 'setTemplates':
      window.localStorage.setItem(TEMPLATES_DATA, JSON.stringify(action.payload))
      return action.payload
    default:
      return state
  }
}
