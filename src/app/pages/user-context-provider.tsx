'use client';

import { ReactNode } from 'react';
import { UserProvider } from '../context/user/UserProvider';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ContextProvider({ children }: ThemeProviderProps) {
  return <UserProvider>{children}</UserProvider>;
}