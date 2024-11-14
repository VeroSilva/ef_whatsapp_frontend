import { createContext } from "react";

export type ActivePhoneContextProps = {
  activePhone: number;
  setActivePhone: Function;
};

const ActivePhoneContext = createContext({} as ActivePhoneContextProps);

export default ActivePhoneContext;
