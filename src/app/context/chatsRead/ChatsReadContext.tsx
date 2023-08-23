import { createContext } from "react";

export type ChatsReadContextProps = {
    chatsReadState: string[],
    setChatsRead: Function
};

const ChatsReadContext = createContext<ChatsReadContextProps>({} as ChatsReadContextProps);

export default ChatsReadContext;
