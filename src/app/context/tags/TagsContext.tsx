import { createContext } from "react";
import { TagsType } from "./TagsProvider";

export type TagsContextProps = {
    tagsState: TagsType[],
    setTagsState: (tags: TagsType[]) => void
};

const TagsContext = createContext<TagsContextProps>({} as TagsContextProps);

export default TagsContext;
