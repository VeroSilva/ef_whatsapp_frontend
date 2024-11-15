import { useEffect, useRef, useState } from "react";
import { IconMessage } from "../Icons/IconMessage"
import { IconSearch } from "../Icons/IconSearch"
import { IconUnread } from "../Icons/IconUnread"
import { Conversation as IConversation } from '@/app/interfaces/conversations';
import { getConversations } from '@/app/services/api';
import useUser from "../../hooks/useUser";
import useActiveConversation from "../../hooks/useActiveConversation";
import useChatFilters from "../../hooks/useChatFilters";
import { ConversationSkeleton } from "../Skeleton/Conversation";
import { ItemListConversation } from "../ItemListConversation";
import { ModalCreateConversartion } from "../ModalCreateConversastion/ModalCreateConversastion";
import useChatsRead from "@/app/hooks/useChatsRead";
import { useSocket } from "@/app/context/socket/SocketContext";
import { ChatFilters } from "../Chat/ChatFilters/ChatFilters";
import { IconWarning } from "../Icons/IconWarning";
import useActivePhone from "../../hooks/useActivePhone";

export const ChatSidebar = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pageConversation, setPageConversation] = useState(0);
    const [totalPagesConversation, setTotalPagesConversation] = useState(0);
    const [limitConversation, setLimitConversation] = useState(100);
    const [conversations, setConversations] = useState<IConversation[]>([]);
    const [loadingInitialConversations, setLoadingInitialConversations] = useState<boolean>(false);
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const loadingRefConversation = useRef(false);
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState, resetActiveConversation } = useActiveConversation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { chatsReadState, setChatsRead } = useChatsRead();
    const { socketInstance } = useSocket();
    const { chatFiltersState, setChatFiltersState } = useChatFilters();
    const { activePhone } = useActivePhone();

    useEffect(() => {
        handleClearPaginateConversation();
    }, [chatFiltersState.unread, chatFiltersState.overdue])

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
        if (!socketInstance) {
            return;
        }

        const updateConversationListener = (payload: any) => {
            if (payload.table === "messages" && payload.action === "insert") {
                if (
                    activePhone.toString() === payload.data.conversation.company_phone_id &&
                    (!payload.data.conversation.user_assigned_id ||
                        (payload.data.conversation.user_assigned_id && payload.data.conversation.user_assigned_id === userState.id)
                    )
                ) {
                    setConversations(prevConversations => {
                        const chatIndex = prevConversations.findIndex(chat => chat.id === payload.data.conversation.id);

                        if (chatIndex !== -1) {
                            const updatedArray = [...prevConversations];
                            updatedArray[chatIndex] = payload.data.conversation;
                            return updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at));
                        } else if (!!chatFiltersState.unread && payload.data.conversation.unread_count > 0) {
                            return [...prevConversations, payload.data.conversation].sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at));
                        }

                        return prevConversations;
                    });

                    setChatsRead((prevChatsRead: string[]) => {
                        const isRead = prevChatsRead.includes(payload.data.conversation.id);

                        if (isRead) {
                            const chatsFiltered = prevChatsRead.filter(id => id !== payload.data.conversation.id);
                            return chatsFiltered;
                        }

                        return prevChatsRead;
                    });
                }
            } else if (payload.table === "messages" && payload.action === "update") {
                if (activePhone.toString() === payload.data.conversation.company_phone_id) {
                    setConversations((prevConversations) => {
                        const chatIndex = prevConversations.findIndex((chat) => chat.id === payload.data.conversation.id);

                        if (chatIndex !== -1) {
                            const updatedArray = [...prevConversations];
                            updatedArray[chatIndex] = payload.data.conversation;
                            return updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at))
                        }

                        return prevConversations
                    });
                }
            }
        }

        const newConversationListener = (payload: any) => {
            setConversations((prevConversations) => {
                if (
                    activePhone.toString() === payload.data.company_phone_id &&
                    (!payload.data.user_assigned_id ||
                        (payload.data.user_assigned_id && payload.data.user_assigned_id === userState.id)
                    )
                ) {
                    const filteredConversations = prevConversations.filter(
                        (conversation: any) => {
                            return conversation?.company_phone_id !== null &&
                                conversation.company_phone_id === activePhone.toString() &&
                                (!conversation.user_assigned_id || conversation.user_assigned_id === userState.id);
                        }
                    );

                    return [payload.data, ...filteredConversations];
                }
                return prevConversations;
            });
        }

        const deleteConversationListener = (payload: any) => {
            setConversations((prevConversations) => {
                const filteredConversations = prevConversations.filter((conversation: any) => {
                    return conversation?.data?.id !== payload.data.id &&
                        conversation?.company_phone_id !== null &&
                        activePhone.toString() === conversation.company_phone_id &&
                        (!conversation.user_assigned_id || conversation.user_assigned_id === userState.id);
                });

                return filteredConversations;
            });
        }

        const conversationTagListener = (payload: any) => {
            if (payload.data.tags) {
                setConversations(prevConversations => {
                    const chatIndex = prevConversations.findIndex(chat => chat.id === payload.data.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...prevConversations];
                        updatedArray[chatIndex].tags = payload.data.tags;

                        return updatedArray
                    }

                    return prevConversations;
                });
            }
        }

        const socket = socketInstance;

        socket.on('update_conversation', updateConversationListener);
        socket.on('new_conversation', newConversationListener);
        socket.on('delete_conversation', deleteConversationListener);
        socket.on('conversation_tags', conversationTagListener);

        return () => {
            socket.off('update_conversation', updateConversationListener);
            socket.off('new_conversation', newConversationListener);
            socket.off('delete_conversation', deleteConversationListener);
            socket.off('conversation_tags', conversationTagListener);
        };
    }, [conversations, chatsReadState, socketInstance]);

    useEffect(() => {
        setLoadingInitialConversations(true);
        loadConversations(true);
        resetActiveConversation();
    }, [activePhone])
    
    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;

            if (scrollTop + clientHeight >= scrollHeight - 2 && pageConversation < totalPagesConversation) {
                loadConversations(false);
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatFiltersState({ ...chatFiltersState, search: event.target.value })
    };

    const handleFilterUnread = () => {
        setChatFiltersState({ ...chatFiltersState, unread: !chatFiltersState.unread })
    };

    const handleFilterOverdue = () => {
        setChatFiltersState({ ...chatFiltersState, overdue: !chatFiltersState.overdue })
    };

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const handleClearPaginateConversation = () => {
        setPageConversation(0);
        setConversations([]);
        loadConversations(true);
        setLoadingInitialConversations(true);
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
        const tagsIds = chatFiltersState.tags.map((option: any) => option.value).join()
        const filtersToSend = { ...chatFiltersState, tags: tagsIds }

        setLoadingConversations(true);

        getConversations(
            offset,
            limitConversation,
            filtersToSend,
            userState.token,
            activePhone
        )
            .then((res) => {
                setConversations((prevConversations) => {
                    if (clear) return [...res.conversations]
                    else return [...prevConversations, ...res.conversations]
                });
                setPageConversation(res.currentPage);
                setTotalPagesConversation(res.totalPages);
            })
            .catch((error: Error) => {
                console.error(error);
            })
            .finally(() => {
                loadingRefConversation.current = false;
                setLoadingConversations(false);
                setLoadingInitialConversations(false);
            });
    }

    const handleOpenConversation = (id: number) => {
        if (chatFiltersState.unread) {
            setConversations((prevConversations) => [...prevConversations.filter((c) => c.id !== id)]);
        }
    };
    
    return (
        <>
            <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 overflow-auto min-h-full bg-slate-50 border border-gray-200" ref={containerRef}>
                <div className="box intro-y bg-slate-50 ">
                    <div className="bg-slate-50 sticky top-0 z-40">
                        <div className="flex items-center justify-between px-5 pt-5">
                            <div className="flex items-center gap-2">
                                <div className="group relative">
                                    <ChatFilters handleLoadConversations={handleClearPaginateConversation} />
                                    <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Más filtros</span>
                                </div>
                                <div className="group relative">
                                    <button onClick={() => handleFilterUnread()} >
                                        <IconUnread classes={`w-6 h-6 ${chatFiltersState.unread ? 'text-sky-600 ' : 'text-slate-500 '} ml-auto`} />
                                    </button>
                                    <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Filtrar mensajes no leidos</span>
                                </div>
                                <div className="group relative">
                                    <button onClick={() => handleFilterOverdue()} >
                                        <IconWarning classes={`w-5 h-5 ${chatFiltersState.overdue ? 'text-sky-600 ' : 'text-slate-500 '} ml-auto`} />
                                    </button>
                                    <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Filtrar mensajes que necesitan recontacto</span>
                                </div>
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
                                    value={chatFiltersState.search}
                                    onChange={handleSearchChange}
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
                                    filter={chatFiltersState.search}
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