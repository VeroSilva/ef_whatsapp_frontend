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
import TemplateNode from './CustomNodes/TemplateNode.tsx';
import './index.scss';
import useTemplatesToSend from '../../hooks/useTemplatesToSend'
import useUser from "../../hooks/useUser"
import useTemplates from "../../hooks/useTemplates"
import { usePathname } from "next/navigation"
import { getFlows, updateFlows } from '@/app/services/api';
import { uniqueIdGenerator } from '@/app/utils/functions';

const initialNodes = [
    { id: 'client-message', type: 'input', position: { x: 0, y: 0 }, data: { label: "Mensaje cliente" } }
];

const nodeTypes = { templateNode: TemplateNode };

const TemplatesDragAndDrop = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [jsonToSend, setJsonToSend] = useState([]);
    const { templatesToSendState } = useTemplatesToSend();
    const { userState } = useUser();
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);
    const { templatesState } = useTemplates();

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
                id: uniqueIdGenerator(),
                type: 'templateNode',
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
    const handleSaveFlow = () => {
        updateFlows(userState.token, phoneId, jsonToSend).then((res) => {
            setJsonToSend([])
            console.log(res)
        })
    }

    useEffect(() => {
        if (templatesToSendState.length > 1) {
            const jsonData = [];

            edges.map((edge) => {
                const { id: edgeID, source, sourceHandle, target, targetHandle } = edge
                const targetNode = nodes.filter((node) => node.id === target)[0]
                const sourceNode = nodes.filter((node) => node.id === source)[0]
                const templateData = templatesToSendState.filter((t) => t.id === targetNode.data.template.id)[0]

                jsonData.push({
                    id: edgeID,
                    source: sourceNode.data.template ? sourceNode.data.template.name : "client-message",
                    sourceHandle: sourceHandle ?? "manually",
                    target: targetNode.data.template.name,
                    targetHandle: targetHandle,
                    template_data: {
                        type: "template",
                        template: templateData
                    },
                    node: {
                        position: targetNode.position,
                        type: 'templateNode',
                        id: targetNode.id,
                        targetEdgeId: target,
                        sourceEdgeId: source
                    }
                })
            })

            setJsonToSend(jsonData)
        }
    }, [edges, templatesToSendState, nodes]);

    useEffect(() => {
        if (!(templatesState.length === 1 && templatesState[0].id === 0)) {
            getFlows(userState.token, phoneId).then((res) => {
                res.map((item) => {
                    const template = templatesState.find(template => template.id === item.template_data.template.id);
                    const { id, position, type, targetEdgeId, sourceEdgeId } = item.node;

                    setNodes((oldNodes) => [
                        ...oldNodes,
                        {
                            id,
                            position,
                            type,
                            data: {
                                template,
                            }
                        }
                    ])

                    setEdges((oldEdges) => [
                        ...oldEdges,
                        {
                            id: item.id,
                            source: sourceEdgeId,
                            sourceHandle: item.sourceHandle,
                            target: targetEdgeId,
                            targetHandle: item.targetHandle
                        }
                    ])
                })
            })
        }
    }, [templatesState])

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

                <button className='main-button absolute' onClick={handleSaveFlow}>Guardar cambios</button>

                <Sidebar />
            </ReactFlowProvider>
        </div>
    );
};

export default TemplatesDragAndDrop;