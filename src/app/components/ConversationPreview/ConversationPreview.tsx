import { Spinner } from "flowbite-react"
import { IconSend } from "../Icons/IconSend"
import { IconX } from "../Icons/IconX"
import { Preview } from "./Preview"

export const ConversationPreview = ({ selectedFile, handleAccept, handleCancel, isLoading }: { selectedFile: File, handleAccept: Function, handleCancel: Function, isLoading: boolean }) => {
    return (
        <div className="w-full p-8 absolute top-0 h-full flex flex-col items-center z-10 bg-gradient-to-b from-slate-800 to-gray-900">
            <Preview file={selectedFile} />

            <div className="btns-container flex justify-center p-4 gap-x-6">
                <button
                    className={
                        `w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center ease-in duration-100 p-1 
                        ${isLoading ? "opacity-50" : ""}
                        `
                    }
                    disabled={isLoading}
                    onClick={() => handleCancel()}
                >
                    <IconX classes="w-8 h-8 text-slate-100 ease-in duration-100" />
                </button>

                <button
                    className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center ease-in duration-100 p-1"
                    onClick={() => handleAccept()}
                >
                    {isLoading ?
                        <Spinner aria-label="Default status example" /> :
                        <IconSend classes="w-8 h-8 text-slate-100 ease-in duration-100" />
                    }
                </button>
            </div>
        </div>
    )
}