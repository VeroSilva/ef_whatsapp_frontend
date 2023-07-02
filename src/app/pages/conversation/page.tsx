"use client"
import { useEffect, useState, useRef, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Button } from 'flowbite-react';
import Image from "next/image";
import { Conversation as IConversation, Message as IMessage } from '@/app/interfaces/conversations';
import { IconSearch } from "@/app/components/Icons/IconSearch";
import useUser from "../../hooks/useUser";
import { getConversations, getMessagesByConversation, markAsRead } from '@/app/services/api';
import { IconLogout } from '@/app/components/Icons/IconLogout';
import { ItemListConversation } from '@/app/components/ItemListConversation';
import { ActiveConversation } from '@/app/components/ActiveConversation/ActiveConversation';
import { ConversationSkeleton } from '@/app/components/Skeleton/Conversation';
import { ActiveConversationSkeleton } from '@/app/components/Skeleton/ActiveConversation';
import { IconMessage } from '@/app/components/Icons/IconMessage';
import { Modal } from '@/app/components/Modal/Modal';
import useActiveConversation from "../../hooks/useActiveConversation";

const Conversation = (): JSX.Element => {
    const router = useRouter();
    //@ts-ignore
    const { userState, logoutUser } = useUser();
    //@ts-ignore
    const { activeConversationState, resetActiveConversation, setActiveConversation } = useActiveConversation();
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const socketRef = useRef<Socket | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newPhone, setNewPhone] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPages] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [limit, setLimit] = useState(10);
    const loadingRef = useRef(false);

    const loadConversations = (clear: boolean) => {
        if (loadingRef.current) {
            return;
        }
        loadingRef.current = true;
        const offset = clear ? 0 * limit : page * limit;
        setLoadingConversations(true);
        getConversations(offset, limit, filter, userState.token)
            .then((res) => {
                setConversations((prevConversations) => [...prevConversations, ...res.conversations]);
                setLoadingConversations(false);
                setPage(res.currentPage);
                setTotalPages(res.totalPages);
            })
            .catch((error: Error) => {
                console.error(error);
            })
            .finally(() => {
                loadingRef.current = false;
                setLoadingConversations(false);
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

            if (scrollTop + clientHeight >= scrollHeight - 2 && page < totalPage) {
                loadConversations(false);
            }
        }
    };

    useEffect(() => {
        if (!userState || userState.token === "") {
            router.push('./pages/login');
        } else {
            loadConversations(true);
        }
    }, [userState]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleClearPaginate();
        }
    };
    const handleClearPaginate = () => {
        setPage(0);
        setConversations([]);
        loadConversations(true);
    };


    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

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
        setLoadingMessages(true);

        getMessagesByConversation(id, 50, userState.token)
            .then((res) => {
                setMessages(res.reverse());
                setLoadingMessages(false);
            });
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
        <div className="w-full min-h-screen p-5 md:p-20 flex items-center justify-center bg-slate-200">
            <div className='absolute top-0 right-0 m-5'>
                <Button onClick={() => logoutUser()}>
                    <IconLogout classes='w-5 h-5 text-white me-2' />
                    Cerrar sesión
                </Button>
            </div>

            <div className="grid grid-cols-12 gap-5 w-[1800px] h-[70vh] mt-5 drop-shadow-md">
                {/* BEGIN: Chat Side Menu */}
                <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 h-[70vh] overflow-auto" ref={containerRef}>
                    <div className="box intro-y bg-slate-50 rounded-md border border-gray-200 drop-shadow-md">
                        <div className="flex items-center justify-end px-5 pt-5">
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
                                    placeholder="Contacto o celular"
                                    required
                                    value={filter}
                                    onChange={handleFilterChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>
                        <div>
                            {!loadingConversations ?
                                conversations.map((conversation, index) => (
                                    <ItemListConversation
                                        conversation={conversation}
                                        key={index}
                                        handleOpenConversation={handleOpenConversation}
                                        activeConversation={activeConversationState.id}
                                        filter={filter}

                                    />
                                )) :
                                [...Array(8)].map((n, index) => (
                                    <ConversationSkeleton key={index} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                {/* END: Chat Side Menu */}
                {/* BEGIN: Chat Content */}
                <div className="col-span-12 xl:col-span-8 2xl:col-span-9 overflow-auto h-[70vh] overflow-auto">
                    <div className="box h-full intro-y bg-slate-50 rounded-md border border-gray-200 drop-shadow-md">
                        {/* BEGIN: Chat Active */}
                        {loadingMessages ?
                            <ActiveConversationSkeleton /> :
                            activeConversationState.id !== 0 ?
                                <ActiveConversation
                                    messages={messages}
                                    conversationId={activeConversationState.id}
                                    activeContact={activeConversationState.contact}
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
        </div>
    );
};

export default Conversation;
