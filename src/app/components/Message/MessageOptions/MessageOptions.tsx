import { useEffect, useRef, useState } from "react"
import { IconEllipsisVertical } from "../../Icons/IconEllipsisVertical"
import { Message } from "@/app/interfaces/conversations";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply"
import React from "react";

const MessageOptions = ({ message }: { message: Message }) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { setActiveMessageReply } = useActiveMessageReply();

    const handleOpenDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    const handleReply = () => {
        setActiveMessageReply(message)
    }

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
                <IconEllipsisVertical classes="w-6 h-6 text-teal-600" />
            </button>

            {showDropdown &&
                <ul
                    className="w-44 absolute top-0 right-0 mt-8 bg-slate-100 shadow z-10 rounded"
                >
                    <li
                        className="my-2 p-3 hover:bg-slate-200 cursor-pointer"
                        onClick={handleReply}
                    >
                        <label htmlFor="file-input" id="file-label-2" className="text-sm flex justify-start items-center gap-2 cursor-pointer">
                            Responder
                        </label>
                    </li>
                </ul>
            }
        </div>
    )
}

export const MemoizedMessageOptions = React.memo(MessageOptions);
MessageOptions.displayName = 'MessageOptions';

