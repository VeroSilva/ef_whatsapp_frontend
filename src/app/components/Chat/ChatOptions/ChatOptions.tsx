import { useEffect, useRef, useState } from "react"
import { IconEllipsisVertical } from "../../Icons/IconEllipsisVertical"
import { IconTag } from "../../Icons/IconTag";
import { Modal } from "@/app/components/Modal/Modal";
import { Tag } from "@/app/interfaces/conversations";
import useActiveConversation from "@/app/hooks/useActiveConversation";
//@ts-ignore
import chroma from 'chroma-js';
import { addTagToConversation, getTags, removeTagToConversation } from "@/app/services/api";
import useUser from "@/app/hooks/useUser"
import { IconX } from "../../Icons/IconX";

export const ChatOptions = () => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null);
    //@ts-ignore
    const { activeConversationState } = useActiveConversation();
    const { userState } = useUser();

    const handleOpenDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleOpenModal = () => {
        setShowModal(!showModal)
    }

    const addTag = (tag: Tag) => {
        const itemExists = selectedTags.some((item) => item.id === tag.id);
        if (!itemExists) {
            setSelectedTags((prevOptions: Tag[]): Tag[] => [...prevOptions, tag])
        }

        addTagToConversation(activeConversationState.id, tag.id, userState.token)
    }

    const removeTag = (id: number) => {
        const updatedOptions = selectedTags.filter((item) => item.id !== id);
        setSelectedTags(updatedOptions);

        removeTagToConversation(activeConversationState.id, id, userState.token)
    }

    useEffect(() => {
        getTags(userState.token).then((res => {
            setTags(res)
        }))
    }, [])

    useEffect(() => {
        setSelectedTags(activeConversationState.tags)
    }, [activeConversationState.tags])


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
                        onClick={handleOpenModal}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-end items-center gap-2 cursor-pointer">
                            Administrar etiquetas
                            <IconTag classes="w-6 h-6 text-teal-800" />
                        </label>
                    </li>
                </ul>
            }

            <Modal
                title="Gestiona las etiquetas de este chat"
                onClose={handleOpenModal}
                show={showModal}
                width="500px"
            >
                <h3 className="my-3 text-start font-semibold text-gray-800">Etiquetas seleccionadas:</h3>

                {selectedTags.length > 0 &&
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedTags.map((tag) => {
                            const color = chroma(tag.color);
                            const background = color.alpha(0.2).css()

                            return (
                                <span
                                    key={`tag-${tag.id}`}
                                    style={{ backgroundColor: background, border: `1px solid ${tag.color}` }}
                                    className="rounded-full px-2 py-1 text-sm font-bold text-gray-800 text-gray-700 flex items-center"
                                >
                                    {tag.name}
                                    <button
                                        className="rounded-full"
                                        onClick={() => removeTag(tag.id)}
                                    >
                                        <IconX classes="w-6 h-6 ms-1 text-gray-800" />
                                    </button>
                                </span>
                            )
                        })}
                    </div>
                }

                <h3 className="my-3 text-start font-semibold text-gray-800">Selecciona etiquetas:</h3>

                {tags.length > 0 &&
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                            const color = chroma(tag.color);
                            const background = color.alpha(0.2).css()

                            return (
                                <span
                                    key={`tag-${tag.id}`}
                                    style={{ backgroundColor: background, border: `1px solid ${tag.color}` }}
                                    className={`rounded-full px-2 py-1 text-xs font-bold text-gray-800 text-gray-700 cursor-pointer`}
                                    onClick={() => addTag(tag)}
                                >
                                    {tag.name}
                                </span>
                            )
                        })}
                    </div>
                }
            </Modal>
        </div>
    )
}