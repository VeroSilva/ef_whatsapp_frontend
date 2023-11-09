import { useCallback, useEffect, useState } from "react"
import { Message } from "@/app/interfaces/conversations"
import { getMedia } from "../../../services/api"
import useUser from "../../../hooks/useUser"
import { ActiveConversationSkeleton } from "../../Skeleton/ActiveConversation"
import Image from "next/image"
import { validateBase64 } from "@/app/utils/validateBase64"
import ReactPlayer from "react-player"
import ReactAudioPlayer from "react-audio-player"
import { IconDocument } from "../../Icons/IconDocument"
import { IconLink } from "../../Icons/IconLink"
import useActiveConversation from "../../../hooks/useActiveConversation";
import { MessageInteractive } from "./MessageInteractive/MessageInteractive"

export const MessageContent = ({ message, handleOpenModal, setModalImage, highlightedText, isReply }:
    { message: Message | null | undefined, handleOpenModal?: Function, setModalImage?: Function, highlightedText?: string, isReply: boolean }) => {
    const { userState } = useUser()
    //@ts-ignore
    const { activeConversationState } = useActiveConversation()
    const [content, setContent] = useState<string | undefined>("")
    const [loadingContent, setLoadingContent] = useState<boolean>(false)

    const handleGetMedia = useCallback(() => {
        setLoadingContent(true);

        getMedia(userState.token, message?.message.url, activeConversationState.id)
            .then((media) => {
                setContent(media);
            })
            .catch((error) => {
                console.error("Error fetching media:", error);
            })
            .finally(() => {
                setLoadingContent(false);
            });

    }, [])

    useEffect(() => {
        if (message)
            if (message?.message_type === "text") {
                setContent(message.message.body);
            } else if (
                ['image', 'audio', 'document', 'video', 'sticker'].includes(
                    message?.message_type
                ) &&
                !content
            ) {
                handleGetMedia();
            }
    }, [message, content]);

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

    const TemplateMessage = ({ message }: { message: any }) => {
        const highlightedBody = (highlightedText === '') ? message.body : message.body.replace(highlightedText, '<mark>$1</mark>');
        const highlightedFooter = (highlightedText === '') ? message.footer : message.footer.replace(highlightedText, '<mark>$1</mark>');

        return (
            <div className="w-[300px]">
                {message.header !== "" &&
                    message.header.type === "text" ?
                    <h2>{message.data}</h2> :
                    message.header.type === "image" ?
                        <div className="relative h-[180px]">
                            <Image
                                src={message.header.data}
                                width={300}
                                height={300}
                                alt="Imagen de template"
                                className="object-cover rounded-md w-full h-full"
                                loading="lazy"
                                decoding="async"
                                key={message.id}
                            />
                        </div>
                        : null
                }

                {message.body !== "" && <p
                    className="my-2 text-slate-800"
                    dangerouslySetInnerHTML={{ __html: highlightedBody }}
                />}
                {message.footer !== "" && <p
                    className="my-2 text-slate-500"
                    dangerouslySetInnerHTML={{ __html: highlightedFooter }}
                />}

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

    return (
        message?.message_type === "text" ?
            <span>{content}</span>
            : (message?.message_type === "image" || message?.message_type === "sticker") ?
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
                                if (setModalImage && handleOpenModal) {
                                    setModalImage(content)
                                    handleOpenModal(true)
                                }
                            }}
                            key={`image-message-${message.id}`}
                            priority
                        />
                        {message.message.caption && <p className="my-2">{message.message.caption}</p>}
                    </>
                : message?.message_type === "video" ?
                    <>
                        <ReactPlayer
                            url={content}
                            controls
                            width="250px"
                        />
                        {message.message.caption && <p className="my-2">{message.message.caption}</p>}
                    </>
                    : message?.message_type === "audio" ?
                        <ReactAudioPlayer
                            src={content}
                            controls
                        />
                        : message?.message_type === "document" ?
                            <a href={content} target="_blank" download={message?.message.filename} className="bg-slate-100 rounded p-5 text-teal-500 border border-slate-200 flex gap-2 items-center text-sm">
                                <IconDocument classes="w-6 h-6 text-teal-600" />
                                {message.message.filename}
                            </a>
                            : message?.message_type === "location" ?
                                <iframe src={`https://www.google.com/maps?q=${message.message.latitude},${message.message.longitude}&hl=es&output=embed`} width="300px" />
                                : message?.message_type === "template" ?
                                    isReply ? <TemplateReply template={message.message.template} /> : <TemplateMessage message={message.message.template} />
                                    : message?.message_type === "button" ?
                                        <p>{message?.message.text}</p>
                                        : message?.message_type === "interactive" ?
                                            <MessageInteractive message={message.message} />
                                            : <>{message?.message_type} !!!!</>
    )
}