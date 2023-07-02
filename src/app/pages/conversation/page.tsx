"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { Button } from 'flowbite-react'
import Image from "next/image"
import { Conversation as IConversation, Message as IMessage } from '@/app/interfaces/conversations'
import { IconSearch } from "@/app/components/Icons/IconSearch"
import useUser from "../../hooks/useUser"
import { getConversations, getMessagesByConversation, markAsRead } from '@/app/services/api'
import { IconLogout } from '@/app/components/Icons/IconLogout'
import { ItemListConversation } from '@/app/components/ItemListConversation'
import { ActiveConversation } from '@/app/components/ActiveConversation/ActiveConversation'
import { ConversationSkeleton } from '@/app/components/Skeleton/Conversation'
import { ActiveConversationSkeleton } from '@/app/components/Skeleton/ActiveConversation'
import { IconMessage } from '@/app/components/Icons/IconMessage'
import { Modal } from '@/app/components/Modal/Modal'
import useActiveConversation from "../../hooks/useActiveConversation";

const Conversation = (): JSX.Element => {
    const router = useRouter()
    // @ts-ignore
    const { userState, logoutUser } = useUser()
    // @ts-ignore
    const { activeConversationState, resetActiveConversation, setActiveConversation } = useActiveConversation()
    const [conversations, setConversations] = useState<IConversation[]>([])
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false)
    const [messages, setMessages] = useState<IMessage[]>([])
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false)
    const socketRef = useRef<Socket | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false)
    const [newPhone, setNewPhone] = useState<string>("")

    useEffect(() => {
        if (!userState || userState.token === "") {
            router.push('./pages/login')
        } else {
            setLoadingConversations(true)

            getConversations(0, 100, userState.token).then((res) => {
                setConversations(res)
                setLoadingConversations(false)
            })
        }
    }, [userState])

    useEffect(() => {
        if (activeConversationState.id !== -1 && activeConversationState.id !== 0) {
            handleOpenConversation(activeConversationState.id)
        }

        const handleEscKeyPress = (event: any) => {
            if (event.key === 'Escape') {
                resetActiveConversation()
                setMessages([])
            }
        };

        document.addEventListener('keydown', handleEscKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
        }
    }, [activeConversationState])

    useEffect(() => {
        if (!!messages.length) {
            const unreadMessages = [...messages].filter((message) => !message.read).map((message) => message.id);

            if (!!unreadMessages.length) {
                markAsRead(userState.token, unreadMessages).then((res) => res);
            }
        }
    }, [messages])

    useEffect(() => {
        if (!socketRef.current) {
            const apiUrl: string = process.env.API_URL ?? ""
            socketRef.current = io(apiUrl);

            // Escuchar la notificación de cambio de tabla
            socketRef.current.on('table_change_notification', (payload) => {
                console.log(payload)
                if (payload.table === "messages" && payload.action === "insert") {
                    const chatIndex = [...conversations].findIndex((chat) => chat.id == payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }

                    if (activeConversationState.id == payload.data.conversation.id) {
                        setMessages((currentMessages) => [...currentMessages, payload.data.message]);
                    }
                } else if (payload.table === "messages" && payload.action === "update") {
                    const messageIndex = messages.findIndex((message) => message.id === payload.data.message.id);

                    if (messageIndex !== -1) {
                        const message = messages[messageIndex];
                        console.log(message.status, payload.data.message.status)
                        if (
                            (message.status === "read") ||
                            (message.status === "delivered" &&
                                (payload.data.message.status === "failed" ||
                                    payload.data.message.status === "trying" ||
                                    payload.data.message.status === "sent")) ||
                            (message.status === "sent" &&
                                (payload.data.message.status === "failed" ||
                                    payload.data.message.status === "trying"))
                        ) {
                            return;
                        }

                        message.status = payload.data.message.status;
                        setMessages([...messages]);
                    }

                    const chatIndex = [...conversations].findIndex((chat) => chat.id == payload.data.conversation.id);

                    if (chatIndex !== -1) {
                        const updatedArray = [...conversations];
                        updatedArray[chatIndex] = payload.data.conversation;

                        setConversations(updatedArray.sort((a, b) => Number(b.message_created_at) - Number(a.message_created_at)));
                    }
                } else if (payload.table === "conversations" && payload.action === "insert") {
                    setConversations([...conversations, payload.data])
                }
            })
        }

        // Limpia la conexión cuando el componente se desmonte
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        }
    }, [conversations, messages])

    const handleOpenConversation = (id: number) => {
        setMessages([])
        setLoadingMessages(true)

        getMessagesByConversation(id, 50, userState.token)
            .then((res) => {
                setMessages(res.reverse())
                setLoadingMessages(false)
            })
    }

    const handleOpenModal = (show: boolean) => {
        setShowModal(show)
    }

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
        })

        setMessages([])
        setShowModal(false)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPhone(e.target.value);
    };

    const CreateConversationButton = () => {
        return (
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
        )
    }

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
                <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 h-[70vh] overflow-auto">
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
                                <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                            </div>
                        </div>
                        <div>
                            {!loadingConversations ?
                                conversations.map((conversation, index) => (
                                    <ItemListConversation conversation={conversation} key={index} handleOpenConversation={handleOpenConversation} activeConversation={activeConversationState.id} />
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
                                <ActiveConversation messages={messages} conversationId={activeConversationState.id} activeContact={activeConversationState.contact} /> :
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

            <Modal
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                title="Crear nueva conversación"
                width="500px"
                footer={CreateConversationButton()}
            >
                <input
                    id="phone"
                    placeholder="58982828966"
                    className='border-slate-300 rounded-md w-full focus:outline focus:outline-offset-2 focus:outline-teal-600 focus:ring-0 focus:border-none'
                    required
                    type="text"
                    defaultValue={newPhone}
                    onChange={handlePhoneChange}
                />
            </Modal>
        </div>
    )
}

export default Conversation