import { IconX } from "../Icons/IconX";
import { Spinner } from "flowbite-react";
import { IconSend } from "../Icons/IconSend";

export const PreviewActions = ({ handleAccept, handleCancel, isLoading, isReadyToSend }: { handleAccept: Function, handleCancel: Function, isLoading: boolean, isReadyToSend: boolean }) => {
    return (
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
                className={
                    `w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center ease-in duration-100 p-1 
                    ${!isReadyToSend ? "opacity-50" : ""}`
                }
                disabled={!isReadyToSend || isLoading}
                onClick={() => handleAccept()}
            >
                {isLoading ?
                    <Spinner aria-label="Default status example" /> :
                    <IconSend classes="w-8 h-8 text-slate-100 ease-in duration-100" />
                }
            </button>
        </div>
    )
}