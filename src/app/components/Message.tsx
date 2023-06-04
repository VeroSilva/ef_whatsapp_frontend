import { useEffect, useState } from "react";
import Image from "next/image"
import ReactAudioPlayer from 'react-audio-player';
import ReactPlayer from 'react-player'
import { convertEpochToDateTime } from "../utils/transformDate";
import { IconCheck } from "./Icons/IconCheck";
import { IconClock } from "./Icons/IconClock";
import { IconDoubleCheck } from "./Icons/IconDoubleCheck";
import { IconExclamationCircle } from "./Icons/IconExclamationCircle";
import { Message as IMessage } from "../interfaces/conversations"
import { getMedia } from "../services/api";
import useUser from "../hooks/user/useUser"
import { Reaction } from "../interfaces/reactions";
import { ActiveConversationSkeleton } from "./Skeleton/ActiveConversation";
import { validateBase64 } from "../utils/validateBase64";

export const Message = ({ message, reaction, handleOpenModal, setModalImage }: { message: IMessage, reaction: Reaction[], handleOpenModal: Function, setModalImage: Function }) => {
    // @ts-ignore
    const { userState } = useUser()
    const [content, setContent] = useState("")
    const [loadingContent, setLoadingContent] = useState<boolean>(false)
    const isFromClient = message.status === "client"

    useEffect(() => {
        switch (message.message_type) {
            case "text":
                setContent(message.message.body);
                break;

            case "image":
            case "audio":
            case "document":
            case "video":
            case "sticker":
                try {
                    setLoadingContent(true)

                    getMedia(userState.token, message.message.url)
                        .then((media) => {
                            setContent(media)
                            setLoadingContent(false)
                        })

                } catch (error) {
                    console.error("Error fetching media:", error);
                }
                break;

            default:
                break;
        }
    }, [message]);

    //Validar cuando es una imagen con texto!

    return (
        <>
            <div className={"flex items-end " + (isFromClient ? "float-left justify-start" : "float-right justify-end")}>
                <div className={
                    (message.message_type !== "sticker" ?
                        "messages-container " +
                        (isFromClient ? "bg-slate-100" : "bg-emerald-100")
                        : "")
                }>
                    {!!reaction.length &&
                        <span role="img" className={"reaction absolute -bottom-4 " + (isFromClient ? "right-4" : "left-4")}>{reaction[0].emoji}</span>
                    }

                    {message.message_type === "text" ? (
                        <span>{content}</span>
                    ) : (
                        (message.message_type === "image" || message.message_type === "sticker") ?
                            loadingContent ?
                                <ActiveConversationSkeleton /> :
                                <Image
                                    src={validateBase64(content) ? content : ''}
                                    width={message.message_type === "image" ? 250 : 150}
                                    height={message.message_type === "image" ? 250 : 150}
                                    alt="Imagen de mensaje"
                                    className="object-cover rounded-md cursor-pointer"
                                    onClick={() => {
                                        setModalImage(content)
                                        handleOpenModal(true)
                                    }}
                                    key={message.id}
                                />
                            : message.message_type === "video" ?
                                <ReactPlayer
                                    url={content}
                                    controls
                                    width="250px"
                                />
                                : message.message_type === "audio" ?
                                    <ReactAudioPlayer
                                        src={content}
                                        controls
                                    />
                                    : message.message_type === "document" ?
                                        <a href={content} target="_blank" download={message.message.filename}>{message.message.filename}</a>
                                        : message.message_type === "location" ?
                                            <iframe src={`https://www.google.com/maps?q=${message.message.latitude},${message.message.longitude}&hl=es&output=embed`} width="300px" />
                                            : <>{message.message_type}</>
                    )}

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
            </div>

            <div className="clear-both"></div>
        </>
    )
}