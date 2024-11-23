import { useEffect, useRef, useState } from "react"
import { IconEllipsisVertical } from "../../Icons/IconEllipsisVertical"
import { IconTag } from "../../Icons/IconTag";
import { Modal } from "@/app/components/Modal/Modal";
import { FormField, Tag } from "@/app/interfaces/conversations";
import useActiveConversation from "@/app/hooks/useActiveConversation";
import { addTagToConversation, assignUserToConversation, deleteConversation, removeTagToConversation } from "@/app/services/api";
import useUser from "@/app/hooks/useUser"
import { IconDoubleCheck } from "../../Icons/IconDoubleCheck";
import { IconTrash } from "../../Icons/IconTrash";
import { markAsUnread } from '@/app/services/api';
import { IconLoading } from "../../Icons/IconLoading";
import useChatsRead from "@/app/hooks/useChatsRead";
import useTag from "@/app/hooks/useTags";
import { ColourOption, SelectTags } from "../../Selects/SelectTags/SelectTags";
import { FormInfoTag } from "../../FormTag/FormInfoTag";
import { IconCheckCircle } from "../../Icons/IconCheckCircle";
import { IconInfo } from "../../Icons/IconInfo";
import { IconUser } from "../../Icons/IconUser";
import { UsersListSelect } from "../ChatFilters/UsersListSelect/UsersListSelect";
import useUsersList from "@/app/hooks/useUsersList";

