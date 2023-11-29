import { MultiProduct } from "./MultiProduct";
import { SingleProduct } from "./SingleProduct";

export const MessageInteractive = ({ handleSetData, savedData, activeTab }: { handleSetData: Function, savedData?: any, activeTab: string }) => {
    console.log(activeTab)
    return (
        <>
            {activeTab === "multi" ?
                <MultiProduct handleSetData={handleSetData} savedData={savedData} /> :
                <SingleProduct handleSetData={handleSetData} savedData={savedData} />
            }
        </>
    )
}