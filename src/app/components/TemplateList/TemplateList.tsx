import React from "react"
import { Template } from "@/app/interfaces/template"
import { useState } from "react"
import { IconChevron } from "../Icons/IconChevron"
import { TemplateDetail } from "./TemplateDetail/TemplateDetail"
import { PreviewActions } from "../ConversationPreview/PreviewActions"

export const TemplateList = ({ templates, handleSendMessage, isLoading, setShowPreview }: { templates: any[], handleSendMessage: Function, isLoading: boolean, setShowPreview: Function }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template>()
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
        setShowPreview(false)
    }

    return (
        <>
            <div className="bg-slate-100 rounded border border-slate-300 w-2/3 p-8 overflow-auto">
                {!selectedTemplate && templates.map((template, index) => (
                    <div key={`template-${index}`}>
                        <h1 className="text-sky-800 font-bold mb-4">{template.category}</h1>

                        <ul className="mb-4">
                            {template.data.map((t: any, index: number) => (
                                <li
                                    key={index}
                                    className="p-2 m-2 bg-slate-200 rounded text-slate-500 flex justify-between cursor-pointer"
                                    onClick={() => setSelectedTemplate(t)}
                                >
                                    {t.name}
                                    <IconChevron classes="w-6 h-6 bg-slate-300 rounded-full" />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {selectedTemplate && (
                    <TemplateDetail template={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setIsReadyToSend={setIsReadyToSend} setTemplateToSend={setTemplateToSend} />
                )}
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={isReadyToSend} />
        </>
    )
}