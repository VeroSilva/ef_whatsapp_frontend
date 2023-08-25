import React, { useState } from "react";
import ActiveConversationContext from "./ActiveConversationContext";
import { Contact, Tag } from "@/app/interfaces/conversations";

interface ActiveConversationProviderProps {
  children: React.ReactNode;
}

export interface ContainerActiveConversation {
  contact: Contact,
  id: number,
  tags: Tag[]
}

export const INITIAL_STATE: ContainerActiveConversation = {
  contact: {
    country: "",
    email: "",
    name: "",
    phone: "",
    tag_id: "",
    id: 0
  },
  id: 0,
  tags: []
};

export const ACTIVE_CONVERSATION = "activeConversation";

export const ActiveConversationProvider: React.FC<ActiveConversationProviderProps> = ({ children }) => {
  const [activeConversationState, setActiveConversation] = useState<ContainerActiveConversation>(INITIAL_STATE);

  const resetActiveConversation = (): void => {
    setActiveConversation(INITIAL_STATE)
  };

  return (
    <ActiveConversationContext.Provider
      value={{
        activeConversationState,
        setActiveConversation,
        resetActiveConversation
      }}
    >
      {children}
    </ActiveConversationContext.Provider>
  );
};