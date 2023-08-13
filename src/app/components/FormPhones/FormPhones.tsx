import { useEffect, useState } from "react";
import { createPhone, editPhone } from "@/app/services/api"
import useUser from "../../hooks/useUser"
import { IconLoading } from "../Icons/IconLoading";

export const FormPhones = ({ type, setAlert, handleLoadPhones, handleOpenModal, data }: { type: string, setAlert: Function, handleLoadPhones: Function, handleOpenModal: Function, data?: any }) => {
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [phoneData, setPhoneData] = useState({
        phone: "",
        company_id: "",
        wp_phone_id: "",
        waba_id: "",
        bussines_id: "",
        wp_bearer_token: "",
        alias: ""
    });
    const { userState } = useUser();

    useEffect(() => {
        if (data) {
            const { phone, company_id, wp_phone_id, waba_id, bussines_id, wp_bearer_token, alias } = data;

            setPhoneData({
                ...phoneData,
                phone,
                company_id,
                wp_phone_id,
                waba_id,
                bussines_id,
                wp_bearer_token,
                alias
            });
        }
    }, [data]);

    const dataIsValid = () => {
        if (phoneData.phone === "" || phoneData.company_id === "" || phoneData.wp_phone_id === "" || phoneData.waba_id === "" || phoneData.bussines_id === "" || phoneData.wp_bearer_token === "" || phoneData.alias === "") return false;
        else return true;
    };

    const handleCreateUser = () => {
        if (!dataIsValid()) setErrorCredentials(true);
        else {
            setLoadingCreate(true)

            if (type === "create") {
                createPhone(phoneData, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadPhones()
                        setAlert({
                            type: "success",
                            message: "Teléfono creado con éxito!",
                            show: true
                        })
                    }
                });
            } else {
                editPhone(phoneData, data.id, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadPhones()
                        setAlert({
                            type: "success",
                            message: "Teléfono editado con éxito!",
                            show: true
                        })
                    }
                });
            }
        };
    };

    const CreatePhoneButton = () => (
        <button
            onClick={handleCreateUser}
            className={
                "main-button transition ease-in-out delay-50 flex " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            {type === "create" ? "Crear" : "Editar"} teléfono
        </button>
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Alias"
                    value={phoneData.alias ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, alias: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Teléfono"
                    value={phoneData.phone ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="ID Compañía"
                    value={phoneData.company_id ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, company_id: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Whatsapp teléfono ID"
                    value={phoneData.wp_phone_id ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, wp_phone_id: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Whatsapp Busisness ID"
                    value={phoneData.waba_id ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, waba_id: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Busisness ID"
                    value={phoneData.bussines_id ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, bussines_id: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Whatsapp bearer token"
                    value={phoneData.wp_bearer_token ?? ""}
                    onChange={(e) => setPhoneData({ ...phoneData, wp_bearer_token: e.target.value })}
                />
            </div>

            {errorCredentials && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong className="font-bold">Ocurrió un error,</strong>{" "}
                    <span className="block sm:inline">revise los datos y envie nuevamente</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorCredentials(false)}>
                        <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            )}

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button"
                    onClick={() => handleOpenModal(false)}
                >
                    Cancelar
                </button>
                <CreatePhoneButton />
            </div>
        </div>
    )
}