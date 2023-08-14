import useTemplatesToSend from '@/app/hooks/useTemplatesToSend';
import { FC, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { TemplateDetail } from '../TemplateList/TemplateDetail/TemplateDetail';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const TextUpdaterNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [dimensions, setDimensions] = useState({ width: 150, height: 50 });
    const { template } = data;
    const [readyToSend, setReadyToSend] = useState(false);
    const [templateToSend, setTemplateToSend] = useState<any>({});
    const { templatesToSendState, setTemplatesToSendState } = useTemplatesToSend();

    const buttons = template.components.find((item: any) => item.type === "BUTTONS");
    const buttonsData = buttons ? buttons.buttons.filter((btn: any) => btn.type === "QUICK_REPLY") : []

    const positionHandle = (index: number) => {
        if (index === 1 || index === 2) {
            return (dimensions.height / 3) * index
        } else if (index === 3) {
            return 0
        } else if (index === 4) {
            return dimensions.height
        }
    }

    useEffect(() => {
        const templateIndex = templatesToSendState.findIndex((template: any) => template.id === templateToSend.id);
        const updatedTemplates = [...templatesToSendState];

        if (readyToSend) {
            if (templateIndex !== -1) {
                updatedTemplates[templateIndex] = templateToSend;
            } else {
                updatedTemplates.push(templateToSend);
            }
            setTemplatesToSendState(updatedTemplates);
        }
    }, [readyToSend, templateToSend]);

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id={template.name} isConnectable={isConnectable} />

            <TemplateDetail template={template} setIsReadyToSend={setReadyToSend} setTemplateToSend={setTemplateToSend} />

            {
                buttonsData.map((button: any, index: number) => (
                    <div className="group" key={`item-button-${index}`}>
                        <Handle
                            type="source"
                            position={Position.Bottom}
                            id={`${button.text.replace(/\s+/g, '')}`}
                            isConnectable={isConnectable}
                            style={{ left: positionHandle(index + 1) }}
                        />
                        <span className="z-50 whitespace-nowrap fixed bottom-2 scale-0 transition-all rounded bg-gray-800 p-1 text-xs text-white group-hover:scale-100">{button.text}</span>
                    </div>
                ))
            }
        </div>
    );
};


export default TextUpdaterNode