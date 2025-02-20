import { useEffect, useState } from "react"
import { Spinner } from "flowbite-react"
import { IconSend } from "../../Icons/IconSend"
import { IconTrash } from "../../Icons/IconTrash"
import { AudioRecorder } from "../../AudioRecorder/AudioRecorder"
import { useMessage } from "@/app/hooks/useMessage"
import { MediaDropdown } from "../ChatMediaDropdown/ChatMediaDropdown"
import { createConversation, getTemplates } from "@/app/services/api"
import useUser from "@/app/hooks/useUser"
import { dataMessageToSend } from "@/app/utils/messages"
import { InputSendMessage } from "../../InputSendMessage/InputSendMessage"
import useActiveConversation from "@/app/hooks/useActiveConversation";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply"
import { MessageContent } from "../../Message/MessageContent/MessageContent"
import { IconX } from "../../Icons/IconX"
import { initialStateActiveMessageReply } from "@/app/context/activeMessageReply/ActiveMessageReplyProvider"
import { MessageDataToSend } from "@/app/interfaces/conversations"
import { Template } from "@/app/interfaces/template"
import { ChatTemplateList } from "../ChatTemplateList/ChatTemplateList"
import useActivePhone from "@/app//hooks/useActivePhone";

export const ChatBottomSection = ({ conversationId, setSelectedFile, newConversationPhone, setPreviewType, setShowPreview }: { conversationId: number, setSelectedFile: Function, newConversationPhone?: string, setPreviewType: Function, setShowPreview: Function }) => {
    const [messageToSend, setMessageToSend] = useState<string>("")
    const [audio, setAudio] = useState<Blob | null>(null)
    const { sendMessage, isLoading } = useMessage()
    const { userState } = useUser()
    const { setActiveConversation } = useActiveConversation()
    const { activePhone } = useActivePhone()
    const { activeMessageReply, setActiveMessageReply } = useActiveMessageReply()
    const [activeTemplateList, setActiveTemplateList] = useState(false)
    const [templatesList, setTemplatesList] = useState<Template[]>([])

    const handleSendMessage = async (type: string, data: any, resetData: Function) => {
        if (conversationId === -1) {
            const dataToSend = await dataMessageToSend({ data, type })

            createConversation({ to: newConversationPhone, messageData: dataToSend, company_phone_id: activePhone }, userState.token)
                .then((res) => {
                    const { contact, id } = res
                    setActiveConversation({ contact, id, tags: [] })
                })
        } else {
            const messageData: MessageDataToSend = {
                type,
                data,
                conversationId
            }

            if (activeMessageReply.id !== 0) messageData["context"] = { message_id: activeMessageReply.message.id_whatsapp }

            sendMessage(messageData).finally(() => resetData())
        }
    }

    const handleResetActiveMessageReply = () => {
        setActiveMessageReply(initialStateActiveMessageReply)
    }

    useEffect(() => {
        if (messageToSend.startsWith('*')) {
            setActiveTemplateList(true);

            getTemplates(userState.token, activePhone).then((res) => {
                const filteredTemplates = res.templates.filter((template: Template) =>
                    template.name.toLowerCase().includes(messageToSend.slice(1).toLowerCase())
                );
                setTemplatesList(filteredTemplates);
            });
        } else {
            setActiveTemplateList(false);
        }
    }, [messageToSend]);

    return (
        <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400 transition-opacity duration-300">
            {activeMessageReply.conversation_id !== 0 &&
                <div className="reply flex items-center justify-between my-4 p-2 border-2 border-teal-200 rounded-md border-l-teal-500 bg-slate-100 w-full">
                    <MessageContent message={activeMessageReply} isReply={true} />

                    <button onClick={handleResetActiveMessageReply}>
                        <IconX classes="w-6 h-6" />
                    </button>
                </div>
            }

            {activeTemplateList &&
                <ChatTemplateList templatesList={templatesList} activeTemplateList={activeTemplateList} setActiveTemplateList={setActiveTemplateList} setMessageToSend={setMessageToSend} />
            }

            <div className="flex items-center">
                <MediaDropdown setSelectedFile={setSelectedFile} setPreviewType={setPreviewType} setShowPreview={setShowPreview} />

                {audio ? (
                    <div className="audio-container w-full flex items-center border border-gray-200 px-2 bg-gray-100 rounded-lg">
                        <audio src={URL.createObjectURL(audio)} controls className="w-full"></audio>

                        <div className="flex items-center w-[100px] justify-around">
                            <button
                                onClick={() => setAudio(null)}
                            >
                                <IconTrash classes="w-7 h-7 text-rose-600" />
                            </button>
                            <button
                                className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center ease-in duration-100 p-1"
                                onClick={() => handleSendMessage("audio", audio, () => {
                                    setAudio(null)
                                    handleResetActiveMessageReply()
                                })}
                                disabled={isLoading}
                            >
                                {isLoading ?
                                    <Spinner aria-label="Default status example" /> :
                                    <IconSend classes="w-8 h-8 text-slate-100 ease-in duration-100" />
                                }
                            </button>
                        </div>
                    </div>
                ) : (
                    <InputSendMessage handleSendMessage={handleSendMessage} setMessageToSend={setMessageToSend} messageToSend={messageToSend} />
                )}

                {!audio ?
                    messageToSend.trim() === "" && !isLoading ?
                        <AudioRecorder audio={audio} setAudio={setAudio} /> :
                        <button
                            className="w-12 h-12 bg-slate-100 hover:bg-teal-600 text-white rounded-full flex items-center justify-center group ease-in duration-100"
                            onClick={() => handleSendMessage("text", messageToSend, () => {
                                setMessageToSend("")
                                handleResetActiveMessageReply()
                            })}
                            disabled={isLoading}
                        >
                            {isLoading ?
                                <Spinner aria-label="Default status example" /> :
                                <IconSend classes="w-8 h-8 text-teal-600 group-hover:text-slate-100 ease-in duration-100" />
                            }
                        </button> :
                    null
                }
            </div>
        </div>
    )
}