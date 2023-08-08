import React, { useReducer, useState, useEffect } from "react";
import ActiveConversationContext from "./ActiveConversationContext";
import { ActiveConversationReducer } from "./ActiveConversationReducer";
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
  const getIntialState = (): ContainerActiveConversation => {
    if (typeof window !== "undefined") {
      const activeConversation = window.localStorage.getItem(ACTIVE_CONVERSATION);
      if (activeConversation) {
        const activeConversationData = JSON.parse(activeConversation) as ContainerActiveConversation;
        if (activeConversationData) return activeConversationData;
      }
    }
    return INITIAL_STATE;
  };

  const [activeConversationState, dispatch] = useReducer(ActiveConversationReducer, getIntialState());

  const setActiveConversation = (activeConversation: ContainerActiveConversation): void => {
    dispatch({ type: "setActiveConversation", payload: activeConversation });
  };

  const resetActiveConversation = (): void => {
    dispatch({ type: "resetActiveConversation" });
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