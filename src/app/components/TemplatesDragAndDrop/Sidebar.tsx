"use client"

import React from 'react';
import useTemplates from "../../hooks/useTemplates";

const DndNodes = () => {
    const { templatesState } = useTemplates();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeText: string, buttons: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('nodeText', nodeText);
        event.dataTransfer.setData('nodeButtons', JSON.stringify(buttons));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            {
                templatesState.map((template, index) => {
                    const buttons = template.components.find((item: any) => item.type === "BUTTONS");
                    const buttonsData = buttons ? buttons.buttons.filter((btn: any) => btn.type === "QUICK_REPLY") : []

                    return (
                        <div key={index} className="dndnode" onDragStart={(event) => onDragStart(event, 'default', template.name, buttonsData)} draggable>
                            {template.name}
                        </div>
                    )
                })
            }
        </aside>
    );
};

export default DndNodes;