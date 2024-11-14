import React, { useState } from "react";
import ActivePhoneContext from "./ActivePhoneContext";

interface ActivePhoneProviderProps {
  children: React.ReactNode;
}

export const INITIAL_STATE: number = 1;

export const ACTIVE_PHONE = "ActivePhone";

export const ActivePhoneProvider: React.FC<ActivePhoneProviderProps> = ({ children }) => {
  const [activePhone, setActivePhone] = useState<number>(INITIAL_STATE);

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