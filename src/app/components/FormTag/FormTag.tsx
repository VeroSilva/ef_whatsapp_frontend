import { useEffect, useState } from "react";
import { createTag, editTag } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconLoading } from "../Icons/IconLoading";

export const FormTag = ({ type, setAlert, handleLoadTags, handleOpenModal, data }: { type: string, setAlert: Function, handleLoadTags: Function, handleOpenModal: Function, data?: any }) => {
    const [errorDataTag, setErrorDataTag] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [dataTag, setDataTag] = useState({
        name: "",
        description: "",
        color: "",
    });
    const { userState } = useUser();

    useEffect(() => {
        if (data) {
            const { name, description, color } = data;

            setDataTag({
                ...dataTag,
                name,
                description,
                color
            });
        }
    }, [data]);

    const dataIsValid = () => {
        if (dataTag.name === "" || dataTag.description === "" || dataTag.color === "") return false;
        else return true;
    };

    const handleCreateTag = () => {
        if (!dataIsValid()) setErrorDataTag(true);
        else {
            setLoadingCreate(true)

            if (type === "create") {
                createTag(dataTag, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadTags()
                        setAlert({
                            type: "success",
                            message: "Etiqueta creada con éxito!",
                            show: true
                        })
                    }
                });
            } else {
                editTag(dataTag, data.id, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadTags()
                        setAlert({
                            type: "success",
                            message: "Etiqueta editada con éxito!",
                            show: true
                        })
                    }
                });
            }
        };
    };

    const CreateTagButton = () => (
        <button
            onClick={handleCreateTag}
            className={
                "main-button transition ease-in-out delay-50 flex " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            {type === "create" ? "Crear" : "Editar"} etiqueta
        </button>
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                    placeholder="Nombre"
                    value={dataTag.name ?? ""}
                    onChange={(e) => setDataTag({ ...dataTag, name: e.target.value })}
                />
            </div>


            <div className="relative">
                <input
                    type={"text"}
                    id="input-group-2"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                    placeholder="Descripción"
                    value={dataTag.description ?? ""}
                    onChange={(e) => setDataTag({ ...dataTag, description: e.target.value })}
                />
            </div>

            <div className="relative">
                <input
                    type={"text"}
                    id="input-group-3"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                    placeholder="Color, ej: #cdcdcd"
                    value={dataTag.color ?? ""}
                    onChange={(e) => setDataTag({ ...dataTag, color: e.target.value })}
                />
            </div>

            {errorDataTag && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong className="font-bold">Ocurrió un error,</strong>{" "}
                    <span className="block sm:inline">revise los datos y envie nuevamente</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorDataTag(false)}>
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
                <CreateTagButton />
            </div>
        </div>
    )
}