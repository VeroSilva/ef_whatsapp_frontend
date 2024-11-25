import { useEffect, useRef, useState } from "react";
import { ActiveConversationSkeleton } from "../Skeleton/ActiveConversation"
import { ListMessages } from "./ListMessages/ListMessages";
import Image from "next/image";
import useActiveConversation from "@/app/hooks/useActiveConversation";
import { MemoizedGenerateInitialsImage } from "@/app/utils/generateUserImage";
import { formatPhoneNumber } from "@/app/utils/formatPhone";
import { IconSearch } from "../Icons/IconSearch";
import React from "react";
import { ConversationPreview } from "../ConversationPreview/ConversationPreview/ConversationPreview";
import { ChatBottomSection } from "./ChatBottomSection/ChatBottomSection";
import { ChatOptions } from "./ChatOptions/ChatOptions";
import { SelectedTags } from "./SelectedTags/SelectedTags";
import useUser from "@/app/hooks/useUser";
import { Tag } from "@/app/interfaces/conversations";
import { useSocket } from "@/app/context/socket/SocketContext";
import { getCatalog } from "@/app/services/api";
import useCatalog from '@/app/hooks/useCatalog';
import useActivePhone from "../../hooks/useActivePhone";

export const Chat = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loadingInitialMessages, setLoadingInitialMessages] = useState<boolean>(false);
    const [searchText, setSearchText] = useState("");
    const [highlightedText, setHighlightedText] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { activeConversationState, setActiveConversation } = useActiveConversation();
    const { userState } = useUser()
    const [updatedTags, setUpdatedTags] = useState<Tag[]>([])
    const [previewType, setPreviewType] = useState<string>("")
    const { socketInstance } = useSocket();
    const { setCatalogState } = useCatalog();
    const { activePhone } = useActivePhone();

    useEffect(() => {
        if (selectedFile !== null) {
            setShowPreview(true);
        }
    }, [selectedFile]);

    useEffect(() => {
        if (!showPreview) {
            setSelectedFile(null);
        }
    }, [showPreview]);

    useEffect(() => {
        if (activeConversationState.id !== 0) setUpdatedTags(activeConversationState.tags)
    }, [activeConversationState])

    useEffect(() => {
        if (!socketInstance) {
            return;
        }

        const conversationTagListener = (payload: any) => {
            if (payload.data.tags) {
                if (activeConversationState.id === payload.data.id) {
                    setUpdatedTags(payload.data.tags)
                    setActiveConversation((prevActiveConversation: any) => (
                        {
                            ...prevActiveConversation,
                            tags: payload.data.tags
                        }
                    ))
                }
            }
        }

        const socket = socketInstance;

        socket.on('conversation_tags', conversationTagListener);

        return () => {
            socket.off('conversation_tags', conversationTagListener);
        }
    }, [userState.token, activeConversationState.tags, socketInstance])

    useEffect(() => {
        getCatalog(userState.token, activePhone).then((res) => {
            setCatalogState(res.catalog)
        })
    }, [])

    function handleSearchTextChange() {
        if (searchText !== '') {
            const regex = new RegExp(`(${searchText})`, 'gi');
            //@ts-ignore
            setHighlightedText(regex);
        } else {
            setHighlightedText('');
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearchTextChange();
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    }

    return (
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9 overflow-auto">
            <div className="box h-full intro-y bg-slate-50 rounded-tr-md rounded-br-md border border-gray-200">
                {/* BEGIN: Chat Active */}
                {loadingInitialMessages ?
                    <ActiveConversationSkeleton /> :
                    activeConversationState.id !== 0 ?
                        <>
                            <div className="h-full flex flex-col relative">
                                <div className="border-b border-slate-200/60 px-5 py-4">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 flex-none relative">
                                                <MemoizedGenerateInitialsImage name={(activeConversationState.contact.name ?? "")} color="#0d9488" />
                                            </div>

                                            <div className="ml-3 mr-auto">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-base">
                                                        {activeConversationState && activeConversationState.contact.name && activeConversationState.contact.name !== ""
                                                            ? <>
                                                                <span className="block">{activeConversationState.contact.name}</span>
                                                                <span className="block text-gray-500 text-sm">{formatPhoneNumber(activeConversationState.contact.phone)}</span>
                                                            </>
                                                            : formatPhoneNumber(activeConversationState.contact.phone)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative ms-4">
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
                                        <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
                                            <div className='w-full mb-2 flex gap-2 flex-wrap items-center'>
                                                <ChatOptions />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        {activeConversationState && <SelectedTags tags={updatedTags} isInChat />}
                                    </div>
                                </div>

                                <ListMessages highlightedText={highlightedText} />

                                {showPreview ?
                                    previewType === "file" ?
                                        <ConversationPreview type={previewType} selectedFile={selectedFile} conversationId={activeConversationState.id} handleClosePreview={handleClosePreview} newConversationPhone={activeConversationState.id === -1 ? activeConversationState.contact.phone : undefined} />
                                        : previewType === "interactive" ?
                                            <ConversationPreview type={previewType} conversationId={activeConversationState.id} handleClosePreview={handleClosePreview} newConversationPhone={activeConversationState.id === -1 ? activeConversationState.contact.phone : undefined} />
                                            : null
                                    : null
                                }

                                <ChatBottomSection conversationId={activeConversationState.id} setSelectedFile={setSelectedFile} newConversationPhone={activeConversationState.id === -1 ? activeConversationState.contact.phone : undefined} setPreviewType={setPreviewType} setShowPreview={setShowPreview} />
                            </div>
                        </> :
                        <div className='h-full w-full flex justify-center items-center'>
                            <Image
                                src="/images/home.png"
                                width={250}
                                height={250}
                                alt="Imagen de mensaje"
                                className='grayscale'
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                }
                {/* END: Chat Active */}
            </div>
        </div>
    )
}