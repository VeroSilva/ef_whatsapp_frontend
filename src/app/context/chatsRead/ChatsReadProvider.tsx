import React, { useState } from "react";
import ChatsReadContext from "./ChatsReadContext";

interface ChatsReadProviderProps {
  children: React.ReactNode;
}

export const ChatReadProvider: React.FC<ChatsReadProviderProps> = ({ children }) => {
  const [chatsReadState, setChatsRead] = useState<string[]>([]);

  return (
    <ChatsReadContext.Provider
      value={{
        chatsReadState,
        setChatsRead
      }}
    >
      {children}
    </ChatsReadContext.Provider>
  );
};