'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../context/user/UserProvider';
import { ActiveConversationProvider } from '../context/activeConversation/ActiveConversationProvider'
import { ActiveMessageReplyProvider } from '../context/activeMessageReply/ActiveMessageReplyProvider'
import { TemplatesProvider } from '../context/templates/TemplatesProvider'

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ThemeProviderProps) {
  return (
    <UserProvider>
      <ActiveConversationProvider>
        <ActiveMessageReplyProvider>
          <TemplatesProvider>
            {children}
          </TemplatesProvider>
        </ActiveMessageReplyProvider>
      </ActiveConversationProvider>
    </UserProvider>
  );
}