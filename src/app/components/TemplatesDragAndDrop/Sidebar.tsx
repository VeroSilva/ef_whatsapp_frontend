"use client"

import React from 'react';
import useTemplates from "../../hooks/useTemplates";

const DndNodes = () => {
    const { templatesState } = useTemplates();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, template: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('template', JSON.stringify(template));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside>
            {
                templatesState.map((template, index) => {
                    return (
                        <div key={index} className="dndnode" onDragStart={(event) => onDragStart(event, 'default', template)} draggable>
                            {template.name}
                        </div>
                    )
                })
            }
        </aside>
    );
};

export default DndNodes;