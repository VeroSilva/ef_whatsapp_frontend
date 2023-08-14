"use client"
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from 'reactflow'; import 'reactflow/dist/style.css';
import useUser from "@/app/hooks/useUser";
import { redirect } from "next/navigation";

const Chatbot = (): JSX.Element => {
    const { userState } = useUser();

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')

        }
    }, [userState]);

    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'LABEL!' } },
        { id: '2', position: { x: 0, y: 100 }, data: { label: 'LABEL2' } },
    ];
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    return (
        <>
            <Sidebar />
            <div className="flex-1 h-full p-8 bg-slate-100">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={2} />
                </ReactFlow>
            </div>
        </>
    )
}

export default Chatbot;
