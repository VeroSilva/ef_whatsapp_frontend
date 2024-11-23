import { createContext } from "react";
import { UsersListType } from "./UsersListProvider";

export type UsersListContextProps = {
    usersListState: UsersListType[],
    setUsersListState: (users: UsersListType[]) => void
};

const UsersContext = createContext<UsersListContextProps>({} as UsersListContextProps);

export default UsersContext;
