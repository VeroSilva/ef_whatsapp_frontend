import React, { useState } from "react";
import CatalogContext from "./CatalogContext";

interface CatalogProviderProps {
  children: React.ReactNode;
}

export interface CatalogType {
  additional_image_link: string;
  description: any;
  g_id: number;
  id: string;
  image_link: string;
  link: string;
  presentation: string;
  price: string;
  status: string;
  title: string;
}

export const INITIAL_STATE: CatalogType[] = [
  {
    additional_image_link: "",
    description: [],
    g_id: 0,
    id: "",
    image_link: "",
    link: "",
    presentation: "",
    price: "",
    status: "",
    title: ""
  }
];

export const TEMPLATES_DATA = "templates";

export const CatalogProvider: React.FC<CatalogProviderProps> = ({ children }) => {
  const [catalogState, setCatalogState] = useState(INITIAL_STATE);

  return (
    <CatalogContext.Provider
      value={{
        catalogState,
        setCatalogState
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};