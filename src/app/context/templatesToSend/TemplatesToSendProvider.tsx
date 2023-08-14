import React, { useState } from "react";
import TemplatesContext from "./TemplatesToSendContext";

interface TemplatesToSendProviderProps {
  children: React.ReactNode;
}

interface TemplateToSendContent {
  id: number,
  name: string,
  language: {
    code: string
  },
  components: any[]
}

export interface TemplatesToSendType {
  type: string;
  template: TemplateToSendContent;
}

export const INITIAL_STATE: TemplatesToSendType[] = [
  {
    type: "",
    template: {} as TemplateToSendContent,
  }
];

export const TEMPLATES_TO_SEND_DATA = "templates_to_send";

export const TemplatesToSendProvider: React.FC<TemplatesToSendProviderProps> = ({ children }) => {
  const [templatesToSendState, setTemplatesToSendState] = useState(INITIAL_STATE);

  return (
    <TemplatesContext.Provider
      value={{
        templatesToSendState,
        setTemplatesToSendState
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};