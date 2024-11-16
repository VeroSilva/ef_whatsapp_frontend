import { useState } from "react";
import { IconLink } from "../Icons/IconLink"
import { IconLoading } from "../Icons/IconLoading";
import { editTemplate } from "@/app/services/api";
import useUser from "@/app/hooks/useUser";

export const FormAdminTemplate = ({data, handleOpenModal, setAlert, handleLoadTemplates} : {data: any, handleOpenModal: Function, setAlert: Function, handleLoadTemplates: Function}) => {
    const { userState } = useUser();
    const existingLink = data.components.filter((item: any) => item.type === "HEADER")[0].header_link;
    const [link, setLink] = useState(existingLink)
    const [isLoading, setIsLoading] = useState(false);

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value)  
    }

    const handleEditLink = () => {
        setIsLoading(true);

        editTemplate(userState.token, data.id, link).then(({ status, data }) => {
            setIsLoading(false);
            handleOpenModal(false);

            setAlert({
                type: status === 200 ? "success" : "error",
                message: data.message,
                show: true
            })

            if (status === 200) handleLoadTemplates();
        })
    }

    const dataIsValid = () => {
        if (
            link === ""
        ) return false;
        else return true;
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconLink classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>

                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Header link"
                    value={link}
                    onChange={handleLinkChange}
                />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button"
                    onClick={() => handleOpenModal(false)}
                >
                    Cancelar
                </button>

                <button
                    onClick={handleEditLink}
                    className={
                        "main-button transition ease-in-out delay-50 flex " +
                        (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
                    }
                    disabled={!dataIsValid()}
                >
                    {isLoading && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                    Editar link
                </button>
            </div>
        </div>
    )
}