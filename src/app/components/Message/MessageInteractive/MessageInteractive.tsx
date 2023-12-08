import { MultiProduct } from "./MultiProduct";
import { SingleProduct } from "./SingleProduct";

export const MessageInteractive = ({ handleSetData, savedData, activeTab }: { handleSetData: Function, savedData?: any, activeTab: string }) => {
    if (
        savedData &&
        (savedData.type === "product_list" && activeTab === "multi" ||
            savedData.type === "product" && activeTab === "single")
    ) {
        return (
            <>
                {activeTab === "multi" ?
                    <MultiProduct handleSetData={handleSetData} savedData={savedData} /> :
                    <SingleProduct handleSetData={handleSetData} savedData={savedData} />
                }
            </>
        )
    } else {
        return (
            <>
                {activeTab === "multi" ?
                    <MultiProduct handleSetData={handleSetData} /> :
                    <SingleProduct handleSetData={handleSetData} />
                }
            </>
        )
    }
}