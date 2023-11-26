import { transformDate } from "../../utils/transformDate";
import { IconCheck } from "../Icons/IconCheck";
import { IconClock } from "../Icons/IconClock";
import { IconDoubleCheck } from "../Icons/IconDoubleCheck";
import { IconExclamationCircle } from "../Icons/IconExclamationCircle";
import { Message as IMessage } from "../../interfaces/conversations"
import { Reaction } from "../../interfaces/reactions";
import React from "react";
import { MemoizedMessageOptions } from "./MessageOptions/MessageOptions";
import { MessageContent } from "./MessageContent/MessageContent";

const Message = ({ message, reaction, handleOpenModal, setModalImage, highlightedText }: { message: IMessage, reaction: Reaction[], handleOpenModal: Function, setModalImage: Function, highlightedText: string }) => {
    const isRead = message.read;
    const isFromClient = message.status === "client";

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

                    <div className={"float-right relative top-2" + (message.message_type === "sticker" ? "message-sticker-container " + (isFromClient ? "bg-slate-100" : "bg-emerald-100") : "")}>
                        <span className="mt-2 ms-2 text-xs text-slate-500">
                            <small>
                                {transformDate(Number(message.created_at))}
                            </small>
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
