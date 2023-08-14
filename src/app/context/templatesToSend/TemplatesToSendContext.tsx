import { createContext } from "react";

export type TemplatesToSendContextProps = {
    templatesToSendState: any[],
    setTemplatesToSendState: (templates: any[]) => void
};

const TemplatesToSendContext = createContext<TemplatesToSendContextProps>({} as TemplatesToSendContextProps);

export default TemplatesToSendContext;
