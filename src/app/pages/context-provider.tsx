'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../context/user/UserProvider';
import { ActiveConversationProvider } from '../context/activeConversation/ActiveConversationProvider'

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ThemeProviderProps) {
  return <UserProvider><ActiveConversationProvider>{children}</ActiveConversationProvider></UserProvider>;
}