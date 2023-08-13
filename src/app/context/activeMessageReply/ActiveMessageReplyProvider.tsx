import React, { useState } from "react";
import ActiveConversationContext from "./ActiveMessageReplyContext";
import { Message } from "@/app/interfaces/conversations";

interface ActiveMessageReplyProviderProps {
  children: React.ReactNode;
}

export const initialStateActiveMessageReply: Message = {
  conversation_id: 0,
  id: 0,
  created_at: "",
  message: {
    body: "",
    id: 0,
    id_whatsapp: "",
    url: "",
    sha256: "",
    mime_type: "",
    file_size: 0,
    filename: 0,
    media_id: "",
    emoji: "",
    latitude: "",
    longitude: "",
    voice: "",
    animated: "",
    reacted_message_id: "",
    template: {},
    response_to: "",
    text: "",
    caption: "",
  },
  message_type: "",
  read: false,
  status: ""
};

export const ACTIVE_CONVERSATION = "activeMessage";

export const ActiveMessageReplyProvider: React.FC<ActiveMessageReplyProviderProps> = ({ children }) => {
  const [activeMessageReply, setActiveMessageReply] = useState<Message>(initialStateActiveMessageReply)

  return (
    <ActiveConversationContext.Provider
      value={{
        activeMessageReply,
        setActiveMessageReply
      }}
    >
      {children}
    </ActiveConversationContext.Provider>
  );
};