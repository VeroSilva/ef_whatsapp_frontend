import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges
} from 'reactflow';
import ImageNode from '../CustomNodes/ImageNode';
import InteractiveNode from '../CustomNodes/InteractiveNode';
import TemplateNode from '../CustomNodes/TemplateNode';
import TextNode from '../CustomNodes/TextNode';
import VideoNode from '../CustomNodes/VideoNode';
import AudioNode from '../CustomNodes/AudioNode';
import Sidebar from '../Sidebar';
import { uniqueIdGenerator } from '@/app/utils/functions';
import useTemplatesToSend from '@/app/hooks/useTemplatesToSend';
import useUser from '@/app/hooks/useUser';
import { usePathname } from 'next/navigation';
import useTemplates from '@/app/hooks/useTemplates';
import { getFlows, updateFlows } from '@/app/services/api';
import { dataMessageToSend } from '@/app/utils/messages';
import { IconCheckCircle } from '../../Icons/IconCheckCircle';
import { IconInfo } from '../../Icons/IconInfo';

const nodeTypes = {
    templateNode: TemplateNode,
    textNode: TextNode,
    imageNode: ImageNode,
    videoNode: VideoNode,
    audioNode: AudioNode,
    interactiveNode: InteractiveNode,
};

export const Flow = ({ initialNode, activeFlow }: { initialNode: any, activeFlow: number }) => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes] = useState<any>(initialNode);
    const [edges, setEdges] = useState<any[]>([]);
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
    const [messages, setMessages] = useState<any[]>([])
    const [images, setImages] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [audios, setAudios] = useState<any[]>([])
    const [interactives, setInteractives] = useState([])

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    const handleMessagesChange = (id: number, text: string) => {
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
    const handleImagesChange = (id: number, image: string) => {
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
    const handleVideosChange = (id: number, video: string) => {
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
    const handleAudiosChange = (id: number, audio: string) => {
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
    const handleInteractivesChange = (id: number, interactive: any) => {
        setInteractives((prevInteractive: any) => {
            const existingInteractiveIndex = prevInteractive.findIndex((int: any) => int.id === id);

            if (existingInteractiveIndex !== -1) {
                return prevInteractive.map((int: any, index: number) =>
                    index === existingInteractiveIndex ? { ...int, interactive } : int
                );
            } else {
                const interactiveId = id || generateUniqueId();
                return [...prevInteractive, { id: interactiveId, interactive }];
            }
        });
    }
    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            //@ts-ignore
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }
            //@ts-ignore

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode: any = {
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

            setNodes((nds: any) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );
    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: any) => setEdges((eds: any) => addEdge(connection, eds)),
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
            const jsonData: any = [];

            edges.map(async (edge) => {
                const { id: edgeID, source, sourceHandle, target, targetHandle } = edge
                const targetNode = nodes.filter((node: any) => node.id === target)[0]
                const sourceNode = nodes.filter((node: any) => node.id === source)[0]

                if (targetNode) {
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
                            },
                            flow_id: activeFlow
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
                            },
                            flow_id: activeFlow
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
                            },
                            flow_id: activeFlow
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
                            },
                            flow_id: activeFlow
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
                            },
                            flow_id: activeFlow
                        }

                        jsonData.push(data)
                    } else if (targetNode.type === "interactiveNode") {
                        const currentInteractive: any = interactives.filter((int: any) => int.id === targetNode.id)[0]
                        const dataToSend = currentInteractive ? await dataMessageToSend({ type: "interactive", data: currentInteractive.interactive }) : {}

                        const data = {
                            id: edgeID,
                            source: sourceNode?.data?.template ? sourceNode.data.template.name : source,
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
                            },
                            flow_id: activeFlow
                        }

                        jsonData.push(data)
                    }
                }
            })

            setJsonToSend(jsonData)
        }
    }, [edges, templatesToSendState, nodes, messages, images, videos, audios, interactives]);

    useEffect(() => {
        if (!(templatesState.length === 1 && templatesState[0].id === 0)) {
            getFlows(userState.token, phoneId, activeFlow).then((res) => {
                res.map((item: any) => {
                    const { id, position, type, targetEdgeId, sourceEdgeId } = item.node;

                    if (item.template_data.hasOwnProperty('template')) {
                        let template = templatesState.find(tmpl => tmpl.id === item.template_data.template.id);

                        item.template_data.template.components.forEach((component: any) => {
                            switch (component.type) {
                                case "header":
                                    template?.components.forEach((cp: any) => {
                                        if (cp.type === "HEADER") {
                                            if (cp.format === "IMAGE") cp.example.header_handle[0] = component.parameters[0].image.link
                                            if (cp.format === "TEXT") cp.example.header_text[0] = component.parameters[0].text
                                        }
                                    })
                                    break;

                                case "body":
                                    template?.components.forEach((cp: any) => {
                                        if (cp.type === "BODY") {
                                            component.parameters.forEach((param: any, index: number) => {
                                                if (param.type === "text") {
                                                    cp.example.body_text[0][index] = param.text
                                                }
                                            });
                                        }
                                    })
                                    break;

                                //to do...
                                // case "button":
                                //     template?.components.forEach((cp: any) => {
                                //         if (cp.type === "BUTTONS") {
                                //             component.parameters.forEach((param: any, index: number) => {
                                //                 console.log(cp, param)
                                //             });
                                //         }
                                //     })
                                //     break;
                                //to do...

                                default:
                                    break;
                            }
                        });

                        // console.log(template, item.template_data.template)

                        if (template) {
                            setNodes((oldNodes: any) => [
                                ...oldNodes,
                                {
                                    id,
                                    position,
                                    type,
                                    data: {
                                        template: template,
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
                    }

                    if (item.template_data.hasOwnProperty('text')) {
                        handleMessagesChange(id, item.template_data.text.body)

                        setNodes((oldNodes: any) => [
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
                    }

                    if (item.template_data.hasOwnProperty('image')) {
                        handleImagesChange(id, item.template_data.image.data)

                        setNodes((oldNodes: any) => [
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
                    }

                    if (item.template_data.hasOwnProperty('video')) {
                        handleVideosChange(id, item.template_data.video.data)

                        setNodes((oldNodes: any) => [
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
                    }

                    if (item.template_data.hasOwnProperty('audio')) {
                        handleAudiosChange(id, item.template_data.audio.data)

                        setNodes((oldNodes: any) => [
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
                    }

                    if (item.template_data.hasOwnProperty('interactive')) {
                        handleInteractivesChange(id, item.template_data.interactive)

                        setNodes((oldNodes: any) => [
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
                    }
                })
            })
        }
    }, [templatesState])

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
        <>
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        //@ts-ignore
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                    >
                        <Controls />
                        {/* @ts-ignore */}
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
        </>
    )
}

function generateUniqueId(): number {
    throw new Error('Function not implemented.');
}
