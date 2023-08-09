import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IconDocument } from "../../Icons/IconDocument";
import { IconImage } from "../../Icons/IconImage";
import { IconPaperClip } from "../../Icons/IconPaperClip";
import { IconTemplates } from "../../Icons/IconTemplates";
import { getTemplates } from "@/app/services/api";
import useUser from "../../../hooks/useUser";

export const MediaDropdown = ({ setSelectedFile, setTemplates }: { setSelectedFile: Function, setTemplates: Function }) => {
    const imageInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [showImageSpan, setShowImageSpan] = useState<boolean>(false)
    const [showDocumentSpan, setShowDocumentSpan] = useState<boolean>(false)
    const [showTemplatesSpan, setShowTemplatesSpan] = useState<boolean>(false)
    const { userState } = useUser()

    const handleImageIconClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click()
        }
    };

    const handleFileIconClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setSelectedFile(file)
            setShowDropdown(false)
        }
    };

    const handleClickTemplates = () => {
        getTemplates(userState.token).then((res) => setTemplates(res.templates))
    }

    const handleOpenDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleImageIconHover = () => {
        setShowImageSpan(true);
    };

    const handleImageIconLeave = () => {
        setShowImageSpan(false);
    };

    const handleFileIconHover = () => {
        setShowDocumentSpan(true);
    };

    const handleFileIconLeave = () => {
        setShowDocumentSpan(false);
    };

    const handleTemplatesIconHover = () => {
        setShowTemplatesSpan(true);
    };

    const handleTemplatesIconLeave = () => {
        setShowTemplatesSpan(false);
    };

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
                <IconPaperClip classes="w-8 h-8 text-teal-600" />
            </button>

            {showDropdown &&
                <ul
                    className="absolute bottom-0 mb-14"
                >
                    <li className="my-2">
                        <label htmlFor="file-input" id="file-label-2" className="flex">
                            <button
                                className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow p-2 cursor-pointer"
                                onMouseEnter={handleTemplatesIconHover}
                                onMouseLeave={handleTemplatesIconLeave}
                                onClick={handleClickTemplates}
                            >
                                <IconTemplates classes="w-8 h-8 text-slate-100" />
                            </button>

                            {showTemplatesSpan && (
                                <span className="flex items-center justify-center bg-slate-100 p-2 block rounded shadow float-left w-[150px] ml-3">
                                    Templates
                                </span>
                            )}
                        </label>
                    </li>

                    <li className="my-2">
                        <label htmlFor="file-input-image" id="file-label" className="flex">
                            <button
                                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-600 shadow-lg p-2 cursor-pointer"
                                onClick={handleImageIconClick}
                                onMouseEnter={handleImageIconHover}
                                onMouseLeave={handleImageIconLeave}
                            >
                                <IconImage classes="w-8 h-8 text-slate-100" />
                            </button>

                            {showImageSpan && (
                                <span className="flex items-center justify-center bg-slate-100 p-2 block rounded shadow-lg float-left w-[150px] ml-3">
                                    Imagen y vídeo
                                </span>
                            )}
                        </label>
                        <input
                            type="file"
                            id="file-input-image"
                            accept="image/jpeg, image/png, video/mp4, video/3gp"
                            style={{ display: "none" }}
                            ref={imageInputRef}
                            onChange={handleFileChange}
                        />
                    </li>

                    <li className="my-2">
                        <label htmlFor="file-input" id="file-label-2" className="flex">
                            <button
                                className="rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 shadow p-2 cursor-pointer"
                                onClick={handleFileIconClick}
                                onMouseEnter={handleFileIconHover}
                                onMouseLeave={handleFileIconLeave}
                            >
                                <IconDocument classes="w-8 h-8 text-slate-100" />
                            </button>

                            {showDocumentSpan && (
                                <span className="flex items-center justify-center bg-slate-100 p-2 block rounded shadow float-left w-[150px] ml-3">
                                    Documento
                                </span>
                            )}
                        </label>

                        <input
                            type="file"
                            id="file-input"
                            accept="image/jpeg, image/png, application/pdf, application/vnd.ms-powerpoint, application/vnd.ms-powerpoint, application/msword, application/msword, application/vnd.ms-excel, application/vnd.ms-excel, video/mp4, video/3gp, image/webp, audio/aac, audio/mp3, audio/mpeg, audio/amr, audio/ogg"
                            style={{ display: "none" }}
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </li>
                </ul>
            }
        </div>
    )
}