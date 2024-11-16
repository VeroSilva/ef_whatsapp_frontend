import React, { useReducer } from "react";
import ActivePhoneContext from "./ActivePhoneContext";
import { ActivePhoneReducer } from "./ActivePhoneReducer";

interface ActivePhoneProviderProps {
  children: React.ReactNode;
}

export const INITIAL_STATE: number = 1;

export const ACTIVE_PHONE = "ActivePhone";

export const ActivePhoneProvider: React.FC<ActivePhoneProviderProps> = ({ children }) => {
  const getIntialState = (): number => {
    if (typeof window !== "undefined") {
      const activePhoneData = window.localStorage.getItem(ACTIVE_PHONE);

      if (activePhoneData) {
        const phone = JSON.parse(activePhoneData) as number;
        if (phone) return phone;
      }
    }
    return INITIAL_STATE;
  };
  const [activePhone, dispatch] = useReducer(ActivePhoneReducer, getIntialState());

  const setActivePhone = (phoneId: number): void => {
    dispatch({ type: "set", payload: phoneId });
  };

  return (
    <ActivePhoneContext.Provider
      value={{
        activePhone,
        setActivePhone
      }}
    >
      {children}
    </ActivePhoneContext.Provider>
  );
};