"use client"

import { useEffect, useState, useRef } from "react"
import { Modal } from 'flowbite-react';
import Image from "next/image"
import { IconUserPlus } from "@/app/components/Icons/IconUserPlus"
import { IconEllipsisVertical } from "@/app/components/Icons/IconEllipsisVertical"
import { IconSearch } from "@/app/components/Icons/IconSearch"
import { Message as IMessage, Contact } from "../interfaces/conversations"
import { Reaction } from "../interfaces/reactions"
import generateInitialsImage from "../utils/generateUserImage"
import { Message } from "./Message"
import { IconX } from "./Icons/IconX";
import { ConversationBottomSection } from "./ConversationBottomSection/ConversationBottomSection";
import { ConversationPreview } from "./ConversationPreview/ConversationPreview";
import { useMessage } from "../hooks/useMessage";
import { getFileType } from "../utils/fileType";

export const ActiveConversation = ({ messages, conversationId, activeContact }: { messages: IMessage[], conversationId: number, activeContact: Contact }) => {
    const [reactions, setReactions] = useState<Reaction[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [modalImage, setModalImage] = useState<string>("")
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { sendMessage, isLoading } = useMessage()

    console.log(messages)

    useEffect(() => {
        if (isScrolledToBottom) {
            scrollToBottom();
        }
    }, [isScrolledToBottom, messages])

    useEffect(() => {
        setReactions([])

        messages
            .filter((message) => message.message_type === "reaction")
            .forEach((message) => {
                setReactions([...reactions, {
                    waId: message.message.reacted_message_id,
                    emoji: message.message.emoji
                }])
            })

        scrollToBottom();
    }, [])

    useEffect(() => {
        if (!isLoading) {
            setSelectedFile(null)
        }
    }, [isLoading])

    const handleScroll = () => {
        const container = messagesContainerRef.current
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container

            const isAtBottom = scrollHeight - scrollTop === clientHeight

            setIsScrolledToBottom(isAtBottom);
        }
    }

    const scrollToBottom = () => {
        messagesContainerRef.current?.lastElementChild?.scrollIntoView();
    }

    const handleOpenModal = (show: boolean) => {
        setShowModal(show)
    }

    const handleSendMessage = (type: string, data: any) => {
        sendMessage({ type, data, conversationId })
    }

    const handleAccept = () => {
        const type = getFileType(selectedFile?.type)
        handleSendMessage(type, selectedFile)
    }

    const handleCancel = () => {
        setSelectedFile(null)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 flex-none relative">
                        {generateInitialsImage(activeContact.name)}
                    </div>
                    <div className="ml-3 mr-auto">
                        <div className="flex items-center">
                            <div className="font-medium text-base">
                                {activeContact.name}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
                    <a href="#" className="w-5 h-5 text-slate-500">
                        <IconSearch classes="w-5 h-5" />
                    </a>
                    <a href="#" className="w-5 h-5 text-slate-500 ml-5">
                        <IconUserPlus classes="w-5 h-5" />
                    </a>

                    <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button">
                        <IconEllipsisVertical classes="w-6 h-6" />
                    </button>

                    <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                        </ul>
                        <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex flex-col overflow-y-auto scrollbar-hidden px-5 pt-5 flex-1 h-full">
                {messages.map((message, index) => {
                    if (message.message_type !== "reaction") {
                        const reacted = reactions.filter((reaction: Reaction) => reaction.waId === message.message?.id_whatsapp)

                        return (
                            <Message message={message} key={index} reaction={reacted} handleOpenModal={handleOpenModal} setModalImage={setModalImage} />
                        )
                    } else return null;
                })}
            </div>

            {selectedFile !== null &&
                <ConversationPreview
                    handleAccept={handleAccept}
                    handleCancel={handleCancel}
                    selectedFile={selectedFile}
                    isLoading={isLoading}
                />
            }

            <ConversationBottomSection conversationId={conversationId} setSelectedFile={setSelectedFile} />

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
        </div>
    )
}