import { TemplateList } from "../TemplateList/TemplateList"
import { Preview } from "./Preview"
import { useMessage } from "../../hooks/useMessage";
import { dataMessageToSend } from "@/app/utils/messages";
import { createConversation } from "@/app/services/api";
import useUser from "@/app/hooks/useUser";
import useActiveConversation from "../../hooks/useActiveConversation";
import { usePathname } from "next/navigation";
import { MessageDataToSend } from "@/app/interfaces/conversations";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply";
import { Template } from "@/app/interfaces/template";

export const ConversationPreview = ({
    selectedFile,
    template,
    conversationId,
    handleClosePreview,
    newConversationPhone
}: { selectedFile?: File | null, template?: Template | undefined, conversationId: number, handleClosePreview: Function, newConversationPhone?: string }) => {
    const { sendMessage, isLoading, setIsLoading } = useMessage()
    const { userState } = useUser()
    // @ts-ignore
    const { setActiveConversation } = useActiveConversation()
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);
    const { activeMessageReply } = useActiveMessageReply();

    const handleSendMessage = async (type: string, data: any) => {
        try {
            if (conversationId === -1) { //temporary conversation
                const dataToSend = await dataMessageToSend({ data, type })
                setIsLoading(true)

                await createConversation({ to: newConversationPhone, messageData: dataToSend, company_phone_id: phoneId }, userState.token)
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
            {selectedFile ?
                <Preview
                    file={selectedFile}
                    handleSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    handleClosePreview={handleClosePreview}
                /> :
                <TemplateList template={template} handleSendMessage={handleSendMessage} isLoading={isLoading} handleClosePreview={handleClosePreview} />
            }
        </div>
    )
}