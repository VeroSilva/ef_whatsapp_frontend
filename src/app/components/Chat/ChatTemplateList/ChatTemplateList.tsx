import useActiveConversation from "@/app/hooks/useActiveConversation";
import { Template } from "@/app/interfaces/template";
import { useCallback, useEffect, useState } from "react";
import { ConversationPreview } from "../../ConversationPreview/ConversationPreview"

interface ChatTemplateListI {
    templatesList: Template[],
    activeTemplateList: boolean,
    setActiveTemplateList: (bool: boolean) => void,
    setMessageToSend: (str: string) => void
}

export const ChatTemplateList = ({ templatesList, activeTemplateList, setActiveTemplateList, setMessageToSend }: ChatTemplateListI) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);
    const [isHovered, setIsHovered] = useState<number | null>(0);
    const [showPreview, setShowPreview] = useState(false);
    const { activeConversationState } = useActiveConversation()

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'ArrowUp') {
                if (selectedIndex !== null && selectedIndex > 0) {
                    setSelectedIndex(selectedIndex - 1);
                }
            } else if (e.key === 'ArrowDown') {
                if (selectedIndex !== null && selectedIndex < templatesList.length - 1) {
                    setSelectedIndex(selectedIndex + 1);
                }
            } else if (e.key === 'Enter') {
                if (selectedIndex !== null) {
                    handleSelectTemplate(templatesList[selectedIndex])
                }
            }
        },
        [selectedIndex, templatesList]
    );

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    }

    const handleClosePreview = () => {
        setShowPreview(false);
        setActiveTemplateList(false);
        setMessageToSend("");
    }

    useEffect(() => {
        setIsHovered(selectedIndex);
    }, [selectedIndex]);

    useEffect(() => {
        if (activeTemplateList) {
            const listContainer = document.getElementById('template-list-container');
            if (listContainer) {
                listContainer.focus();
            }
        }
    }, [activeTemplateList]);

    return (
        <>
            <div
                id="template-list-container"
                className="w-full border border-slate-300 rounded p-4 my-4 overflow-y-auto max-h-60  focus:outline-none"
                tabIndex={0}
                onKeyDown={(e) => handleKeyPress(e)}
            >
                {templatesList.map((template, index) => (
                    <div
                        key={`template-${index}`}
                        className={`rounded p-3 cursor-pointer ${isHovered === index || selectedIndex === index ? 'bg-teal-100 text-teal-600 font-semibold transition duration-500 drop-shadow-md' : ''
                            } hover:bg-teal-100 hover:transition hover:duration-500`}
                        onMouseEnter={() => setIsHovered(index)}
                        onMouseLeave={() => setIsHovered(-1)}
                        onClick={() => handleSelectTemplate(template)}
                    >{template.name}</div>
                ))}
            </div>

            {showPreview &&
                <ConversationPreview template={selectedTemplate} conversationId={activeConversationState.id} handleClosePreview={handleClosePreview} newConversationPhone={activeConversationState.id === -1 ? activeConversationState.contact.phone : undefined} />
            }
        </>
    )
}