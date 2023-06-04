"use client"

import { useEffect, useState, useRef } from "react"
import { Modal } from 'flowbite-react';
import Image from "next/image"
import { IconUserPlus } from "@/app/components/Icons/IconUserPlus"
import { IconEllipsisVertical } from "@/app/components/Icons/IconEllipsisVertical"
import { IconPaperClip } from "@/app/components/Icons/IconPaperClip"
import { IconSend } from "@/app/components/Icons/IconSend"
import { IconSearch } from "@/app/components/Icons/IconSearch"
import { Message as IMessage } from "../interfaces/conversations"
import { Reaction } from "../interfaces/reactions"
import generateInitialsImage from "../utils/generateUserImage"
import { Message } from "./Message"
import { IconX } from "./Icons/IconX";

export const ActiveConversation = ({ messages }: { messages: IMessage[] }) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalImage, setModalImage] = useState<string>("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };

    const handleOpenModal = (show: boolean) => {
        setShowModal(show)
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                <div className="flex items-center">
                    {/* <div className="w-16 h-16 flex-none relative">
                        {generateInitialsImage(contact !== undefined ? contact : "C")}
                    </div>
                    <div className="ml-3 mr-auto">
                        <div className="flex items-center">
                            <div className="font-medium text-base">
                                {contact}
                            </div>
                        </div>
                    </div> */}
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

            <div ref={messagesContainerRef} className="overflow-y-auto scrollbar-hidden px-5 pt-5 flex-1 h-full">
                {messages.map((message, index) => {
                    if (message.message_type !== "reaction") {
                        const reacted = reactions.filter((reaction: Reaction) => reaction.waId === message.message?.id_whatsapp)

                        return (
                            <Message message={message} key={index} reaction={reacted} handleOpenModal={handleOpenModal} setModalImage={setModalImage} />
                        )
                    } else return null;
                })}
            </div>

            <div className="p-5 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
                <textarea
                    className="h-[56px] mx-3 w-full form-control h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0"
                    rows={1}
                    placeholder="Type your message..."
                ></textarea>
                <div className="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0">

                    <div className="w-4 h-4 sm:w-5 sm:h-5 relative text-slate-500 mr-3 sm:mr-5">
                        <IconPaperClip classes="w-full h-full text-gray-600" />
                        <input
                            type="file"
                            className="w-full h-full top-0 left-0 absolute opacity-0"
                        />
                    </div>
                </div>

                <a
                    href="#"
                    className="w-8 h-8 block bg-primary text-white rounded-full flex-none flex items-center justify-center"
                >
                    <IconSend classes="w-8 h-8 text-teal-600" />
                </a>
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
        </div>
    )
}