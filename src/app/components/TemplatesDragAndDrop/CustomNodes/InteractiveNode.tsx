import { FC, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageInteractive } from '../../Message/MessageInteractive/MessageInteractive';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const InteractiveNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const { savedInteractive, handleInteractivesChange, id } = data
    const [interactiveData, setInteractiveData] = useState<any>({})
    const [activeTab, setActiveTab] = useState<string>("")
    const [isDisabled, setIsDisabled] = useState(true);

    const checkDisabled = () => {
        if (!!Object.keys(interactiveData).length) {
            if (activeTab === "multi") {
                if (
                    interactiveData.body.text !== "" &&
                    !!interactiveData.action.sections[0].product_items.length
                ) return false
                else return true
            } else if (activeTab === "single") {
                if (
                    interactiveData.action.product_retailer_id !== ""
                ) return false
                else return true
            }
        }
    }

    const handleSaveInteractive = () => {
        handleInteractivesChange(id, interactiveData)
    }

    const handleSetData = (data: any) => {
        setInteractiveData(data)
    }

    useEffect(() => {
        if (!!Object.keys(savedInteractive).length) {
            setInteractiveData(savedInteractive)

            if (savedInteractive.type === "product_list") {
                setActiveTab("multi")
            } else if ("product") {
                setActiveTab("single")
            }
        }
    }, [savedInteractive])

    useEffect(() => {
        if (!!Object.keys(interactiveData).length) {
            if (checkDisabled()) setIsDisabled(true)
            else setIsDisabled(false)
        }
    }, [interactiveData])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                {!savedInteractive.type &&
                    <ul className="text-xs font-medium text-center text-gray-500 rounded-lg shadow sm:flex w-full m-auto mb-4">
                        <button className="w-full" onClick={() => setActiveTab("multi")}>
                            <span className={`inline-block w-full p-2 border-r border-gray-200 font-semibold rounded-s-lg focus:ring-4 focus:ring-teal-300 focus:outline-none transition-all duration-200 ease-in-out ${activeTab === "multi" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Multi productos</span>
                        </button>
                        <button className="w-full" onClick={() => setActiveTab("single")}>
                            <span className={`inline-block w-full p-2 border-s-0 border-gray-200 font-semibold rounded-e-lg focus:ring-4 focus:outline-none focus:ring-teal-300 transition-all duration-200 ease-in-out ${activeTab === "single" ? "bg-teal-500 text-slate-100" : "bg-gray-150"}`}>Producto único</span>
                        </button>
                    </ul>
                }

                <MessageInteractive handleSetData={handleSetData} savedData={savedInteractive} activeTab={activeTab} />

                <div className='mt-4 flex justify-center'>
                    <button
                        className={`rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-xs ${isDisabled ? "disabled:opacity-50" : ""}`}
                        onClick={handleSaveInteractive}
                        disabled={isDisabled}
                    >Aceptar</button>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="manually"
                isConnectable={isConnectable}
            />
        </div>
    );
};


export default InteractiveNode