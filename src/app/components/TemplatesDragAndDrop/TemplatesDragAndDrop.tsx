//@ts-ignore
// @ts-nocheck

"use client"

import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';
import TextUpdaterNode from './TextUpdaterNode.tsx';
import './index.scss';

const initialNodes = [
    { id: 'client-message', type: 'textUpdater', position: { x: 0, y: 0 }, data: { value: "Mensaje cliente", buttons: [] } }
];

const nodeTypes = { textUpdater: TextUpdaterNode };

const TemplatesDragAndDrop = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const nodeText = event.dataTransfer.getData('nodeText');
            const nodeButtons = event.dataTransfer.getData('nodeButtons');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: nodeText,
                type: 'textUpdater',
                position,
                data: { value: nodeText, buttons: JSON.parse(nodeButtons) },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </div>
                <Sidebar />
            </ReactFlowProvider>
        </div>
    );
};

export default TemplatesDragAndDrop;