export const ChatOptions = () => {
    const { activeConversationState, resetActiveConversation } = useActiveConversation();
    const { setChatsRead } = useChatsRead()
    const { userState } = useUser();
    const { tagsState } = useTag();
    const { usersListState } = useUsersList();
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedTags, setSelectedTags] = useState<ColourOption[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const [loadingDeleteConversation, setLoadingDeleteConversation] = useState(false);
    const [selectedTagId, setSelectedTagId] = useState(0);
    const [tagFormFields, setTagFormFields] = useState<FormField[]>([]);
    const [isSavingTagInfo, setIsSavingTagInfo] = useState<boolean>(false);
    const [showAssignUserModal, setShowAssignUserModal] = useState<boolean>(false);
    const [options, setOptions] = useState<any>([]);
    const [selectedUsersOption, setSelectedUsersOption] = useState<any>([]);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOpenDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleOpenTagsModal = () => {
        setShowModal(!showModal)
    }

    const handleMarkAsUnread = () => {
        resetActiveConversation();
        markAsUnread(userState.token, activeConversationState.id);

        setChatsRead((prevChatsRead: number[]) => {
            const isChatRead = prevChatsRead.includes(activeConversationState.id);

            if (isChatRead) {
                const filteredChatsRead = prevChatsRead.filter((chat) => chat !== activeConversationState.id);
                return filteredChatsRead;
            }

            return prevChatsRead;
        });
    }

    const handleDeleteConversation = () => {
        setLoadingDeleteConversation(true)

        deleteConversation(activeConversationState.id, userState.token)
            .then((res) => {
                resetActiveConversation()
                setLoadingDeleteConversation(false)
                setShowDeleteModal(false)
            });
    }

    const handleOpenDeleteModal = (show: boolean) => {
        setShowDeleteModal(show);
    };

    const handleOpenTagsInfoModal = () => {
        setShowInfoModal(!showInfoModal)
    }

    const handleOpenAssignUserModal = () => {
        setShowAssignUserModal(!showAssignUserModal)
    }

    const handleSelectChange = (options: ColourOption[]) => {
        const toDelete = selectedTags.filter(item1 => 
            !options.some(item2 => item2.value === item1.value)
        );

        const toAdd = options.filter(item2 => 
            !selectedTags.some(item1 => item1.value === item2.value)
        );

        setSelectedTags(options);

        if (!!toAdd.length) {
            const addItem = toAdd[0];
            const selectedItem: any = tagsState.filter((tag) => tag.id === addItem.value)[0];

            if (selectedItem.hasNestedForm) {
                setSelectedTagId(selectedItem.id);
                setTagFormFields(selectedItem.fields);
                handleOpenTagsInfoModal();
            } else {
                addTagToConversation(activeConversationState.id, selectedItem.id, userState.token)
            }
        }

        if (!!toDelete.length) {
            const deleteItem = toDelete[0];
            const selectedItem: any = tagsState.filter((tag) => tag.id === deleteItem.value)[0];

            removeTagToConversation(activeConversationState.id, selectedItem.id, userState.token)
        }
    };

    const handleSelectUsersChange = (option: any) => {
        setSelectedUsersOption(option);

        assignUserToConversation(activeConversationState.id, option.value, userState.token)
            .then((res) => handleOpenAssignUserModal());
    };

    const handleUnselectTagForm = () => {
        setSelectedTags((prevState) => {
            const filter = prevState.filter((item) => item.value !== selectedTagId);

            return filter
        });
    }

    const handleSaveTagInfo = () => {
        setIsSavingTagInfo(true);

        addTagToConversation(activeConversationState.id, selectedTagId, userState.token, tagFormFields)
            .then(({ status, data }) => {
                setIsSavingTagInfo(false);
                handleOpenTagsInfoModal();
                handleOpenTagsModal();

                if (status === 200 || status === 201) {
                    setAlert({
                        type: "success",
                        message: "Etiqueta asignada con éxito",
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

    const isTagFormValid = () => {
        return tagFormFields.every(item => item.hasOwnProperty('value') && item.value !== "")
    }

    useEffect(() => {
        const options: ColourOption[] = activeConversationState.tags.map(tag => ({value: tag.id, label: tag.name, color: tag.color}));

        setSelectedTags(options)
    }, [activeConversationState.tags])

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    useEffect(() => {
        if (usersListState && usersListState.length > 0) {
            const userOptions = usersListState.map((user: any) => ({
                value: user.id,
                label: user.username,
                color: "#075985",
            }));
            setOptions(userOptions);
        }
    }, [usersListState]);

    useEffect(() => {
        if (options.length > 0 && activeConversationState.user_assigned_id) {
            const current = options.find(
                (opt: any) => opt.value === activeConversationState.user_assigned_id
            );

            setSelectedUsersOption(current || null);
        }
    }, [activeConversationState.user_assigned_id, options]);

    return (
        <div
            className="relative"
            ref={dropdownRef}
        >
            <button onClick={handleOpenDropdown}>
                <IconEllipsisVertical classes="w-8 h-8 text-teal-600" />
            </button>

            {showDropdown &&
                <ul
                    className="w-60 absolute top-0 right-0 mt-8 bg-slate-100 shadow z-10 rounded"
                >
                    <li
                        className="my-2 p-3 hover:bg-slate-200 cursor-pointer"
                        onClick={handleOpenTagsModal}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-center items-center gap-2 cursor-pointer">
                            Administrar etiquetas
                            <IconTag classes="w-5 h-5 text-slate-500" />
                        </label>
                    </li>

                    <li
                        className="my-2 p-3 hover:bg-slate-200 cursor-pointer"
                        onClick={handleMarkAsUnread}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-center items-center gap-2 cursor-pointer">
                            Marcar como no leída
                            <IconDoubleCheck classes="w-5 h-5 text-slate-500" />
                        </label>
                    </li>

                    {userState.role == "1" && <li
                        className="my-2 p-3 hover:bg-slate-200 cursor-pointer"
                        onClick={() => handleOpenDeleteModal(true)}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-center items-center gap-2 cursor-pointer">
                            Eliminar conversación
                            <IconTrash classes="w-5 h-5 text-slate-500" />
                        </label>
                    </li>}

                    {userState.role == "1" && <li
                        className="my-2 p-3 hover:bg-slate-200 cursor-pointer"
                        onClick={handleOpenAssignUserModal}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-center items-center gap-2 cursor-pointer">
                            Asignar usuario
                            <IconUser classes="w-5 h-5 text-slate-500" />
                        </label>
                    </li>}
                </ul>
            }

            <Modal
                title="Gestiona las etiquetas de este chat"
                onClose={handleOpenTagsModal}
                show={showModal}
                width="500px"
                height="500px"
            >
                <SelectTags handleChange={handleSelectChange} selectedOptions={selectedTags} isMulti />
            </Modal>

            {/* END: Delete Conversation Modal */}
            <Modal
                // title="Eliminar usuario usuario"
                onClose={() => handleOpenDeleteModal(false)}
                show={showDeleteModal}
                width="500px"
            >
                <div className="text-xl mt-5">Estás seguro?</div>
                <div className="text-slate-500 mt-2">
                    Quieres eliminar la conversación de: <strong>{activeConversationState.contact.name} - {activeConversationState.contact.phone}</strong>?{" "}
                    <br />
                    Esta acción es irreversible.
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="second-button mb-8"
                        onClick={() => handleOpenDeleteModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-800 text-white rounded-md text-sm px-4 py-2 mb-8 transition ease-in-out delay-50 flex"
                        onClick={handleDeleteConversation}
                    >
                        {loadingDeleteConversation && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                        Sí, eliminar
                    </button>
                </div>
            </Modal >
            {/* END: Delete Conversation Modal */}

            {/* START: Add info tag */}
            <Modal
                title="Agregar información de etiqueta"
                onClose={() => {
                    handleOpenTagsInfoModal();
                    handleUnselectTagForm();
                }}
                show={showInfoModal}
                width="500px"
            >
                <>
                    <FormInfoTag tagFormFields={tagFormFields} setTagFormFields={setTagFormFields} />

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            className="second-button"
                            onClick={() => {
                                handleOpenTagsInfoModal();
                                handleUnselectTagForm();
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleSaveTagInfo}
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

            <Modal
                title="Asignar usuario"
                onClose={handleOpenAssignUserModal}
                show={showAssignUserModal}
                width="500px"
                height="500px"
            >
                <UsersListSelect handleChange={handleSelectUsersChange} selectedOptions={selectedUsersOption} options={options} />
            </Modal>

            <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 right-0 flex items-center transition transition-opacity duration-500 w-[200px] ${alert.show ? "opacity-1" : "opacity-0"} ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                {alert.type === "success" ?
                    <span><IconCheckCircle classes="w-6 h-6 mr-2" /></span> :
                    <span><IconInfo classes="w-6 h-6 mr-2" /></span>
                }
                <span>{alert.message}</span>
            </div>
        </div>
    )
}