import { createContext } from "react";
import { ContainerActiveConversation } from "./ActiveConversationProvider";

export type ActiveConversationContextProps = {
  activeConversationState: ContainerActiveConversation;
  resetActiveConversation: () => void;
  setActiveConversation: Function;
};

const ActiveConversationContext = createContext({} as ActiveConversationContextProps);

export default ActiveConversationContext;
