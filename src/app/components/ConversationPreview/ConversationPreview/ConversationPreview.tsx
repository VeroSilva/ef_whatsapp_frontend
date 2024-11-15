import { PreviewTemplate } from "./Previews/PreviewTemplate"
import { PreviewFile } from "./Previews/PreviewFile"
import { useMessage } from "../../../hooks/useMessage";
import { dataMessageToSend } from "@/app/utils/messages";
import { createConversation } from "@/app/services/api";
import useUser from "@/app/hooks/useUser";
import useActiveConversation from "../../../hooks/useActiveConversation";
import { MessageDataToSend } from "@/app/interfaces/conversations";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply";
import { Template } from "@/app/interfaces/template";
import { PreviewInteractive } from "./Previews/PreviewInteractive";
import useActivePhone from "@/app//hooks/useActivePhone";

export const ConversationPreview = ({
    selectedFile,
    template,
    conversationId,
    handleClosePreview,
    newConversationPhone,
    type
}: { selectedFile?: File | null, template?: Template | undefined, conversationId: number, handleClosePreview: Function, newConversationPhone?: string, type: string }) => {
    const { sendMessage, isLoading, setIsLoading } = useMessage()
    const { userState } = useUser()
    // @ts-ignore
    const { setActiveConversation } = useActiveConversation()
    const { activeMessageReply } = useActiveMessageReply();
    const { activePhone } = useActivePhone();

    const handleSendMessage = async (type: string, data: any) => {
        try {
            if (conversationId === -1) { //temporary conversation
                const dataToSend = await dataMessageToSend({ data, type })
                setIsLoading(true)

                await createConversation({ to: newConversationPhone, messageData: dataToSend, company_phone_id: activePhone }, userState.token)
                    .then((res) => {
                        const { contact, id } = res

                        setIsLoading(false)
                        setActiveConversation({ contact, id, tags: [] })
                    })
            } else {
                const messageData: MessageDataToSend = {
                    type,
                    data,
                    conversationId
                }

                if (activeMessageReply.id !== 0) messageData["context"] = { message_id: activeMessageReply.message.id_whatsapp }

                await sendMessage(messageData);
            }
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        } finally {
            handleClosePreview()
        }
    }

    return (
        <div className="w-full p-8 absolute left-0 top-0 h-full flex flex-col items-center justify-center z-10 bg-gradient-to-b from-slate-800 to-gray-900">
            {type === "file" ?
                <PreviewFile
                    file={selectedFile}
                    handleSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    handleClosePreview={handleClosePreview}
                />
                : type === "template" ?
                    <PreviewTemplate template={template} handleSendMessage={handleSendMessage} isLoading={isLoading} handleClosePreview={handleClosePreview} />
                    : type === "interactive" ?
                        <PreviewInteractive handleSendMessage={handleSendMessage} isLoading={isLoading} handleClosePreview={handleClosePreview} />
                        : null
            }
        </div>
    )
}