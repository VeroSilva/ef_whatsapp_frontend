//@ts-ignore
// @ts-nocheck

"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import useTemplatesToSend from '../../hooks/useTemplatesToSend'

const initialNodes = [
    { id: 'client-message', type: 'input', position: { x: 0, y: 0 }, data: { label: "Mensaje cliente" } }
];

const nodeTypes = { textUpdater: TextUpdaterNode };

const TemplatesDragAndDrop = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [jsonToSend, setJsonToSend] = useState([]);
    const { templatesToSendState } = useTemplatesToSend();

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const templateData = JSON.parse(event.dataTransfer.getData('template'));

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = {
                id: templateData.name,
                type: 'textUpdater',
                position,
                data: { template: templateData },
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

    useEffect(() => {
        const edgeData = [];
        edges.map((edge) => {
            const { id, source, sourceHandle, target, targetHandle } = edge
            const templateData = templatesToSendState.filter((template) => template.name === target)[0]
            const { position, height, width } = nodes.filter((node) => node.id === target)[0]

            edgeData.push({
                id,
                source,
                sourceHandle: sourceHandle ?? "NA",
                target,
                targetHandle,
                template_data: {
                    type: "template",
                    template: templateData
                },
                node: {
                    position,
                    width,
                    height
                }
            })
        })

        setJsonToSend()
    }, [edges, templatesToSendState, nodes])

    useCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, []);

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

                <button className='main-button absolute'>Guardar cambios</button>

                <Sidebar />
            </ReactFlowProvider>
        </div>
    );
};

export default TemplatesDragAndDrop;