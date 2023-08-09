import { TemplateList } from "../TemplateList/TemplateList"
import { Preview } from "./Preview"
import { useMessage } from "../../hooks/useMessage";
import { dataMessageToSend } from "@/app/utils/messages";
import { createConversation } from "@/app/services/api";
import useUser from "@/app/hooks/useUser";
import useActiveConversation from "../../hooks/useActiveConversation";
import { usePathname } from "next/navigation";

export const ConversationPreview = ({
    selectedFile,
    classifiedTemplates,
    conversationId,
    setShowPreview,
    newConversationPhone
}: { selectedFile: File | null, classifiedTemplates: any[], conversationId: number, setShowPreview: Function, newConversationPhone?: string }) => {
    const { sendMessage, isLoading, setIsLoading } = useMessage()
    const { userState } = useUser()
    // @ts-ignore
    const { setActiveConversation } = useActiveConversation()
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);

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
                await sendMessage({ type, data, conversationId });
            }
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        } finally {
            setShowPreview(false)
        }
    }

    return (
        <div className="w-full p-8 absolute top-0 h-full flex flex-col items-center justify-center z-10 bg-gradient-to-b from-slate-800 to-gray-900">
            {selectedFile ?
                <Preview
                    file={selectedFile}
                    handleSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    setShowPreview={setShowPreview}
                /> :
                <TemplateList templates={classifiedTemplates} handleSendMessage={handleSendMessage} isLoading={isLoading} setShowPreview={setShowPreview} />
            }
        </div>
    )
}