// "use client";

import { useEffect, useState } from 'react';
import { MemoizedGenerateInitialsImage } from '../utils/generateUserImage';
import { IconCheck } from './Icons/IconCheck';
import { IconClock } from './Icons/IconClock';
import { IconDocument } from './Icons/IconDocument';
import { IconDoubleCheck } from './Icons/IconDoubleCheck';
import { IconExclamationCircle } from './Icons/IconExclamationCircle';
import { IconImage } from './Icons/IconImage';
import { IconLocation } from './Icons/IconLocation';
import { IconMicrophone } from './Icons/IconMicrophone';
import { IconSticker } from './Icons/IconSticker';
import { IconVideoCamera } from './Icons/IconVideoCamera';
import { transformDate } from '@/app/utils/transformDate';
import { formatPhoneNumber } from '../utils/formatPhone';
import { IconMessages } from './Icons/IconMessages';
import { IconReply } from './Icons/IconReply';
import { IconWarning } from './Icons/IconWarning';
import { markAsRead } from '@/app/services/api';

import useUser from "../hooks/useUser"
import useActiveConversation from "../hooks/useActiveConversation";
import useChatsRead from "../hooks/useChatsRead";
import React from 'react';
import { SelectedTags } from './Chat/SelectedTags/SelectedTags';

