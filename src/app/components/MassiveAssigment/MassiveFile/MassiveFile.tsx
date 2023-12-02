import { ChangeEvent, useRef, useState } from "react";
import { SelectTags } from "../../Selects/SelectTags/SelectTags"
import { Option } from "@/app/interfaces/selects";
import { SelectPhones } from "../../Selects/SelectPhones/SelectPhones";
import { IconLoading } from "../../Icons/IconLoading";
import { IconCheck } from "../../Icons/IconCheck";
import { setMassiveTagsToConversations } from "@/app/services/api";
import useUser from "@/app/hooks/useUser";
import { getCsvData } from "@/app/utils/fileProcessing";

export const MassiveFile = ({ handleShowModal, setAlert }: { handleShowModal: Function, setAlert: Function }) => {
    const [tagToAssign, setTagToAssign] = useState(null);
    const [phone, setPhone] = useState(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loadingAssign, setLoadingAssing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [conversations, setConversations] = useState([]);
    const { userState } = useUser();
    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleSelectTagsChange = (option: any) => {
        setTagToAssign(option.value)
    };

    const handleSelectPhoneChange = (option: any) => {
        setPhone(option.value)
    };

    const handleFileClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click()
        }
    };

    const isDisabled = () => {
        if (
            tagToAssign &&
            phone &&
            !!conversations.length
        ) return false
        else return true
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setSelectedFile(file)

            const csvData = getCsvData(file)
            csvData.then((res: any) => {
                setConversations(res)
            })
        }
    };

    const handleAssign = () => {
        setLoadingAssing(true)

        const conversationsData = {
            phones: conversations
        }

        setMassiveTagsToConversations(
            tagToAssign,
            phone,
            userState.token,
            conversationsData
        )
            .then((res) => {
                setLoadingAssing(false)
                handleShowModal(false)
                setAlert({
                    type: "success",
                    message: "Etiquetas asignadas con éxito!",
                    show: true
                })
            }).catch((err) => {
                setAlert({
                    type: "error",
                    message: "Algo salió mal, vuelve a intentarlo",
                    show: true
                })

                console.log(err)
            })
    }

    return (
        <div className="w-full">
            <div className="flex flex-wrap -mx-3 my-6 items-center w-full">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                        <strong>*</strong> Teléfono origen
                    </label>
                    <SelectPhones handleChange={handleSelectPhoneChange} />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        <strong>*</strong> Selecciona tag a asignar
                    </label>
                    <SelectTags handleChange={handleSelectTagsChange} />
                </div>
            </div>

            <div className="flex flex-wrap -mx-3 my-6 items-center w-full">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                        <strong>*</strong> Selecciona archivo
                    </label>
                    <label htmlFor="file-input-image" id="file-label" className="flex">
                        <button
                            className="rounded-lg bg-slate-200 p-2 cursor-pointer w-full border border-slate-300 border-dashed border-2 border-sky-500"
                            onClick={handleFileClick}
                        >
                            {selectedFile ? selectedFile.name : "Elegir archivo"}
                        </button>
                    </label>
                    <input
                        type="file"
                        id="file-input-image"
                        accept=".csv"
                        style={{ display: "none" }}
                        ref={imageInputRef}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <small className="block">Los campos con * son obligatorios</small>

            <div className="border-t border-slate-200 w-full pt-4 mt-4 flex justify-center">
                <button
                    className={`w-[150px] main-button flex items-center justify-between ${isDisabled() ? "opacity-75" : ""}`}
                    disabled={isDisabled()}
                    onClick={handleAssign}
                >
                    Asignar
                    {loadingAssign ? <IconLoading classes="w-6 h-6 text-slate-100 me-2" /> : <IconCheck classes="w-6 h-6 " />}
                </button>
            </div>
        </div>
    )
}