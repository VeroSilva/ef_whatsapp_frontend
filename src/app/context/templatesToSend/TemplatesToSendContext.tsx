import { createContext } from "react";

export type TemplatesToSendContextProps = {
    templatesToSendState: any[],
    setTemplatesToSendState: Function
};

const TemplatesToSendContext = createContext<TemplatesToSendContextProps>({} as TemplatesToSendContextProps);

export default TemplatesToSendContext;
