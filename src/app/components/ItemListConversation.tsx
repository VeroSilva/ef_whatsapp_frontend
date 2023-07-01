// "use client";

import { useEffect, useState } from 'react';
import GenerateInitialsImage from '../utils/generateUserImage';
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
import { IconTemplates } from './Icons/IconTemplates';
import { IconReply } from './Icons/IconReply';

export const ItemListConversation = ({ conversation, handleOpenConversation, setActiveContact, activeConversation }: { conversation: any, handleOpenConversation: Function, setActiveContact: Function, activeConversation: number }) => {
    const [unreadCount, setUnreadCount] = useState(false)

    useEffect(() => {
        setUnreadCount(parseInt(conversation.unread_count) > 0)
    }, [conversation])

    const handleClick = () => {
        if (activeConversation !== conversation.id) {
            handleOpenConversation(conversation.id)
            setActiveContact(conversation.contact)
            localStorage.setItem("activeContact", JSON.stringify(conversation.contact));
        }

        setUnreadCount(false)
    }

    return (
        <div
            className={
                "cursor-pointer flex items-start border-b border-t border-slate-200/60 group/item py-5 px-5 -mb-px last:border-b-0 " +
                (unreadCount ? "bg-teal-100" : "hover:bg-slate-100")
            }
            onClick={handleClick}
        >
            <div className="w-14 h-14 flex-none image-fit mr-1">
                {GenerateInitialsImage(conversation.contact.name)}
            </div>
            <div className="ml-2 overflow-hidden flex-1">
                <div className="flex items-center">
                    <a href="#" className="font-medium">
                        {conversation.contact.name}
                    </a>
                    <div className="text-xs text-slate-500 ml-auto ">
                        <span className={(unreadCount ? "text-teal-500 font-semibold" : "")}>{transformDate(conversation.message_created_at)}</span>
                    </div>
                </div>
                {conversation.phone !== null &&
                    <div className="w-full truncate text-xs text-slate-500 mt-0.5">
                        {formatPhoneNumber(conversation.contact.phone)}
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
                                                            <><IconTemplates classes='w-5 h-5 text-slate-500 inline-block' /> Template</> :
                                                            conversation.message_type === "button" ?
                                                                <><IconReply classes='w-5 h-5 text-slate-500 inline-block' /> Respuesta template</> :
                                                                <></>
                            //falta contact 
                        }
                    </div>
                    {unreadCount && (
                        <div className="w-5 h-5 flex items-center justify-center bg-teal-500 text-xs text-white rounded-full bg-primary font-medium -mt-1">
                            {conversation.unread_count}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}