import React, { useState } from "react";
import TagsContext from "./TagsContext";

interface TagsProviderProps {
  children: React.ReactNode;
}

export interface TagsType {
  color: string;
  description: any;
  id: number;
  name: string;
}

export const INITIAL_STATE: TagsType[] = [
  {
    color: "",
    description: "",
    id: 0,
    name: ""
  }
];

export const TagsProvider: React.FC<TagsProviderProps> = ({ children }) => {
  const [tagsState, setTagsState] = useState(INITIAL_STATE);

  return (
    <TagsContext.Provider
      value={{
        tagsState,
        setTagsState
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};