import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image"
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player'
import { convertEpochToDateTime } from "../../utils/transformDate";
import { IconCheck } from "../Icons/IconCheck";
import { IconClock } from "../Icons/IconClock";
import { IconDoubleCheck } from "../Icons/IconDoubleCheck";
import { IconExclamationCircle } from "../Icons/IconExclamationCircle";
import { Message as IMessage } from "../../interfaces/conversations"
import { Reaction } from "../../interfaces/reactions";
import { ActiveConversationSkeleton } from "../Skeleton/ActiveConversation";
import { validateBase64 } from "../../utils/validateBase64";
import { IconDocument } from "../Icons/IconDocument";
import { IconLink } from "../Icons/IconLink";
import React from "react";
import useActiveConversation from "../../hooks/useActiveConversation";
import { MemoizedMessageOptions } from "./MessageOptions/MessageOptions";
import { MessageContent } from "./MessageContent/MessageContent";

const Message = ({ message, reaction, handleOpenModal, setModalImage, highlightedText }: { message: IMessage, reaction: Reaction[], handleOpenModal: Function, setModalImage: Function, highlightedText: string }) => {
    const isRead = message.read;
    const isFromClient = message.status === "client";

    const TemplateReply = ({ template }: { template: any }) => {
        const { body, footer, header } = template;

        const renderHeader = () => {
            if (header && header.type !== "") {
                if (header.type === "image") {
                    return <Image
                        src={header.data}
                        width={300}
                        height={300}
                        alt="Header Image"
                        className="object-cover rounded-md w-full h-full"
                        loading="lazy"
                        decoding="async"
                    />;
                } else if (header.type === "text") {
                    return <h2 className="font-semibold text-sm">{header.data}</h2>;
                }
            }
            return null;
        };

        const renderContent = () => {
            if (body !== "") {
                return <p className="line-clamp-2 text-sm">{body}</p>;
            } else if (footer !== "") {
                return <p className="line-clamp-2 text-sm">{footer}</p>;
            }
            return null;
        };

        const renderLayout = () => {
            if (header && header.type === "image") {
                return (
                    <div className="grid grid-cols-2">
                        <div className="col-span-7/10">{renderContent()}</div>
                        <div className="col-span-3/10">{renderHeader()}</div>
                    </div>
                );
            } else {
                return <>{renderHeader()} {renderContent()}</>;
            }
        };

        return <>{renderLayout()}</>;
    };

    console.log(message)

    return (
        <>
            <div data-id={message.id} className={`flex text-md items-end rounded-md ${isFromClient ? 'float-left justify-start' : 'float-right justify-end'} ${isFromClient && !isRead ? ' fade-out' : ''}`}>
                <div className={
                    "max-w-xl " +
                    (message.message_type !== "sticker" ?
                        "messages-container " +
                        (isFromClient ? "bg-slate-200 " : "bg-emerald-100 ") +
                        (message.message_type === "image" && false ? "h-[270px]" : "")
                        : "h-[200px]")
                }>
                    {!!reaction.length &&
                        <span role="img" className={"reaction absolute bottom-4 " + (isFromClient ? "right-4" : "left-4")}>{reaction[0].emoji}</span>
                    }

                    {(message.message.response_to) &&
                        <div className={
                            "reply my-4 p-2 border-2 border-teal-200 rounded-md " +
                            (isFromClient ? "border-l-teal-500 bg-slate-100" : "border-r-teal-500 bg-green-300")
                        }>
                            <MessageContent message={message.replied_message} isReply={true} />
                        </div>
                    }

                    <MessageContent message={message} handleOpenModal={handleOpenModal} setModalImage={setModalImage} highlightedText={highlightedText} isReply={false} />

                    {/* text reaction image audio document sticker video location */}

                    <div className={"float-right relative " + (message.message_type === "sticker" ? "message-sticker-container " + (isFromClient ? "bg-slate-100" : "bg-emerald-100") : "")}>
                        <span className="mt-2 ms-2 text-xs text-slate-500">
                            {convertEpochToDateTime(Number(message.created_at))}
                        </span>

                        {message.status !== "client" ? (
                            message.status === "trying" ?
                                <IconClock classes="w-5 h-5 text-slate-500 inline-block ms-1" /> :
                                message.status === "sent" ?
                                    <IconCheck classes="w-5 h-5 text-slate-500 inline-block ms-1" /> :
                                    message.status === "delivered" ?
                                        <IconDoubleCheck classes="w-5 h-5 text-slate-500 inline-block ms-1" /> :
                                        message.status === "read" ?
                                            <IconDoubleCheck classes="w-5 h-5 text-cyan-500 inline-block ms-1" /> :
                                            <IconExclamationCircle classes="w-5 h-5 text-red-500 inline-block ms-1" />
                        ) : null
                        }
                    </div>
                </div>

                <div className={isFromClient ? "order-last" : "order-first"}>
                    <MemoizedMessageOptions message={message} />
                </div>
            </div >

            <div className="clear-both"></div>
        </>
    )
};

export const MemoizedMessage = React.memo(Message);

Message.displayName = 'Message';
