import React, { useEffect, useReducer, useState } from "react";
import TemplatesContext from "./ChatFiltersContext";
import { ChatFiltersReducer } from "./ChatFiltersReducer";

interface ChatFiltersProviderProps {
  children: React.ReactNode;
}

export interface ChatFiltersType {
  search: string,
  unread: boolean,
  overdue: boolean,
  stardDate: string,
  endDate: string,
  tags: [],
  user_assigned_id: string | undefined
}

export const INITIAL_STATE: ChatFiltersType = {
  search: "",
  unread: false,
  overdue: false,
  stardDate: "",
  endDate: "",
  tags: [],
  user_assigned_id: undefined
};

export const CHAT_FILTERS_DATA = "chat_filters";

export const ChatFiltersProvider: React.FC<ChatFiltersProviderProps> = ({ children }) => {
  const getIntialState = (): ChatFiltersType => {
    if (typeof window !== "undefined") {
      const filtersData = window.localStorage.getItem(CHAT_FILTERS_DATA);
      if (filtersData) {
        const filter = JSON.parse(filtersData) as ChatFiltersType;
        if (filter) return filter;
      }
    }
    return INITIAL_STATE;
  };

  const [chatFiltersState, dispatch] = useReducer(ChatFiltersReducer, getIntialState());
  const [chatFiltersActive, setChatFiltersActive] = useState(false);

  const setChatFiltersState = (chatFilters: ChatFiltersType): void => {
    dispatch({ type: "setChatFilters", payload: chatFilters });
  }

  useEffect(() => {
    if (
      ((chatFiltersState.stardDate && chatFiltersState.stardDate !== "") || 
        (chatFiltersState.endDate && chatFiltersState.endDate !== "")
      ) ||
      chatFiltersState.overdue ||
      chatFiltersState.unread ||
      !!chatFiltersState.tags.length ||
      (chatFiltersState.user_assigned_id && chatFiltersState.user_assigned_id !== "")
    ) setChatFiltersActive(true)
    else setChatFiltersActive(false)
  }, [chatFiltersState])

  return (
    <TemplatesContext.Provider
      value={{
        chatFiltersState,
        setChatFiltersState,
        chatFiltersActive
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};