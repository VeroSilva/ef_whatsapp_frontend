import React, { useReducer } from "react";
import TemplatesContext from "./TemplatesContext";
import { ActiveConversationReducer } from "./TemplatesReducer";

interface TemplatesProviderProps {
  children: React.ReactNode;
}

export interface TemplatesType {
  category: string;
  components: any;
  id: number;
  language: string;
  name: string;
  status: string;
  whatsapp_template_id: string;
}

export const INITIAL_STATE: TemplatesType[] = [
  {
    category: "",
    components: [],
    id: 0,
    language: "",
    name: "",
    status: "",
    whatsapp_template_id: ""
  }
];

export const TEMPLATES_DATA = "templates";

export const TemplatesProvider: React.FC<TemplatesProviderProps> = ({ children }) => {
  const getIntialState = (): TemplatesType[] => {
    if (typeof window !== "undefined") {
      const templates = window.localStorage.getItem(TEMPLATES_DATA);

      if (templates !== "undefined") {
        const templatesData = JSON.parse(templates as string);
        if (templatesData) return templatesData;
      }
    }
    return INITIAL_STATE;
  };

  const [templatesState, dispatch] = useReducer(ActiveConversationReducer, getIntialState());

  const setTemplatesState = (templatesPayload: TemplatesType[]): void => {
    dispatch({ type: "setTemplates", payload: templatesPayload });
  };

  return (
    <TemplatesContext.Provider
      value={{
        templatesState,
        setTemplatesState
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};