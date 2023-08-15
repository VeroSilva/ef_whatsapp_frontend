import React, { useState } from "react";
import TemplatesContext from "./TemplatesContext";

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
  const [templatesState, setTemplatesState] = useState(INITIAL_STATE);

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