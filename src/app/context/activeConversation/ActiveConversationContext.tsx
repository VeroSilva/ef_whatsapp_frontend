import { Contact } from "@/app/interfaces/conversations";
import { createContext } from "react";

export type ActiveConversationContextProps = {
  activeContact: Contact;
  conversationId: number;
  reset: () => void;
  setActive: () => void;
};

const ActiveConversationContext = createContext({});

export default ActiveConversationContext;
