import { useEffect, useState, useMemo } from "react";
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
import useUser from "../hooks/useUser"
import { Reaction } from "../interfaces/reactions";
import { ActiveConversationSkeleton } from "./Skeleton/ActiveConversation";
import { validateBase64 } from "../utils/validateBase64";
import { IconDocument } from "./Icons/IconDocument";
import { IconLink } from "./Icons/IconLink";
import "./styles.scss"

export const Message = ({ message, reaction, handleOpenModal, setModalImage }: { message: IMessage, reaction: Reaction[], handleOpenModal: Function, setModalImage: Function }) => {
    // @ts-ignore
    const { userState } = useUser()
    const [content, setContent] = useState<string | undefined>("")
    const [loadingContent, setLoadingContent] = useState<boolean>(false)
    const [isFromClient, setIsFromClient] = useState(message.status === "client");
    const [isRead, setIsRead] = useState(message.read);

    useEffect(() => {
        if (message.message_type === "text") {
            setContent(message.message.body);
        } else if (['image', 'audio', 'document', 'video', 'sticker'].includes(message.message_type)) {
            setLoadingContent(true);

            getMedia(userState.token, message.message.url)
                .then((media) => {
                    setContent(media);
                    setLoadingContent(false);
                })
                .catch((error) => {
                    console.error("Error fetching media:", error);
                    setLoadingContent(false);
                });
        }
    }, []);

    //Validar cuando es una imagen con texto!

    const TemplateMessage = ({ message }: { message: any }) => {
        return (
            <div className="w-[300px]">
                {message.header !== "" &&
                    message.header.type === "text" ?
                    <h2>{message.data}</h2> :
                    message.header.type === "image" ?
                        <div className="relative h-[180px]">
                            <Image
                                src={message.header.data} //aquí va useState variable para que sea editable
                                width={300}
                                height={300}
                                alt="Imagen de template"
                                className="object-cover rounded-md w-full h-full"
                                loading="lazy"
                                decoding="async"
                                unoptimized
                            />
                        </div>
                        : null
                }

                {message.body !== "" && <p className="my-2 text-slate-800">{message.body}</p>}
                {message.footer !== "" && <p className="my-2 text-slate-500">{message.footer}</p>}

                {!!message.buttons.length &&
                    <div className="flex flex-wrap justify-around gap-2 border-t-2 border-slate-400 pt-2">
                        {message.buttons.map((button: any, index: number) => (
                            <button key={`btn-template-${index}`} className="button text-sky-500">
                                {button.url && <IconLink classes="w-6 h-6 w-6 h-6 mr-1 float-left" />}
                                {button.text}
                            </button>
                        ))}
                    </div>
                }
            </div>
        )
    }

    const TemplateReply = ({ template }: { template: any }) => {
        const { body, footer, header } = template;

        const renderHeader = () => {
            if (header && header.type !== "") {
                if (header.type === "image") {
                    return <img src={header.data} alt="Header Image" />;
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

    return (
        <>
            <div data-id={message.id} className={`flex text-md items-end rounded-md ${isFromClient ? 'float-left justify-start' : 'float-right justify-end'} ${isFromClient && !isRead ? ' fade-out' : ''}`}>
                <div className={
                    "max-w-xl " +
                    (message.message_type !== "sticker" ?
                        "messages-container " +
                        (isFromClient ? "bg-slate-200 " : "bg-emerald-100 ") +
                        (message.message_type === "image" && loadingContent ? "h-[270px]" : "")
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
                            {message.replied_message?.message_type === "template" ?
                                <TemplateReply template={message.replied_message?.message.template} />
                                : null
                            }
                        </div>
                    }

                    {message.message_type === "text" ?
                        <span>{content}</span>
                        : (message.message_type === "image" || message.message_type === "sticker") ?
                            loadingContent ?
                                <ActiveConversationSkeleton /> :
                                <>
                                    <Image
                                        src={content ? (validateBase64(content) ? content : '') : ""}
                                        width={message.message_type === "image" ? 250 : 150}
                                        height={message.message_type === "image" ? 250 : 150}
                                        alt="Imagen de mensaje"
                                        className={"object-cover rounded-md cursor-pointer " + (message.message_type === "image" ? "h-[230px]" : "h-[160px]")}
                                        onClick={() => {
                                            setModalImage(content)
                                            handleOpenModal(true)
                                        }}
                                        key={message.id}
                                    />
                                    {message.message.caption && <p className="my-2">{message.message.caption}</p>}
                                </>
                            : message.message_type === "video" ?
                                <>
                                    <ReactPlayer
                                        url={content}
                                        controls
                                        width="250px"
                                    />
                                    {message.message.caption && <p className="my-2">{message.message.caption}</p>}
                                </>
                                : message.message_type === "audio" ?
                                    <ReactAudioPlayer
                                        src={content}
                                        controls
                                    />
                                    : message.message_type === "document" ?
                                        <a href={content} target="_blank" download={message.message.filename} className="bg-slate-100 rounded p-5 text-teal-500 border border-slate-200 flex gap-2 items-center text-sm">
                                            <IconDocument classes="w-6 h-6 text-teal-600" />
                                            {message.message.filename}
                                        </a>
                                        : message.message_type === "location" ?
                                            <iframe src={`https://www.google.com/maps?q=${message.message.latitude},${message.message.longitude}&hl=es&output=embed`} width="300px" />
                                            : message.message_type === "template" ?
                                                <TemplateMessage message={message.message.template} />
                                                : message.message_type === "button" ?
                                                    <p>{message.message.text}</p>
                                                    : <>{message.message_type}</>
                    }

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
            </div >

            <div className="clear-both"></div>
        </>
    )
}