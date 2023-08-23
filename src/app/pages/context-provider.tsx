'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../context/user/UserProvider';
import { ActiveConversationProvider } from '../context/activeConversation/ActiveConversationProvider'
import { ActiveMessageReplyProvider } from '../context/activeMessageReply/ActiveMessageReplyProvider'
import { TemplatesProvider } from '../context/templates/TemplatesProvider'
import { TemplatesToSendProvider } from '../context/templatesToSend/TemplatesToSendProvider';
import { ChatReadProvider } from '../context/chatsRead/ChatsReadProvider';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ThemeProviderProps) {
  return (
    <UserProvider>
      <ActiveConversationProvider>
        <ActiveMessageReplyProvider>
          <TemplatesProvider>
            <TemplatesToSendProvider>
              <ChatReadProvider>
                {children}
              </ChatReadProvider>
            </TemplatesToSendProvider>
          </TemplatesProvider>
        </ActiveMessageReplyProvider>
      </ActiveConversationProvider>
    </UserProvider>
  );
}