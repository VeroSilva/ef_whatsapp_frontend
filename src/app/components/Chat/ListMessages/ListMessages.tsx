import { useEffect, useState, useRef } from "react";
import { Modal, Spinner } from 'flowbite-react';
import Image from "next/image";
import { Message as IMessage } from "../../../interfaces/conversations";
import { Reaction } from "../../../interfaces/reactions";
import { MemoizedMessage } from "../../Message/Message";
import { IconX } from "../../Icons/IconX";
import React from "react";
import useActiveConversation from "@/app/hooks/useActiveConversation";
import { io, Socket } from 'socket.io-client';
import useUser from "@/app/hooks/useUser";
//@ts-ignore
import newMessageAudio from '../../../../../sounds/receive.mp3';
import { getMessagesByConversation } from '@/app/services/api';
import { usePathname } from "next/navigation";

interface ActiveConversationProps {
    highlightedText: string
}

export const ListMessages: React.FC<ActiveConversationProps> = ({
    highlightedText
}) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalImage, setModalImage] = useState<string>("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [updatedMessages, setUpdatedMessages] = useState<IMessage[]>([]);
    const { activeConversationState, resetActiveConversation } = useActiveConversation();
    const socketRef = useRef<Socket | null>(null);
    const { userState } = useUser();
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const loadingRefMessage = useRef(false);
    const [pageMessage, setPageMessage] = useState(0);
    const [totalPagesMessage, setTotalPagesMessage] = useState(1);
    const [limitMessage, setLimitMessage] = useState(50);
    const [lastConversation, setLastConversation] = useState(0);
    const [loadingInitialMessages, setLoadingInitialMessages] = useState<boolean>(false);
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);

    useEffect(() => {
        if (!socketRef.current) {
            const apiUrl: string = process.env.API_SOCKET ?? "";
            socketRef.current = io(apiUrl, {
                auth: { token: userState.token },
            });
            socketRef.current.emit('join_new_channel');

            socketRef.current.on('new_message', (payload) => {
                console.log("Evento 'new_message' recibido:", payload);

                if (phoneId.toString() === payload.data.conversation.company_phone_id) {
                    if (activeConversationState.id === payload.data.conversation.id) {
                        setMessages((currentMessages) => [...currentMessages, payload.data.message]);
                    }

                    if (payload.data.message.status === "client") playSound();
                }
            });

            socketRef.current.on('update_message', (payload) => {
                console.log("Evento 'update_message' recibido:", payload);

                if (phoneId.toString() === payload.data.conversation.company_phone_id) {
                    setMessages(prevMessages => {
                        const messageIndex = prevMessages.findIndex(message => message.id === payload.data.message.id);

                        if (messageIndex !== -1) {
                            const updatedMessages = [...prevMessages];
                            const message = updatedMessages[messageIndex];

                            if (
                                (message.status === "read") ||
                                (message.status === "delivered" && (payload.data.message.status === "failed" || payload.data.message.status === "trying" || payload.data.message.status === "sent")) ||
                                (message.status === "sent" && (payload.data.message.status === "failed" || payload.data.message.status === "trying"))
                            ) {
                                return prevMessages;
                            }

                            message.status = payload.data.message.status;
                            return updatedMessages;
                        }

                        return prevMessages;
                    });
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, [userState.token, messages])

    useEffect(() => {
        if (activeConversationState.id !== 0 && activeConversationState.id !== -1) {
            setMessages([]);
            loadMessages(true, activeConversationState.id)
        } else if (activeConversationState.id === -1) {
            setMessages([]);
        }
    }, [activeConversationState.id])

    useEffect(() => {
        setReactions([]);
        [...messages]
            .filter((message) => message.message_type === "reaction")
            .forEach((message) => {
                setReactions((reactions) => [
                    ...reactions,
                    {
                        waId: message.message.reacted_message_id,
                        emoji: message.message.emoji,
                    },
                ]);
            });

        const newMessages = [...messages].map((itemA) => {
            if (itemA.message.response_to !== null) {
                const repliedMessage = [...messages].find(
                    (itemB) => itemA.message.response_to === itemB.message.id_whatsapp
                );
                if (repliedMessage) {
                    return {
                        ...itemA,
                        replied_message: repliedMessage,
                    };
                }
            }
            return {
                ...itemA,
                replied_message: null,
            };
        });

        setUpdatedMessages(newMessages);
    }, [messages]);

    const loadMessages = (clear: boolean, id: number) => {
        if (loadingRefMessage.current || (pageMessage == totalPagesMessage && id == lastConversation)) {
            setLoadingInitialMessages(false);
            return;
        }
        loadingRefMessage.current = true;
        const offset = clear ? 0 * limitMessage : pageMessage * limitMessage;
        setLoadingMessages(true);
        setLastConversation(id);
        getMessagesByConversation(id, offset, limitMessage, userState.token)
            .then((res) => {
                if (!res.message) {
                    setMessages((prevMessages) => [...res.messages.reverse(), ...prevMessages]);
                    setPageMessage(res.currentPage);
                    setTotalPagesMessage(res.totalPages);
                    setLoadingMessages(false);
                } else {
                    resetActiveConversation();
                    setMessages([]);
                    setLastConversation(0);
                }
            })
            .catch((error: Error) => {
                console.error(error);
            })
            .finally(() => {
                loadingRefMessage.current = false;
                setLoadingMessages(false);
                setLoadingInitialMessages(false)
            });
    }

    const playSound = () => {
        //@ts-ignore
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioElement = new Audio(newMessageAudio);
        const track = audioContext.createMediaElementSource(audioElement);
        track.connect(audioContext.destination);
        audioElement.play();
    };

    const scrollToElement = (id: Number) => {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.scrollIntoView();
        }
    }

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    return (
        <>
            <div ref={messagesContainerRef} className="flex flex-col overflow-y-auto px-5 pt-5 flex-1 h-full">

                {updatedMessages.map((message, index) =>
                    message.message_type !== "reaction" ? (
                        <MemoizedMessage
                            key={message.id}
                            message={message}
                            reaction={reactions.filter(
                                (reaction: Reaction) => reaction.waId === message.message?.id_whatsapp
                            )}
                            handleOpenModal={handleOpenModal}
                            setModalImage={setModalImage}
                            highlightedText={highlightedText}
                        />
                    ) : null
                )}
            </div>

            <Modal
                size="md"
                dismissible
                show={showModal}
                className="p-0"
                onClose={() => handleOpenModal(false)}
            >
                <div className="container-image">
                    <button
                        className="w-8 h-8 rounded-full absolute right-0 mt-3 mr-3 bg-slate-100 shadow-md"
                        onClick={() => handleOpenModal(false)}
                    >
                        <IconX classes="w-8 h-8" />
                    </button>
                    <Image
                        src={modalImage}
                        width={500}
                        height={500}
                        alt="Imagen de mensaje"
                        className="object-cover rounded-md"
                        onClick={() => handleOpenModal(true)}
                    />
                </div>
            </Modal>
        </>
    );
};

