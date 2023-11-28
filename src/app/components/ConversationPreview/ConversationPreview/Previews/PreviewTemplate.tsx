import React, { useEffect } from "react"
import { Template } from "@/app/interfaces/template"
import { useState } from "react"
import { TemplateDetail } from "../../../TemplateList/TemplateDetail/TemplateDetail"
import { PreviewActions } from "../../PreviewActions"

export const PreviewTemplate = ({ template, handleSendMessage, isLoading, handleClosePreview }: { template: Template | undefined, handleSendMessage: Function, isLoading: boolean, handleClosePreview: Function }) => {
    const [isReadyToSend, setIsReadyToSend] = useState(false)
    const [templateToSend, setTemplateToSend] = useState<any>({
        name: "",
        id: 0,
        language: {
            code: ""
        },
        components: []
    })

    const handleAccept = () => {
        handleSendMessage("template", templateToSend)
    }

    const handleCancel = () => {
        handleClosePreview()
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAccept();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [templateToSend]);

    return (
        <>
            <div className="bg-slate-100 rounded border border-slate-300 w-full p-8 overflow-auto">
                {template && (
                    <TemplateDetail template={template} setIsReadyToSend={setIsReadyToSend} setTemplateToSend={setTemplateToSend} />
                )}
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={isReadyToSend} />
        </>
    )
}