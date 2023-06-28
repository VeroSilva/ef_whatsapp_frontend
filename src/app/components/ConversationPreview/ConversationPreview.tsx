import { useEffect, useState } from "react"
import { TemplateList } from "../TemplateList/TemplateList"
import { Preview } from "./Preview"
import { useMessage } from "../../hooks/useMessage";

export const ConversationPreview = ({
    selectedFile,
    classifiedTemplates,
    conversationId,
    setShowPreview
}: { selectedFile: File | null, classifiedTemplates: any[], conversationId: number, setShowPreview: Function }) => {
    const { sendMessage, isLoading } = useMessage()

    const handleSendMessage = async (type: string, data: any) => {
        try {
            await sendMessage({ type, data, conversationId });
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
        } finally {
            setShowPreview(false)
        }
    }

    return (
        <div className="w-full p-8 absolute top-0 h-full flex flex-col items-center z-10 bg-gradient-to-b from-slate-800 to-gray-900">
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