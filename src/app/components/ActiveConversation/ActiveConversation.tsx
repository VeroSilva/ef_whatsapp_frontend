import { useEffect, useState, useRef } from "react";
import { Modal } from 'flowbite-react';
import Image from "next/image";
import { IconUserPlus } from "@/app/components/Icons/IconUserPlus";
import { IconEllipsisVertical } from "@/app/components/Icons/IconEllipsisVertical";
import { IconSearch } from "@/app/components/Icons/IconSearch";
import { Message as IMessage, Contact } from "../../interfaces/conversations";
import { Reaction } from "../../interfaces/reactions";
import GenerateInitialsImage from "../../utils/generateUserImage";
import { Message } from "../Message";
import { IconX } from "../Icons/IconX";
import { ConversationBottomSection } from "./ConversationBottomSection/ConversationBottomSection";
import { ConversationPreview } from "../ConversationPreview/ConversationPreview";
import { Template } from "../../interfaces/template";
import { formatPhoneNumber } from "@/app/utils/formatPhone";
import { Spinner } from "flowbite-react";

interface ActiveConversationProps {
    messages: IMessage[];
    conversationId: number;
    activeContact: Contact;
    loadMessages: (clear: boolean, id: number) => void,
    loadingMessages: Boolean;
}

export const ActiveConversation: React.FC<ActiveConversationProps> = ({
    messages,
    conversationId,
    activeContact,
    loadMessages,
    loadingMessages
}) => {
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalImage, setModalImage] = useState<string>("");
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [isScrolledToTop, setIsScrolledToTop] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [classifiedTemplates, setClassifiedTemplates] = useState<any[]>([]);
    const [updatedMessages, setUpdatedMessages] = useState<IMessage[]>([]);
    const [currentTopMessage, setCurrentTopMessage] = useState(0);

    useEffect(() => {
        if (!isScrolledToBottom && updatedMessages.length) {
            scrollToElement(updatedMessages[updatedMessages.length - 1].id);
        } else if (isScrolledToTop && updatedMessages.length) {
            scrollToElement(currentTopMessage);
        } else if (isScrolledToBottom && updatedMessages.length) {
            scrollToElement(updatedMessages[updatedMessages.length - 1].id);
        }
    }, [updatedMessages]);

    useEffect(() => {
        if (isScrolledToTop == true && updatedMessages.length) {
            setCurrentTopMessage(updatedMessages[0].id)
            loadMessages(false, conversationId)
        }
    }, [isScrolledToTop]);

    useEffect(() => {
        setReactions([]);
        messages
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
                const repliedMessage = messages.find(
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

    useEffect(() => {
        if (!!templates.length) {
            setClassifiedTemplates([]);

            templates.forEach((item) => {
                setClassifiedTemplates((prevTemplate) => {
                    const isCategoryExist = prevTemplate.some(
                        (template) => template.category === item.category
                    );

                    if (isCategoryExist) {
                        const updatedArray = prevTemplate.map((template) =>
                            template.category === item.category
                                ? { ...template, data: [...template.data, item] }
                                : template
                        );
                        return updatedArray;
                    } else {
                        const newCategoryData = {
                            category: item.category,
                            data: [item],
                        };
                        return [...prevTemplate, newCategoryData];
                    }
                });
            });
        }
    }, [templates]);

    useEffect(() => {
        if (selectedFile !== null || !!templates.length) {
            setShowPreview(true);
        }
    }, [selectedFile, templates]);

    useEffect(() => {
        if (!showPreview) {
            setSelectedFile(null);
            setTemplates([]);
        }
    }, [showPreview]);

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtTop = scrollTop <= 5;
            const isAtBottom = scrollHeight - scrollTop >= clientHeight - 1.5;
            setIsScrolledToTop(isAtTop);
            setIsScrolledToBottom(isAtBottom);
        }
    };

    const scrollToElement = (id: Number) => {
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.scrollIntoView();
        }
    };

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const [searchText, setSearchText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    function handleSearchTextChange() {
        if (searchText !== '') {
            const regex = new RegExp(`(${searchText})`, 'gi');
            const parentDiv = messagesContainerRef.current;
            if (parentDiv) {
                const messageEls = parentDiv.querySelectorAll('p, span, a');
                messageEls.forEach((el) => {
                    el.innerHTML = el.textContent ? el.textContent.replace(regex, '<mark>$1</mark>') : '';
                });
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        console.log('asd')
        if (event.key === "Enter") {
            handleSearchTextChange();
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 flex-none relative">
                        {GenerateInitialsImage(activeContact.name ?? "")}
                    </div>
                    <div className="ml-3 mr-auto">
                        <div className="flex items-center">
                            <div className="font-medium text-base">
                                {activeContact.name && activeContact.name !== ""
                                    ? activeContact.name
                                    : formatPhoneNumber(activeContact.phone)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                        </div>
                        <input
                            ref={inputRef}
                            type="search"
                            id="default-search"
                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 input-sky"
                            placeholder="Buscar coincidencia"
                            required
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
            </div>
            <div ref={messagesContainerRef} onScroll={handleScroll} className="flex flex-col overflow-y-auto scrollbar-hidden px-5 pt-5 flex-1 h-full">
                {

                    (isScrolledToTop && loadingMessages) && (
                        <div className="flex justify-center items-center h-screen">
                            <Spinner
                                aria-label="Extra large spinner example"
                                size="xl"
                            />
                        </div>
                    )
                }

                {updatedMessages.map((message, index) => {
                    if (message.message_type !== "reaction") {
                        const reacted = reactions.filter((reaction: Reaction) => reaction.waId === message.message?.id_whatsapp);
                        return <Message message={message} key={index} reaction={reacted} handleOpenModal={handleOpenModal} setModalImage={setModalImage} />;
                    } else return null;
                })}
            </div>

            {showPreview && (
                <ConversationPreview selectedFile={selectedFile} classifiedTemplates={classifiedTemplates} conversationId={conversationId} setShowPreview={setShowPreview} newConversationPhone={conversationId === -1 ? activeContact.phone : undefined} />
            )}

            <ConversationBottomSection conversationId={conversationId} setSelectedFile={setSelectedFile} setTemplates={setTemplates} newConversationPhone={conversationId === -1 ? activeContact.phone : undefined} />

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
    );
};

