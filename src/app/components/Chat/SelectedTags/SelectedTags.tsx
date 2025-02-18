import { isColorDark } from "@/app/utils/functions";
import { IconInfo } from "../../Icons/IconInfo";
import { Modal } from "../../Modal/Modal";
import { useState, useEffect } from "react";
import { IconPlus } from "../../Icons/IconPlus";
import { IconCheckCircle } from "../../Icons/IconCheckCircle";
import { FormField, Tag } from "@/app/interfaces/conversations";
import { FormInfoTag } from "../../FormTag/FormInfoTag";
import { addTagToConversation } from "@/app/services/api";
import useActiveConversation from "@/app/hooks/useActiveConversation";
import useUser from "@/app/hooks/useUser";
import useTag from "@/app/hooks/useTags";
import { IconLoading } from "../../Icons/IconLoading";
import React from "react";

export const SelectedTags = ({ tags, isInChat }: { tags: any, isInChat?: boolean }) => {
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const [showInfoModalDetails, setShowInfoModalDetails] = useState<boolean>(false);
    const [currentTag, setCurrentTag] = useState<Tag>();
    const [tagFormFields, setTagFormFields] = useState<FormField[]>([]);
    const [isSavingTagInfo, setIsSavingTagInfo] = useState<boolean>(false);
    const { activeConversationState } = useActiveConversation();
    const { userState } = useUser()
    const { tagsState } = useTag();
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({
                    type: alert.type,
                    message: alert.message,
                    show: false
                })
            }, 3000);
        }
    }, [alert])

    const selectedItem: any = tagsState.filter((tag) => tag.id === currentTag?.id)[0];

    const handleOpenInfoModal = (show: boolean) => {
        setShowInfoModal(show);
    };

    const handleShowTagInfo = (data: any) => {
        handleOpenInfoModal(true);
        setCurrentTag(data)
    }

    const handleOpenTagsInfoModal = () => {
        setShowInfoModal(!showInfoModal)
    }

    const handleOpenTagsInfoDetailsModal = (show: boolean) => {
        setShowInfoModalDetails(show)
    }

    const isTagFormValid = () => {
        return tagFormFields.every(item => item.hasOwnProperty('value') && item.value !== "")
    }

    const handleSaveTagInfo = () => {
        setIsSavingTagInfo(true);

        const combinedFields = [...(currentTag?.fields || []), ...tagFormFields];

        addTagToConversation(activeConversationState.id, currentTag?.id, userState.token, combinedFields)
            .then(({ status, data }) => {
                setIsSavingTagInfo(false);
                handleOpenTagsInfoModal();
                handleOpenTagsInfoDetailsModal(false);

                if (status === 200 || status === 201) {
                    setAlert({
                        type: "success",
                        message: "Información agregada con éxito",
                        show: true
                    })
                } else {
                    setAlert({
                        type: "error",
                        message: "Ocurrió un error",
                        show: true
                    })
                }
            });
    }

    const handleConfirmSaveTagInfo = () => {
        setShowConfirmModal(true);
    };

    const handleCancelSaveTagInfo = () => {
        setShowConfirmModal(false);
    };

    const handleConfirmSaveTagInfoAction = () => {
        setShowConfirmModal(false);
        handleSaveTagInfo();
    };

    return (
        <>
            {tags.map((tag: any) => (
                <span
                    key={`tag-${tag.id}`}
                    style={{ backgroundColor: tag.color }}
                    className={`rounded-sm px-1 ${isInChat ? "text-[14px]" : "text-[12px]"} ${tag.hasNestedForm ? "cursor-pointer" : "cursor-default"} flex gap-1 items-center ${isColorDark(tag.color) ? "text-slate-200" : "text-gray-800"}`}
                    onClick={() => {
                        if (tag.hasNestedForm && tag.fields) handleShowTagInfo(tag)
                    }}
                >
                    {tag.name}
                    {(isInChat && tag.hasNestedForm && tag.fields) ?
                        <span key={`tag-span-${tag.id}`}><IconInfo classes={`w-5 h-5 ${isColorDark(tag.color) ? "text-slate-200" : "text-gray-800"}`} /></span>
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
                <div key={`tag-id-${currentTag?.id}`}>
                    <div className="flex items-center mb-2 gap-2">
                        <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Descripción: </span>
                        <span className="text-sm">{currentTag?.description}</span>
                    </div>
                    <hr className="my-4 border-t border-gray-300" />

                    {currentTag?.isMultiple && (
                        <>
                            <button type="button" className="flex gap-2 text-xs rounded-xl bg-slate-100 p-2 cursor-pointer" onClick={() => {
                                setTagFormFields(selectedItem.fields);
                                handleOpenTagsInfoDetailsModal(true)
                            }}>
                                <IconPlus classes="w-4 h-4" />
                                Aumentar información
                            </button>
                            <hr className="my-4 border-t border-gray-300" />

                        </>
                    )}

                    {currentTag?.fields.map((field, index) => (
                        <React.Fragment key={`field-${index}`}>
                            <div className="flex items-center mb-2 gap-2">
                                <span className="block uppercase tracking-wide text-gray-700 text-xs font-bold">{field?.name}: </span>
                                <span className="text-sm">{field?.value}</span>
                            </div>
                            {(index + 1) % selectedItem.fields.length === 0 && index !== currentTag?.fields.length - 1 && (
                                <hr key={`idx-hr-${index}`} className="my-4 border-t border-gray-300" />
                            )}
                        </React.Fragment>
                    ))}

                </div>
            </Modal>

            {/* START: Add info tag */}
            <Modal
                title="Agregar información de etiqueta"
                onClose={() => {
                    handleOpenTagsInfoDetailsModal(false);
                }}
                show={showInfoModalDetails}
                width="500px"
            >
                <>
                    <FormInfoTag tagFormFields={tagFormFields} setTagFormFields={setTagFormFields} />

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="second-button"
                            onClick={() => {
                                handleOpenTagsInfoDetailsModal(false);
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleConfirmSaveTagInfo}
                            className={
                                "main-button transition ease-in-out delay-50 flex " +
                                (!isTagFormValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
                            }
                            disabled={!isTagFormValid()}
                        >
                            {isSavingTagInfo && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                            Guardar
                        </button>
                    </div>
                </>
            </Modal>
            {/* END: Add info tag */}
            <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 left-0 flex items-center transition transition-opacity duration-500 w-[200px] ${alert.show ? "opacity-1" : "opacity-0"} ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                {alert.type === "success" ?
                    <span><IconCheckCircle classes="w-6 h-6 mr-2" /></span> :
                    <span><IconInfo classes="w-6 h-6 mr-2" /></span>
                }
                <span>{alert.message}</span>
            </div>

            <Modal
                title="Confirmar Guardado"
                onClose={handleCancelSaveTagInfo}
                show={showConfirmModal}
                width="400px"
            >
                <div className="p-4">
                    <p>¿Estás seguro de que deseas guardar esta información?</p>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="second-button"
                            onClick={handleCancelSaveTagInfo}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmSaveTagInfoAction}
                            className="main-button"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

