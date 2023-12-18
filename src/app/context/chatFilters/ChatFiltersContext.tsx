import { createContext } from "react";
import { ChatFiltersType } from "./ChatFiltersProvider";

export type ChatFiltersContextProps = {
    chatFiltersState: ChatFiltersType,
    setChatFiltersState: Function,
    chatFiltersActive: boolean
};

const ChatFiltersContext = createContext<ChatFiltersContextProps>({} as ChatFiltersContextProps);

export default ChatFiltersContext;
