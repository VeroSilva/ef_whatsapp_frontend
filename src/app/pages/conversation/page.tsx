"use client"
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Image from "next/image";
import { Conversation as IConversation, Message as IMessage } from '@/app/interfaces/conversations';
import { IconSearch } from "@/app/components/Icons/IconSearch";
import useUser from "../../hooks/useUser";
import { getConversations, getMessagesByConversation, markAsRead } from '@/app/services/api';
import { ItemListConversation } from '@/app/components/ItemListConversation';
import { ActiveConversation } from '@/app/components/ActiveConversation/ActiveConversation';
import { ConversationSkeleton } from '@/app/components/Skeleton/Conversation';
import { ActiveConversationSkeleton } from '@/app/components/Skeleton/ActiveConversation';
import { IconMessage } from '@/app/components/Icons/IconMessage';
import { IconUnread } from '@/app/components/Icons/IconUnread';
import { Modal } from '@/app/components/Modal/Modal';
import useActiveConversation from "../../hooks/useActiveConversation";
import { Sidebar } from '@/app/components/Sidebar/Sidebar';

const Conversation = (): JSX.Element => {
    const router = useRouter();
    //@ts-ignore
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState, resetActiveConversation, setActiveConversation } = useActiveConversation();
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newPhone, setNewPhone] = useState<string>("");
    const [filter, setFilter] = useState<any>({ search: "", unread: false });
    const containerRef = useRef<HTMLDivElement>(null);

    const [loadingInitialConversations, setLoadingInitialConversations] = useState<boolean>(false);
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const [pageConversation, setPageConversation] = useState(0);
    const [totalPagesConversation, setTotalPagesConversation] = useState(0);
    const [limitConversation, setLimitConversation] = useState(100);
    const loadingRefConversation = useRef(false);

    const [loadingInitialMessages, setLoadingInitialMessages] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [pageMessage, setPageMessage] = useState(0);
    const [totalPagesMessage, setTotalPagesMessage] = useState(1);
    const [limitMessage, setLimitMessage] = useState(50);
    const loadingRefMessage = useRef(false);

    const loadConversations = (clear: boolean) => {
        if (loadingRefConversation.current) {
            return;
        }
        loadingRefConversation.current = true;
        const offset = clear ? 0 * limitConversation : pageConversation * limitConversation;
        setLoadingConversations(true);
        getConversations(offset, limitConversation, filter, userState.token)
            .then((res) => {
                setConversations((prevConversations) => [...prevConversations, ...res.conversations]);
                setPageConversation(res.currentPage);
                setTotalPagesConversation(res.totalPages);
            })
            .catch((error: Error) => {
                console.error(error);
            })
            .finally(() => {
                loadingRefConversation.current = false;
                setLoadingConversations(false);
                setLoadingInitialConversations(false)
            });
    };

    const loadMessages = (clear: boolean, id: number) => {
        if (loadingRefMessage.current || pageMessage == totalPagesMessage) {
            return;
        }
        loadingRefMessage.current = true;
        const offset = clear ? 0 * limitMessage : pageMessage * limitMessage;
        setLoadingMessages(true);
        getMessagesByConversation(id, offset, limitMessage, userState.token)
            .then((res) => {
                setMessages((prevMessages) => [...res.messages.reverse(), ...prevMessages]);
                setPageMessage(res.currentPage);
                setTotalPagesMessage(res.totalPages);
                setLoadingMessages(false);
            })
            .catch((error: Error) => {
                console.error(error);
            })
            .finally(() => {
                loadingRefMessage.current = false;
                setLoadingMessages(false);
                setLoadingInitialMessages(false)
            });
    };

    useEffect(() => {
        if (!loadingConversations && containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loadingConversations]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;

            if (scrollTop + clientHeight >= scrollHeight - 2 && pageConversation < totalPagesConversation) {
                loadConversations(false);
            }
        }
    };

    useEffect(() => {
        if (!userState || userState.token === "") {
            router.push('./pages/login');
        } else {
            setLoadingInitialConversations(true)
            loadConversations(true);
        }
    }, [userState]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleClearPaginateConversation();
        }
    };

    const handleClearPaginateConversation = () => {
        setPageConversation(0);
        setConversations([]);
        loadConversations(true);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prevFilter: any) => ({ ...prevFilter, search: event.target.value }));
    };

    const handleFilterUnread = () => {
        setFilter((prevFilter: any) => ({ ...prevFilter, unread: !filter.unread }));
    };

    useEffect(() => {
        setPageConversation(0);
        setConversations([]);
        setLoadingInitialConversations(true)
        loadConversations(true);
    }, [filter.unread]);

    useEffect(() => {
        if (activeConversationState.id === -1) resetActiveConversation()
    }, [])

    useEffect(() => {
        if (activeConversationState.id !== -1 && activeConversationState.id !== 0) {
            handleOpenConversation(activeConversationState.id);
        }

        const handleEscKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                resetActiveConversation();
                setMessages([]);
            }
        };

        document.addEventListener('keydown', handleEscKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
        };
    }, [activeConversationState]);

    useEffect(() => {
        if (messages.length) {
            const unreadMessages = messages.filter((message) => !message.read).map((message) => message.id);

            if (unreadMessages.length) {
                markAsRead(userState.token, unreadMessages)
                    .then((res) => res);
            }
        }
    }, [messages]);

    useEffect(() => {
        if (!socketRef.current) {
            const apiUrl: string = process.env.API_URL ?? "";
            socketRef.current = io(apiUrl);

            socketRef.current.on('table_change_notification', (payload) => {
                if (payload.table === "messages" && payload.action === "insert") {
                    const chatIndex = conversations.findIndex((chat) => chat.id === payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }

                    if (activeConversationState.id === payload.data.conversation.id) {
                        setMessages((currentMessages) => [...currentMessages, payload.data.message]);
                    }
                } else if (payload.table === "messages" && payload.action === "update") {
                    const messageIndex = messages.findIndex((message) => message.id === payload.data.message.id);

                    if (messageIndex !== -1) {
                        const updatedMessages = [...messages];
                        const message = updatedMessages[messageIndex];

                        if (
                            (message.status === "read") ||
                            (message.status === "delivered" && (payload.data.message.status === "failed" || payload.data.message.status === "trying" || payload.data.message.status === "sent")) ||
                            (message.status === "sent" && (payload.data.message.status === "failed" || payload.data.message.status === "trying"))
                        ) {
                            return;
                        }

                        message.status = payload.data.message.status;
                        setMessages(updatedMessages);
                    }

                    const chatIndex = conversations.findIndex((chat) => chat.id === payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }
                } else if (payload.table === "conversations" && payload.action === "insert") {
                    setConversations([...conversations, payload.data]);
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [conversations, messages]);

    const handleOpenConversation = (id: number) => {
        setMessages([]);
        setLoadingInitialMessages(true);
        setPageMessage(0);
        loadMessages(true, id);
    };

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const handleCreateConversation = () => {
        setActiveConversation({
            contact: {
                country: "",
                email: "",
                name: "",
                phone: newPhone,
                tag_id: "",
                id: 0
            },
            id: -1
        });

        setMessages([]);
        setShowModal(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPhone(e.target.value);
    };

    const CreateConversationButton = () => (
        <button
            onClick={handleCreateConversation}
            className={
                "border border-teal-600 p-2 rounded-md transition ease-in-out delay-50 " +
                (newPhone === "" ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-teal-600 hover:text-white")
            }
            disabled={newPhone === ""}
        >
            Crear conversación
        </button>
    );

    return (
        <>
            <Sidebar />
            <div className="grid grid-cols-12 h-full flex-1">
                {/* BEGIN: Chat Side Menu */}
                <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 overflow-auto min-h-full bg-slate-50 border border-gray-200" ref={containerRef}>
                    <div className="box intro-y bg-slate-50 ">
                        <div className="bg-slate-50 sticky top-0">
                            <div className="flex items-center justify-between px-5 pt-5">
                                <button onClick={() => handleFilterUnread()}>
                                    <IconUnread classes={`w-6 h-6 ${filter.unread ? 'text-red-600 ' : 'text-slate-500 '} ml-auto`} />
                                </button>
                                <button onClick={() => handleOpenModal(true)}>
                                    <IconMessage classes="w-6 h-6 text-slate-500 ml-auto" />
                                </button>
                            </div>
                            <div className="pb-5 px-5 mt-5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Buscar contacto o celular"
                                        required
                                        value={filter.search}
                                        onChange={handleFilterChange}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                loadingInitialConversations ? [...Array(8)].map((n, index) => (
                                    <ConversationSkeleton key={index} />
                                )) : (conversations.map((conversation, index) => (
                                    <ItemListConversation
                                        conversation={conversation}
                                        key={index}
                                        handleOpenConversation={handleOpenConversation}
                                        activeConversation={activeConversationState.id}
                                        filter={filter.search}
                                    />
                                )))
                            }
                            {loadingConversations && [...Array(1)].map((n, index) => (
                                <ConversationSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </div>
                {/* END: Chat Side Menu */}
                {/* BEGIN: Chat Content */}
                <div className="col-span-12 xl:col-span-8 2xl:col-span-9 overflow-auto">
                    <div className="box h-full intro-y bg-slate-50 rounded-tr-md rounded-br-md border border-gray-200">
                        {/* BEGIN: Chat Active */}
                        {loadingInitialMessages ?
                            <ActiveConversationSkeleton /> :
                            activeConversationState.id !== 0 ?
                                <ActiveConversation
                                    messages={messages}
                                    conversationId={activeConversationState.id}
                                    activeContact={activeConversationState.contact}
                                    loadMessages={loadMessages}
                                /> :
                                <div className='h-full w-full flex justify-center items-center'>
                                    <Image
                                        src="/images/home-messages.jpg"
                                        width={350}
                                        height={350}
                                        alt="Imagen de mensaje"
                                    />
                                </div>
                        }
                        {/* END: Chat Active */}
                    </div>
                </div>
                {/* END: Chat Content */}
            </div>

            {/* BEGIN: Modal */}
            {showModal && (
                <Modal
                    title="Crear nueva conversación"
                    onClose={() => handleOpenModal(false)}
                    show={showModal}
                    width="500px"
                >
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="phone" className="text-sm text-gray-800 font-semibold">
                            Número de teléfono:
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Ingresa el número de teléfono"
                            className="border border-gray-300 rounded-lg p-2"
                            value={newPhone}
                            onChange={handlePhoneChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="border border-gray-300 rounded-lg p-2"
                            onClick={() => handleOpenModal(false)}
                        >
                            Cancelar
                        </button>
                        <CreateConversationButton />
                    </div>
                </Modal>
            )}
            {/* END: Modal */}
        </>
    );
};

export default Conversation;
