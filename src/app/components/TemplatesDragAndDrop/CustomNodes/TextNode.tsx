import { FC, useCallback, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { EmojiDropdown } from '../../EmojiDropdown/EmojiDropdown';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const TextNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [localMessage, setLocalMessage] = useState("")
    const { savedMessage, handleMessagesChange, id } = data
    const onChange = useCallback((evt: any) => {
        setLocalMessage(evt.target.value)
    }, []);
    const handleBlur = () => {
        handleMessagesChange(id, localMessage)
    }

    useEffect(() => {
        if (savedMessage !== "") setLocalMessage(savedMessage)
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="text-node" isConnectable={isConnectable} />

            <div>
                <label htmlFor="text">Texto:</label>

                <div className="flex relative w-full">
                    <textarea
                        id="text"
                        name="text"
                        className="nodrag bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:outline-none focus:ring focus:border-sky-500 block w-full pr-6 p-2.5"
                        rows={2}
                        placeholder="Escribe tu mensaje"
                        value={localMessage}
                        onBlur={handleBlur}
                        onChange={onChange}
                    ></textarea>
                    <EmojiDropdown setMessageToSend={setLocalMessage} messageToSend={localMessage} containerStyles="absolute top-0 bottom-0 right-2 w-6 h-6 my-[auto] mx-0" emojiStyles="w-6 h-6 text-teal-600" />
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="text-node"
                isConnectable={isConnectable}
            />
        </div>
    );
};


export default TextNode