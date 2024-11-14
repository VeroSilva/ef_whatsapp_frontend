'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../context/user/UserProvider';
import { ActiveConversationProvider } from '../context/activeConversation/ActiveConversationProvider'
import { ActiveMessageReplyProvider } from '../context/activeMessageReply/ActiveMessageReplyProvider'
import { TemplatesProvider } from '../context/templates/TemplatesProvider'
import { TemplatesToSendProvider } from '../context/templatesToSend/TemplatesToSendProvider';
import { ChatReadProvider } from '../context/chatsRead/ChatsReadProvider';
import { CatalogProvider } from '../context/catalog/CatalogProvider';
import { SocketProvider } from '../context/socket/SocketContext';
import { TagsProvider } from '../context/tags/TagsProvider';
import { ChatFiltersProvider } from '../context/chatFilters/ChatFiltersProvider';
import { ActivePhoneProvider } from '../context/activePhone/ActivePhoneProvider';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ThemeProviderProps) {
  return (
    <UserProvider>
      <SocketProvider>
        <ActivePhoneProvider>
          <ActiveConversationProvider>
            <ActiveMessageReplyProvider>
              <TemplatesProvider>
                <TagsProvider>
                  <CatalogProvider>
                    <TemplatesToSendProvider>
                      <ChatReadProvider>
                        <ChatFiltersProvider>
                          {children}
                        </ChatFiltersProvider>
                      </ChatReadProvider>
                    </TemplatesToSendProvider>
                  </CatalogProvider>
                </TagsProvider>
              </TemplatesProvider>
            </ActiveMessageReplyProvider>
          </ActiveConversationProvider>
        </ActivePhoneProvider>
      </SocketProvider>
    </UserProvider>
  );
}