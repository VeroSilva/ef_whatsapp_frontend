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
import TextNode from './CustomNodes/TextNode.tsx';
import ImageNode from './CustomNodes/ImageNode.tsx';
import VideoNode from './CustomNodes/VideoNode.tsx';
import AudioNode from './CustomNodes/AudioNode.tsx';
import InteractiveNode from './CustomNodes/InteractiveNode.tsx';
import './index.scss';
import useTemplatesToSend from '../../hooks/useTemplatesToSend'
import useUser from "../../hooks/useUser"
import useTemplates from "../../hooks/useTemplates"
import { usePathname } from "next/navigation"
import { getFlows, updateFlows, getCatalog } from '@/app/services/api';
import { uniqueIdGenerator } from '@/app/utils/functions';
import { IconCheckCircle } from '../Icons/IconCheckCircle';
import { IconInfo } from '../Icons/IconInfo';
import { dataMessageToSend } from "@/app/utils/messages"
import useCatalog from "../../hooks/useCatalog"

const initialNodes = [
    { id: 'client-message', type: 'input', position: { x: 0, y: 0 }, data: { label: "Mensaje cliente" } }
];

const nodeTypes = {
    templateNode: TemplateNode,
    textNode: TextNode,
    imageNode: ImageNode,
    videoNode: VideoNode,
    audioNode: AudioNode,
    interactiveNode: InteractiveNode,
};

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
    const [loadingSave, setLoadingSave] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });
    const { setCatalogState, catalogState } = useCatalog();
    const [messages, setMessages] = useState([])
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [audios, setAudios] = useState([])
    const [interactives, setInteractives] = useState([])

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const handleMessagesChange = (id, text) => {
        setMessages(prevMessages => {
            const existingMessageIndex = prevMessages.findIndex(message => message.id === id);

            if (existingMessageIndex !== -1) {
                return prevMessages.map((message, index) =>
                    index === existingMessageIndex ? { ...message, text } : message
                );
            } else {
                const messageId = id || generateUniqueId();
                return [...prevMessages, { id: messageId, text }];
            }
        });
    }
    const handleImagesChange = (id, image) => {
        setImages(prevImages => {
            const existingImageIndex = prevImages.findIndex(img => img.id === id);

            if (existingImageIndex !== -1) {
                return prevImages.map((img, index) =>
                    index === existingImageIndex ? { ...img, image } : img
                );
            } else {
                const imageId = id || generateUniqueId();
                return [...prevImages, { id: imageId, image }];
            }
        });
    }
    const handleVideosChange = (id, video) => {
        setVideos(prevVideos => {
            const existingImageIndex = prevVideos.findIndex(vid => vid.id === id);

            if (existingImageIndex !== -1) {
                return prevVideos.map((vid, index) =>
                    index === existingImageIndex ? { ...vid, video } : vid
                );
            } else {
                const videoId = id || generateUniqueId();
                return [...prevVideos, { id: videoId, video }];
            }
        });
    }
    const handleAudiosChange = (id, audio) => {
        setAudios(prevAudios => {
            const existingAudioIndex = prevAudios.findIndex(vid => vid.id === id);

            if (existingAudioIndex !== -1) {
                return prevAudios.map((aud, index) =>
                    index === existingAudioIndex ? { ...aud, audio } : aud
                );
            } else {
                const audioId = id || generateUniqueId();
                return [...prevAudios, { id: audioId, audio }];
            }
        });
    }
    const handleInteractivesChange = (id, interactive) => {
        setInteractives(prevInteractive => {
            const existingInteractiveIndex = prevInteractive.findIndex(int => int.id === id);

            if (existingInteractiveIndex !== -1) {
                return prevInteractive.map((int, index) =>
                    index === existingInteractiveIndex ? { ...int, interactive } : int
                );
            } else {
                const interactiveId = id || generateUniqueId();
                return [...prevInteractive, { id: interactiveId, interactive }];
            }
        });
    }
    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

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
                type: type,
                position,
            };

            if (type === "templateNode") {
                const templateData = JSON.parse(event.dataTransfer.getData('template'));

                newNode.data = { template: templateData }
            } else if (type === "textNode") {
                newNode.data = {
                    savedMessage: "",
                    handleMessagesChange,
                    id: newNode.id
                }
            } else if (type === "imageNode") {
                newNode.data = {
                    savedImage: "",
                    handleImagesChange,
                    id: newNode.id
                }
            } else if (type === "videoNode") {
                newNode.data = {
                    savedVideo: "",
                    handleVideosChange,
                    id: newNode.id
                }
            } else if (type === "audioNode") {
                newNode.data = {
                    savedAudio: "",
                    handleAudiosChange,
                    id: newNode.id
                }
            } else if (type === "interactiveNode") {
                newNode.data = {
                    savedInteractive: {},
                    handleInteractivesChange,
                    id: newNode.id
                }
            }

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
        setLoadingSave(true)
        updateFlows(userState.token, phoneId, jsonToSend).then((res) => {
            setJsonToSend([])
            setLoadingSave(false)

            setAlert({
                type: "success",
                message: "Flujo guardado con éxito!",
                show: true
            })
        })
    }

    useEffect(() => {
        if (templatesToSendState.length > 1) {
            const jsonData = [];

            edges.map(async (edge) => {
                const { id: edgeID, source, sourceHandle, target, targetHandle } = edge
                const targetNode = nodes.filter((node) => node.id === target)[0]
                const sourceNode = nodes.filter((node) => node.id === source)[0]

                if (targetNode.type === "templateNode") {
                    const templateData = templatesToSendState.filter((t) => t.id === targetNode.data.template.id)[0]

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
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
                    }

                    jsonData.push(data)
                } else if (targetNode.type === "textNode") {
                    const currentMessage = messages.filter((message) => message.id === targetNode.id)[0]
                    const dataToSend = currentMessage ? await dataMessageToSend({ type: "text", data: currentMessage.text }) : {}

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
                        sourceHandle: sourceHandle ?? "manually",
                        target: targetNode.id,
                        targetHandle: targetHandle,
                        template_data: dataToSend,
                        node: {
                            position: targetNode.position,
                            type: 'textNode',
                            id: targetNode.id,
                            targetEdgeId: target,
                            sourceEdgeId: source
                        }
                    }

                    jsonData.push(data)
                } else if (targetNode.type === "imageNode") {
                    const currentImage = images.filter((img) => img.id === targetNode.id)[0]
                    const dataToSend = currentImage ? await dataMessageToSend({ type: "image", data: { content: currentImage.image, caption: "" } }) : {}

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
                        sourceHandle: sourceHandle ?? "manually",
                        target: targetNode.id,
                        targetHandle: targetHandle,
                        template_data: dataToSend,
                        node: {
                            position: targetNode.position,
                            type: 'imageNode',
                            id: targetNode.id,
                            targetEdgeId: target,
                            sourceEdgeId: source
                        }
                    }

                    jsonData.push(data)
                } else if (targetNode.type === "videoNode") {
                    const currentVideo = videos.filter((video) => video.id === targetNode.id)[0]
                    const dataToSend = currentVideo ? await dataMessageToSend({ type: "video", data: { content: currentVideo.video, caption: "" } }) : {}

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
                        sourceHandle: sourceHandle ?? "manually",
                        target: targetNode.id,
                        targetHandle: targetHandle,
                        template_data: dataToSend,
                        node: {
                            position: targetNode.position,
                            type: 'videoNode',
                            id: targetNode.id,
                            targetEdgeId: target,
                            sourceEdgeId: source
                        }
                    }

                    jsonData.push(data)
                } else if (targetNode.type === "audioNode") {
                    const currentAudio = audios.filter((audio) => audio.id === targetNode.id)[0]
                    const dataToSend = currentAudio ? await dataMessageToSend({ type: "audio", data: currentAudio.audio }) : {}

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
                        sourceHandle: sourceHandle ?? "manually",
                        target: targetNode.id,
                        targetHandle: targetHandle,
                        template_data: dataToSend,
                        node: {
                            position: targetNode.position,
                            type: 'audioNode',
                            id: targetNode.id,
                            targetEdgeId: target,
                            sourceEdgeId: source
                        }
                    }

                    jsonData.push(data)
                } else if (targetNode.type === "interactiveNode") {
                    const currentInteractive = interactives.filter((int) => int.id === targetNode.id)[0]
                    const dataToSend = currentInteractive ? await dataMessageToSend({ type: "interactive", data: currentInteractive.interactive }) : {}

                    const data = {
                        id: edgeID,
                        source: sourceNode.data.template ? sourceNode.data.template.name : source,
                        sourceHandle: sourceHandle ?? "manually",
                        target: targetNode.id,
                        targetHandle: targetHandle,
                        template_data: dataToSend,
                        node: {
                            position: targetNode.position,
                            type: 'interactiveNode',
                            id: targetNode.id,
                            targetEdgeId: target,
                            sourceEdgeId: source
                        }
                    }

                    jsonData.push(data)
                }
            })

            setJsonToSend(jsonData)
        }
    }, [edges, templatesToSendState, nodes, messages, images, videos, audios, interactives]);

    useEffect(() => {
        getCatalog(userState.token, phoneId).then((res) => {
            setCatalogState(res.catalog)
        })

        if (!(templatesState.length === 1 && templatesState[0].id === 0)) {
            getFlows(userState.token, phoneId).then((res) => {
                res.map((item) => {
                    const { id, position, type, targetEdgeId, sourceEdgeId } = item.node;

                    if (item.template_data.hasOwnProperty('template')) {
                        const template = templatesState.find(tmpl => tmpl.id === item.template_data.template.id);
                        if (template) {
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
                        }
                    }

                    if (item.template_data.hasOwnProperty('text')) {
                        handleMessagesChange(id, item.template_data.text.body)

                        setNodes((oldNodes) => [
                            ...oldNodes,
                            {
                                id,
                                position,
                                type,
                                data: {
                                    savedMessage: item.template_data.text.body,
                                    handleMessagesChange,
                                    id
                                }
                            }
                        ])
                    }

                    if (item.template_data.hasOwnProperty('image')) {
                        handleImagesChange(id, item.template_data.image.data)

                        setNodes((oldNodes) => [
                            ...oldNodes,
                            {
                                id,
                                position,
                                type,
                                data: {
                                    savedImage: item.template_data.image.data,
                                    handleImagesChange,
                                    id
                                }
                            }
                        ])
                    }

                    if (item.template_data.hasOwnProperty('video')) {
                        handleVideosChange(id, item.template_data.video.data)

                        setNodes((oldNodes) => [
                            ...oldNodes,
                            {
                                id,
                                position,
                                type,
                                data: {
                                    savedVideo: item.template_data.video.data,
                                    handleVideosChange,
                                    id
                                }
                            }
                        ])
                    }

                    if (item.template_data.hasOwnProperty('audio')) {
                        handleAudiosChange(id, item.template_data.audio.data)

                        setNodes((oldNodes) => [
                            ...oldNodes,
                            {
                                id,
                                position,
                                type,
                                data: {
                                    savedAudio: item.template_data.audio.data,
                                    handleAudiosChange,
                                    id
                                }
                            }
                        ])
                    }

                    if (item.template_data.hasOwnProperty('interactive')) {
                        handleInteractivesChange(id, item.template_data.interactive)

                        setNodes((oldNodes) => [
                            ...oldNodes,
                            {
                                id,
                                position,
                                type,
                                data: {
                                    savedInteractive: item.template_data.interactive,
                                    handleInteractivesChange,
                                    id
                                }
                            }
                        ])
                    }

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

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({
                    type: alert.type,
                    message: alert.message,
                    show: false
                })
            }, 3000);
        }
    }, [alert])

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

                <Sidebar handleSaveFlow={handleSaveFlow} loadingSave={loadingSave} />
            </ReactFlowProvider>

            <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 right-0 flex items-center transition transition-opacity duration-500 ${alert.show ? "opacity-1" : "opacity-0"} ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                {alert.type === "success" ?
                    <IconCheckCircle classes="w-6 h-6 mr-2" /> :
                    <IconInfo classes="w-6 h-6 mr-2" />
                }
                <span>{alert.message}</span>
            </div>
        </div>
    );
};

export default TemplatesDragAndDrop;