import { User } from "@/app/interfaces/user";
import { createContext } from "react";

export type UserContextProps = {
  userState: User;
  isLoggedIn: boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
};

const UserContext = createContext({} as UserContextProps);

export default UserContext;
