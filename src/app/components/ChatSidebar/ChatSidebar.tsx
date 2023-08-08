import { useEffect, useRef, useState } from "react";
import { IconMessage } from "../Icons/IconMessage"
import { IconSearch } from "../Icons/IconSearch"
import { IconUnread } from "../Icons/IconUnread"
import { Conversation as IConversation } from '@/app/interfaces/conversations';
import { getConversations, markAsRead } from '@/app/services/api';
import useUser from "../../hooks/useUser";
import useActiveConversation from "../../hooks/useActiveConversation";
import { ConversationSkeleton } from "../Skeleton/Conversation";
import { ItemListConversation } from "../ItemListConversation";
import { io, Socket } from 'socket.io-client';
import { ModalCreateConversartion } from "../ModalCreateConversastion/ModalCreateConversastion";
import { usePathname } from 'next/navigation';

export const ChatSidebar = () => {
    const [filter, setFilter] = useState<any>({ search: "", unread: false });
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pageConversation, setPageConversation] = useState(0);
    const [totalPagesConversation, setTotalPagesConversation] = useState(0);
    const [limitConversation, setLimitConversation] = useState(100);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [loadingInitialConversations, setLoadingInitialConversations] = useState<boolean>(false);
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const loadingRefConversation = useRef(false);
    //@ts-ignore
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState } = useActiveConversation();
    const containerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);

    useEffect(() => {
        setPageConversation(0);
        setConversations([]);
        setLoadingInitialConversations(true)
        loadConversations(true);
    }, [filter.unread]);

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

    useEffect(() => {
        if (activeConversationState.id !== -1 && activeConversationState.id !== 0) {
            handleOpenConversation(activeConversationState.id);
        }
    }, [activeConversationState]);

    useEffect(() => {
        if (!socketRef.current) {
            const apiUrl: string = process.env.API_SOCKET ?? "";
            socketRef.current = io(apiUrl, {
                auth: { token: userState.token },
            });
            socketRef.current.emit('join_new_channel');

            socketRef.current.on('update_conversation', (payload) => {
                console.log("Evento 'update_conversation' recibido:", payload);

                if (payload.table === "messages" && payload.action === "insert") {
                    const chatIndex = conversations.findIndex((chat) => chat.id === payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    } else if (!!filter.unread) {
                        setConversations([...conversations, payload.data.conversation].sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }
                } else if (payload.table === "messages" && payload.action === "update") {
                    const chatIndex = conversations.findIndex((chat) => chat.id === payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }
                }
            });

            socketRef.current.on('new_conversation', (payload) => {
                console.log("Evento 'new_conversation' recibido:", payload);

                setConversations([payload.data, ...conversations]);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [conversations]);

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;

            if (scrollTop + clientHeight >= scrollHeight - 2 && pageConversation < totalPagesConversation) {
                loadConversations(false);
            }
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((prevFilter: any) => ({ ...prevFilter, search: event.target.value }));
    };

    const handleFilterUnread = () => {
        setFilter((prevFilter: any) => ({ ...prevFilter, unread: !filter.unread }));
    };
    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const handleClearPaginateConversation = () => {
        setPageConversation(0);
        setConversations([]);
        loadConversations(true);
        setLoadingInitialConversations(true)
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleClearPaginateConversation();
        }
    };

    const loadConversations = (clear: boolean) => {
        if (loadingRefConversation.current) {
            return;
        }
        loadingRefConversation.current = true;
        const offset = clear ? 0 * limitConversation : pageConversation * limitConversation;
        setLoadingConversations(true);

        getConversations(offset, limitConversation, filter, userState.token, phoneId)
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
    }

    const handleOpenConversation = (id: number) => {
        if (filter.unread) {
            setConversations((prevConversations) => [...prevConversations.filter((c) => c.id !== id)]);
        }
    };

    return (
        <>
            <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 overflow-auto min-h-full bg-slate-50 border border-gray-200" ref={containerRef}>
                <div className="box intro-y bg-slate-50 ">
                    <div className="bg-slate-50 sticky top-0 z-40">
                        <div className="flex items-center justify-between px-5 pt-5">
                            <div className="group relative">
                                <button onClick={() => handleFilterUnread()} >
                                    <IconUnread classes={`w-6 h-6 ${filter.unread ? 'text-red-600 ' : 'text-slate-500 '} ml-auto`} />
                                </button>
                                <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Filtrar mensajes no leidos</span>
                            </div>
                            <div className="group relative">
                                <button onClick={() => handleOpenModal(true)}>
                                    <IconMessage classes="w-6 h-6 text-slate-500 ml-auto" />
                                </button>
                                <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Crear nueva conversación</span>
                            </div>
                        </div>
                        <div className="pb-5 px-5 mt-5">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                                </div>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 input-sky"
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
                        {!loadingConversations && !loadingInitialConversations && !conversations.length && (<p className='text-md text-center'>
                            ¡Enhorabuena! <br /> No tienes mensajes pendientes por leer.
                        </p>)}
                        {loadingConversations && [...Array(1)].map((n, index) => (
                            <ConversationSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>

            <ModalCreateConversartion show={showModal} handleOpenModal={handleOpenModal} />
        </>
    )
}