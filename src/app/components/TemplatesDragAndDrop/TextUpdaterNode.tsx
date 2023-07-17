import { FC, useState, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import useTemplates from "../../hooks/useTemplates";

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const TextUpdaterNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const [dimensions, setDimensions] = useState({ width: 150, height: 50 });

    const positionHandle = (index: number) => {
        if (index === 1 || index === 2) {
            return (dimensions.height / 3) * index
        } else if (index === 3) {
            return 0
        } else if (index === 4) {
            return dimensions.height
        }
    }

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="a" isConnectable={isConnectable} />
            <span>
                {data.value}
            </span>

            {!data.buttons.length && (
                <Handle type="source" position={Position.Bottom} id={`handle-${data.value}`} isConnectable={isConnectable} />
            )}

            {
                data.buttons.map((button: any, index: number) => (
                    <div className="group" key={`item-${index}`}>
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={`${button.text.replace(/\s+/g, '')}`}
                            isConnectable={isConnectable}
                            key={`item-${index}`}
                            style={{ left: positionHandle(index + 1) }}
                        />
                        <span className="z-50 whitespace-nowrap fixed top-[25px] scale-0 transition-all rounded bg-gray-800 p-1 text-xs text-white group-hover:scale-100">{button.text}</span>
                    </div>
                ))
            }
        </div>
    );
};


export default TextUpdaterNode