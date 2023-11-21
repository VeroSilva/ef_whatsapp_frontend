import { createContext } from "react";
import { CatalogType } from "./CatalogProvider";

export type CatalogContextProps = {
    catalogState: CatalogType[],
    setCatalogState: (catalog: CatalogType[]) => void
};

const CatalogContext = createContext<CatalogContextProps>({} as CatalogContextProps);

export default CatalogContext;
