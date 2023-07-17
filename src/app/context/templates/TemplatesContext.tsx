import { createContext } from "react";
import { TemplatesType } from "./TemplatesProvider";

export type TemplatesContextProps = {
    templatesState: TemplatesType[],
    setTemplatesState: (templates: TemplatesType[]) => void
};

const TemplatesContext = createContext<TemplatesContextProps>({} as TemplatesContextProps);

export default TemplatesContext;
