import { useEffect, useState } from "react";
import { createTag, editTag } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconLoading } from "../Icons/IconLoading";
import { IconPlus } from "../Icons/IconPlus";
import { IconTrash } from "../Icons/IconTrash";
import { FormField, Tag } from "@/app/interfaces/conversations";

export const FormTag = ({ type, setAlert, handleLoadTags, handleOpenModal, data }: { type: string, setAlert: Function, handleLoadTags: Function, handleOpenModal: Function, data?: any }) => {
    const [errorDataTag, setErrorDataTag] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [showForm, setForm] = useState(false);
    const [dataTag, setDataTag] = useState<Tag>({
        name: "",
        description: "",
        color: "",
        hasNestedForm: false,
        fields: [],
    });
    const { userState } = useUser();

    useEffect(() => {
        if (data) {
            const { name, description, color, hasNestedForm, fields } = data;

            setDataTag({
                ...dataTag,
                name,
                description,
                color,
                hasNestedForm,
                fields
            });
        }
    }, [data]);

    const dataIsValid = () => {
        if (
            dataTag.name === "" ||
            dataTag.description === "" ||
            dataTag.color === "" ||
            (dataTag.hasNestedForm && !dataTag.fields.length)
        ) return false;
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
                "main-button transition ease-in-out delay-50 flex mb-8 " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            {type === "create" ? "Crear" : "Editar"} etiqueta
        </button>
    );

    const handleToggleNestedForm = () => {
        setDataTag((prev) => ({
            ...prev,
            hasNestedForm: !prev.hasNestedForm,
            fields: !prev.hasNestedForm ? [] : prev.fields, // Limpia los campos si desactiva
        }));
    };

    const handleFieldChange = (id: string, key: keyof FormField, value: any) => {
        setDataTag((prev) => ({
            ...prev,
            fields: prev.fields.map((field) =>
            field.id === id ? { ...field, [key]: value } : field
            ),
        }));
    };
      
    const addField = (type: "decimal" | "text" | "date") => {
        setDataTag((prev) => ({
            ...prev,
            fields: [
            ...prev.fields,
            { id: crypto.randomUUID(), type, name: "" }, // Agrega un nuevo campo con un ID único
            ],
        }));
    };
      
    const removeField = (id: string) => {
        setDataTag((prev) => ({
            ...prev,
            fields: prev.fields.filter((field) => field.id !== id),
        }));
    };

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

            <label className="inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={handleToggleNestedForm}
                    checked={dataTag.hasNestedForm}
                />

                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600"></div>

                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Agregar formulario</span>
            </label>

            {dataTag.hasNestedForm && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <button type="button" className="flex gap-2 text-xs rounded-xl bg-slate-100 p-2 cursor-pointer" onClick={() => addField("decimal")}>
                            <IconPlus classes="w-4 h-4" />
                            Campo decimal
                        </button>
                        <button type="button" className="flex gap-2 text-xs rounded-xl bg-slate-100 p-2 cursor-pointer" onClick={() => addField("text")}>
                            <IconPlus classes="w-4 h-4" />
                            Campo de texto
                        </button>
                        <button type="button" className="flex gap-2 text-xs rounded-xl bg-slate-100 p-2 cursor-pointer" onClick={() => addField("date")}>
                            <IconPlus classes="w-4 h-4" />
                            Campo de fecha
                        </button>
                    </div>

                    {dataTag.fields.map((field) => (
                        <div
                            key={field.id}
                            className="flex my-2"
                        >
                            <select
                                className="flex-1 rounded-l-lg text-sm border border-slate-200 border-r-0 bg-slate-100 focus:outline-none focus:ring-0 focus:border-none"
                                value={field.type}
                                onChange={(e) =>
                                    handleFieldChange(field.id, "type", e.target.value)
                                }
                            >
                                <option value="decimal">Numérico Decimal</option>
                                <option value="text">Texto</option>
                                <option value="date">Fecha</option>
                            </select>

                            <input
                                type="text"
                                className="flex-1 rounded-r-lg text-sm border border-slate-200 border-l-0 focus:outline-none focus:ring-0 focus:border-slate-300"
                                placeholder="Nombre del campo"
                                value={field.name}
                                onChange={(e) =>
                                    handleFieldChange(field.id, "name", e.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="w-10 h-10 p-2 bg-rose-500 rounded-full flex items-center justify-center ml-2"
                                onClick={() => removeField(field.id)}
                            >
                                <IconTrash classes="w-5 h-5 text-slate-50" />
                            </button>
                        </div>
                    ))}
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