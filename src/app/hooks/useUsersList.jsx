import { useContext } from "react";
import UsersListContext from "../context/usersList/UsersListContext";

const useUsersList = () => useContext(UsersListContext);

export default useUsersList;
