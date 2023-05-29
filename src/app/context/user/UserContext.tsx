import { User } from "@/app/interfaces/user";
import { createContext } from "react";

export type UserContextProps = {
  userState: User;
  isLoggedIn: boolean;
  loginUser: (user: User) => void;
  logoutUser: (user: User) => void;
};

const UserContext = createContext({});

export default UserContext;