export const ItemListConversation = ({ conversation, handleOpenConversation, activeConversation, filter }: { conversation: any, handleOpenConversation: Function, activeConversation: number, filter: string }) => {
    const [isUnread, setIsUnread] = useState(false)
    // @ts-ignore
    const { setActiveConversation } = useActiveConversation()
    const { chatsReadState, setChatsRead } = useChatsRead()
    const { userState } = useUser()

    useEffect(() => {
        const isRead = chatsReadState.includes(conversation.id)

        setIsUnread(!isRead && (parseInt(conversation.unread_count) > 0))
    }, [conversation, chatsReadState])

    const handleClick = () => {
        if (activeConversation !== conversation.id) {
            setActiveConversation({
                contact: conversation.contact,
                id: conversation.id,
                tags: conversation.tags,
                user_assigned_id: conversation.user_assigned_id,
                user_assigned_name: conversation.user_assigned_name,
            })
            markAsRead(userState.token, conversation.id)
            handleOpenConversation(conversation.id)
        }

        setChatsRead((prevChatsRead: string[]) => {
            if (prevChatsRead.includes(conversation.id)) {
                return prevChatsRead;
            }
            return [...prevChatsRead, conversation.id];
        });
    }

    const highlightText = (text: string, filter: string) => {
        const escapedFilter = filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedFilter})`, 'gi');
        const parts = text ? text.split(regex) : [];

        return parts.map((part, index) => {
            if (part.toLowerCase() === filter.toLowerCase()) {
                return <span key={index} className="font-bold text-teal-500">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div
            className={
                "cursor-pointer flex flex-wrap items-start border-b border-t border-slate-200/60 group/item py-2 px-5 -mb-px last:border-b-0 " +
                (isUnread ? "bg-teal-100" : "hover:bg-slate-100")
            }
            onClick={handleClick}
        >
            <div className='w-full mb-2 flex gap-2 flex-wrap'>
                <SelectedTags tags={conversation.tags} />
            </div>

            <div className="w-10 h-10 flex-none image-fit mr-1">
                <MemoizedGenerateInitialsImage name={conversation.contact.name ?? ""} color="#115e59" />
            </div>

            <div className="ml-2 overflow-hidden flex-1">
                <div className="flex items-center">
                    <a href="#" className="font-medium overflow-hidden overflow-ellipsis whitespace-nowrap">
                        {highlightText(conversation.contact.name, filter)}
                    </a>
                    <div className="text-xs text-right text-slate-500 ml-auto whitespace-nowrap">
                        <p className={(isUnread ? "text-teal-500 font-semibold" : "")}>
                            <small>
                                {transformDate(conversation.message_created_at)}
                            </small>
                        </p>
                        {
                            Math.floor((Date.now() - conversation.message_created_at * 1000) / (1000 * 60 * 60)) >= 24 && (
                                <div className="group relative">
                                    <IconWarning classes="w-5 h-5 text-yellow-400 inline-block me-1" />
                                    <span className="z-50 whitespace-nowrap absolute top- right-0 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Recontactar cliente</span>
                                </div>
                            )
                        }
                    </div>
                </div>
                {conversation.phone !== null &&
                    <div className="w-full truncate text-xs text-slate-500 mt-0.5">
                        {highlightText(formatPhoneNumber(conversation.contact.phone), filter)}
                    </div>
                }
                <div className="flex mt-2">
                    <div className="flex-1 mr-3 truncate text-sm">
                        {conversation.status !== "client" ? (
                            conversation.status === "trying" ?
                                <IconClock classes="w-5 h-5 text-slate-500 inline-block me-1" /> :
                                conversation.status === "sent" ?
                                    <IconCheck classes="w-5 h-5 text-slate-500 inline-block me-1" /> :
                                    conversation.status === "delivered" ?
                                        <IconDoubleCheck classes="w-5 h-5 text-slate-500 inline-block me-1" /> :
                                        conversation.status === "read" ?
                                            <IconDoubleCheck classes="w-5 h-5 text-cyan-500 inline-block me-1" /> :
                                            <IconExclamationCircle classes="w-5 h-5 text-red-500 inline-block me-1" />
                        ) : null
                        }

                        {conversation.message_type === "text" ?
                            conversation.last_message :
                            conversation.message_type === "audio" ?
                                <><IconMicrophone classes="w-5 h-5 text-slate-500 inline-block" /> Audio</> :
                                conversation.message_type === "video" ?
                                    <><IconVideoCamera classes="w-5 h-5 text-slate-500 inline-block" /> Video</> :
                                    conversation.message_type === "document" ?
                                        <><IconDocument classes="w-5 h-5 text-slate-500 inline-block" /> Documento</> :
                                        conversation.message_type === "image" ?
                                            <><IconImage classes="w-5 h-5 text-slate-500 inline-block" /> Imagen</> :
                                            conversation.message_type === "sticker" ?
                                                <><IconSticker classes="w-5 h-5 text-slate-500 inline-block" /> Sticker</> :
                                                conversation.message_type === "reaction" ?
                                                    (conversation.status === "client" ? "Reaccionó " : "Reaccionaste ") + conversation.last_message + " a un mensaje" :
                                                    conversation.message_type === "location" ?
                                                        <><IconLocation classes="w-5 h-5 text-slate-500 inline-block" /> Ubicación</> :
                                                        conversation.message_type === "template" ?
                                                            <><IconMessages classes='w-5 h-5 text-slate-500 inline-block' /> Template</> :
                                                            conversation.message_type === "button" ?
                                                                <><IconReply classes='w-5 h-5 text-slate-500 inline-block' /> Respuesta template</> :
                                                                conversation.message_type === "interactive" ?
                                                                    <span>Productos</span> :
                                                                    <></>
                            //falta contact 
                        }
                    </div>
                    {isUnread && (
                        <div className="w-5 h-5 flex items-center justify-center bg-teal-500 text-xs text-white rounded-full bg-primary font-medium -mt-1">
                            {conversation.unread_count}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full mt-2">
                {conversation.user_assigned_name && (
                    <>
                        <span className="text-xs text-slate-800">Asignado a: </span>
                        <span className="text-xs font-bold uppercase text-teal-800">
                            {conversation.user_assigned_name}
                        </span>
                    </>
                )}
                {!conversation.user_assigned_name && (
                    <span className="text-xs text-gray-500">
                        Sin Asignar
                    </span>
                )}
            </div>
        </div>
    )
}
