import React, { useState } from "react";
import UsersContext from "./UsersListContext";

interface UsersListProviderProps {
  children: React.ReactNode;
}

export interface UsersListType {
  company_id: string;
  company_phones_ids: string;
  id: number;
  image: string | null;
  password: string;
  role: string;
  username: string;
  weight: number;
  work_schedule: any[];   
}

export const INITIAL_STATE: UsersListType[] = [
  {
    company_id: "",
    company_phones_ids: "",
    id: 0,
    image: null,
    password: "",
    role: "",
    username: "",
    weight: 0,
    work_schedule: [],   
  }
];

export const UsersListProvider: React.FC<UsersListProviderProps> = ({ children }) => {
  const [usersListState, setUsersListState] = useState(INITIAL_STATE);

  return (
    <UsersContext.Provider
      value={{
        usersListState,
        setUsersListState
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};