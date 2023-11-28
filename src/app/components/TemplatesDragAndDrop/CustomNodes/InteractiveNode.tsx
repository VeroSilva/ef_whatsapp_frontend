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

    const isDisabled = () => {
        if (!!Object.keys(interactiveData).length) {
            if (
                interactiveData.body.text !== "" &&
                interactiveData.action.sections[0].title !== "" &&
                !!interactiveData.action.sections[0].product_items.length &&
                interactiveData.footer.text !== "" &&
                interactiveData.header.text !== ""
            ) return false
            else return true
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
        }
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                <MessageInteractive handleSetData={handleSetData} savedData={savedInteractive} />

                <div className='mt-4 flex justify-center'>
                    <button
                        className='rounded-md bg-gradient-to-r from-teal-400 to-emerald-500 shadow-lg py-1 px-4 cursor-pointer flex text-slate-100 text-xs disabled:opacity-50'
                        onClick={handleSaveInteractive}
                        disabled={isDisabled()}
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