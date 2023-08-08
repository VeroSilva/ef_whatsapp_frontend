import { useState } from "react"
import { Spinner } from "flowbite-react"
import { IconSend } from "../../Icons/IconSend"
import { IconTrash } from "../../Icons/IconTrash"
import { AudioRecorder } from "../../AudioRecorder/AudioRecorder"
import { useMessage } from "@/app/hooks/useMessage"
import { MediaDropdown } from "../ChatMediaDropdown/ChatMediaDropdown"
import { createConversation } from "@/app/services/api"
import useUser from "@/app/hooks/useUser"
import { dataMessageToSend } from "@/app/utils/messages"
import { InputSendMessage } from "../../InputSendMessage/InputSendMessage"
import { usePathname } from "next/navigation"
import useActiveConversation from "@/app/hooks/useActiveConversation";

export const ChatBottomSection = ({ conversationId, setSelectedFile, setTemplates, newConversationPhone }: { conversationId: number, setSelectedFile: Function, setTemplates: Function, newConversationPhone?: string }) => {
    const [messageToSend, setMessageToSend] = useState<string>("")
    const [audio, setAudio] = useState<Blob | null>(null)
    // @ts-ignore
    const { sendMessage, isLoading } = useMessage()
    // @ts-ignore
    const { userState } = useUser()
    // @ts-ignore
    const { setActiveConversation } = useActiveConversation()
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);

    const handleSendMessage = async (type: string, data: any, resetData: Function) => {
        if (conversationId === -1) {
            const dataToSend = await dataMessageToSend({ data, type })

            createConversation({ to: newConversationPhone, messageData: dataToSend, company_phone_id: phoneId }, userState.token)
                .then((res) => {
                    const { contact, id } = res
                    setActiveConversation({ contact, id, tags: [] })
                })
        } else {
            sendMessage({ type, data, conversationId }).finally(() => resetData())
        }
    }

    return (
        <div className="p-5 flex items-center border-t border-slate-200/60 dark:border-darkmode-400 transition-opacity duration-300">
            <MediaDropdown setSelectedFile={setSelectedFile} setTemplates={setTemplates} />

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
                            onClick={() => handleSendMessage("audio", audio, () => setAudio(null))}
                        >
                            <IconSend classes="w-8 h-8 text-slate-100 ease-in duration-100" />
                        </button>
                    </div>
                </div>
            ) : (
                <InputSendMessage handleSendMessage={handleSendMessage} setMessageToSend={setMessageToSend} messageToSend={messageToSend} />
            )}

            {!audio ?
                messageToSend === "" && !isLoading ?
                    <AudioRecorder audio={audio} setAudio={setAudio} /> :
                    <button
                        className="w-12 h-12 bg-slate-100 hover:bg-teal-600 text-white rounded-full flex items-center justify-center group ease-in duration-100"
                        onClick={() => handleSendMessage("text", messageToSend, () => setMessageToSend(""))}
                    >
                        {isLoading ?
                            <Spinner aria-label="Default status example" /> :
                            <IconSend classes="w-8 h-8 text-teal-600 group-hover:text-slate-100 ease-in duration-100" />
                        }
                    </button> :
                null
            }
        </div>
    )
}