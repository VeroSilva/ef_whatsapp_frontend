import { isColorDark } from "@/app/utils/functions";
import { IconInfo } from "../../Icons/IconInfo";
import { Modal } from "../../Modal/Modal";
import { useState } from "react";
import { Tag } from "@/app/interfaces/conversations";

export const SelectedTags = ({ tags, isInChat }: { tags: any, isInChat?: boolean }) => {
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const [currentTag, setCurrentTag] = useState<Tag>();

    const handleOpenInfoModal = (show: boolean) => {
        setShowInfoModal(show);
    };

    const handleShowTagInfo = (data: any) => {
        handleOpenInfoModal(true);
        setCurrentTag(data)
    }

    return (
        <>
            {tags.map((tag: any) => (
                <span
                    key={`tag-${tag.id}`}
                    style={{ backgroundColor: tag.color }}
                    className={`rounded-full px-2 py-1 text-xs font-bold ${tag.hasNestedForm ? "cursor-pointer" : "cursor-default"} flex gap-1 items-center ${isColorDark(tag.color) ? "text-slate-200" : "text-gray-800"}`}
                    onClick={() => {
                        if (tag.hasNestedForm && tag.fields) handleShowTagInfo(tag)
                    }}
                >
                    {tag.name}
                    {(isInChat && tag.hasNestedForm && tag.fields) ?
                        <span><IconInfo classes={`w-5 h-5 ${isColorDark(tag.color) ? "text-slate-200" : "text-gray-800"}`} /></span>
                        : null
                    }
                </span>
            ))}

            <Modal
                title={`Información de la etiqueta <strong>${currentTag?.name}</strong>`}
                onClose={() => handleOpenInfoModal(false)}
                show={showInfoModal}
                width="500px"
            >
                <div>
                    <div className="flex items-center mb-2 gap-2">
                        <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Descripción: </span>
                        <span className="text-sm">{currentTag?.description}</span>
                    </div>

                    {currentTag?.fields.map((field, index) => (
                        <div className="flex items-center mb-2 gap-2" key={`idx-${index}`}>
                            <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold">{field?.name}: </span>
                            <span className="text-sm">{field?.value}</span>
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    )
}