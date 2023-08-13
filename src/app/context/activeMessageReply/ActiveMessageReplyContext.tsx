import { Message } from "@/app/interfaces/conversations";
import { createContext } from "react";

export type ActiveMessageReplyContextProps = {
  activeMessageReply: Message;
  setActiveMessageReply: (messasge: Message) => void;
};

const ActiveConversationContext = createContext({} as ActiveMessageReplyContextProps);

export default ActiveConversationContext;
