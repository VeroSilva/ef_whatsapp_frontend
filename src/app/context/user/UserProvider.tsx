import React, { useReducer, useState, useEffect } from "react";
import { User, CompanyPhones } from "@/app/interfaces/user";
import UserContext from "./UserContext";
import { UserReducer } from "./UserReducer";

interface UserProviderProps {
  children: React.ReactNode;
}

export const INITIAL_STATE: User = {
  username: "",
  token: "",
  role: "3",
  id: 0
};

export const LS_USER_ID = "userID";
export const LS_USER_DATA = "userDATA";

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const getIntialState = (): User => {
    if (typeof window !== "undefined") {
      const userData = window.localStorage.getItem(LS_USER_DATA);
      if (userData) {
        const user = JSON.parse(userData) as User;
        if (user) return user;
      }
    }
    return INITIAL_STATE;
  };

  const [userState, dispatch] = useReducer(UserReducer, getIntialState());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(userState.token !== "");

  const loginUser = (user: User): void => {
    dispatch({ type: "login", payload: user });
    setIsLoggedIn(true);
  };

  const logoutUser = (): void => {
    dispatch({ type: "logout" });
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        isLoggedIn,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};