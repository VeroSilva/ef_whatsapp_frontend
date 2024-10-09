import { useEffect, useState } from "react";
import { IconUser } from "@/app/components/Icons/IconUser";
import { IconEyeSlash } from "@/app/components/Icons/IconEyeSlash";
import { IconEye } from "@/app/components/Icons/IconEye";
import { createUser, editUser } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconLoading } from "../Icons/IconLoading";
import { IconX } from "../Icons/IconX";
import { CompanyPhones } from "@/app/interfaces/user";
//@ts-ignore
import chroma from 'chroma-js';
import { FormSelectSchedules } from "./FormSelectSchedules/FormSelectSchedules";
import { IconSort } from "../Icons/IconSort";
import { Accordion } from "../Accordion/Accordion";

type Schedule = {
    days: string[];
    startTime: string | null;
    endTime: string | null;
};

export const FormUser = ({ type, roles, setAlert, handleLoadUsers, handleOpenModal, data }: { type: string, roles: any[], setAlert: Function, handleLoadUsers: Function, handleOpenModal: Function, data?: any }) => {
    const { userState } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [selectedNumbers, setSelectedNumbers] = useState<CompanyPhones[]>([])
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        role: "",
        company_phones_ids: "",
        weight: ""
    });
    const [scheduleGroup, setScheduleGroup] = useState<Schedule[]>([]);

    const addPhone = (phone: CompanyPhones) => {
        const itemExists = selectedNumbers.some((item: CompanyPhones) => item.company_phone_id === phone.company_phone_id);
        if (!itemExists) {
            setSelectedNumbers((prevOptions: CompanyPhones[]): CompanyPhones[] => [...prevOptions, phone])
        }
    }

    const removePhone = (id: number) => {
        const updatedOptions = selectedNumbers.filter((item: CompanyPhones) => item.company_phone_id !== id);
        setSelectedNumbers(updatedOptions);
    }

    useEffect(() => {
        setCredentials({
            ...credentials,
            company_phones_ids: selectedNumbers.map((phone: CompanyPhones) => phone.company_phone_id).join(',')
        });
    }, [selectedNumbers])


    useEffect(() => {
        if (data) {
            const { username, password, role, company_phones_ids, weight } = data;

            if (userState.company_phones && !!userState.company_phones.length) {
                setSelectedNumbers(userState.company_phones.filter((phone: CompanyPhones) => company_phones_ids && company_phones_ids.split(',').includes(String(phone.company_phone_id))))
            }

            setCredentials({
                ...credentials,
                username,
                password,
                role,
                company_phones_ids: selectedNumbers.map((phone: CompanyPhones) => phone.company_phone_id).join(','),
                weight
            });

            setScheduleGroup(data.work_schedule);
        }
    }, [data]);

    const dataIsValid = () => {
        if (
            credentials.username === "" ||
            credentials.password === "" ||
            credentials.role === "" ||
            credentials.weight === ""
        ) return false;
        else return true;
    };

    const handleCreateUser = () => {
        if (!dataIsValid()) setErrorCredentials(true);
        else {
            setLoadingCreate(true)

            const dataUser = {
                ...credentials,
                work_schedule: scheduleGroup
            }

            if (type === "create") {
                createUser(dataUser, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadUsers()
                        setAlert({
                            type: "success",
                            message: "Usuario creado con éxito!",
                            show: true
                        })
                    }
                });
            } else {
                const { username, role, company_phones_ids, weight} = credentials
                editUser({ username, role, company_phones_ids, weight, work_schedule: scheduleGroup }, data.id, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadUsers()
                        setAlert({
                            type: "success",
                            message: "Usuario editado con éxito!",
                            show: true
                        })
                    }
                });
            }
        };
    };

    const CreateUserButton = () => (
        <button
            onClick={handleCreateUser}
            className={
                "main-button transition ease-in-out delay-50 flex " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            {type === "create" ? "Crear" : "Editar"} usuario
        </button>
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconUser classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Username"
                    value={credentials.username ?? ""}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
            </div>

            {type === "create" && (
                <div className="relative">
                    <div
                        className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ?
                            <IconEyeSlash classes="w-5 h-5 text-gray-500 dark:text-gray-400" /> :
                            <IconEye classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        }
                    </div>

                    <input
                        type={showPassword ? "text" : "password"}
                        id="input-group-1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                        placeholder="Contraseña"
                        value={credentials.password ?? ""}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                </div>
            )}

            <div className="relative">
                <select
                    id="rols"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                >
                    <option selected={credentials.role === null} className="text-gray-600">Seleccione rol</option>
                    {roles.map((rol, index) => (
                        <option key={`rol-${index}`} value={rol.id} selected={credentials.role === rol.id}>{rol.name}</option>
                    ))}
                </select>
            </div>

            {credentials.role === "3" &&
                <>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <IconSort classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                            type="number"
                            id="input-group-1"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                            placeholder="Relevancia"
                            value={credentials.weight ?? ""}
                            onChange={(e) => setCredentials({ ...credentials, weight: e.target.value })}
                        />
                    </div>
                    
                    <div className="relative">
                        <h6 className="block uppercase tracking-wide text-gray-700 text-xs text-start font-bold mb-2">Seleccione para asignar</h6>
                        <div className="flex flex-wrap gap-2">
                            {userState.company_phones && !!userState.company_phones.length && userState.company_phones.map((phone) => {
                                const color = chroma("#002e6d");
                                const background = color.alpha(0.2).css()
                                return (
                                    <span
                                        key={`phone-${phone.company_phone_id}`}
                                        style={{ backgroundColor: background, border: `1px solid #002e6d` }}
                                        className={`rounded-full px-2 py-1 text-xs font-bold text-gray-800 text-gray-700 cursor-pointer flex items-center`}
                                        onClick={() => addPhone(phone)}
                                    >
                                        {phone.alias}
                                    </span>
                                )

                            })}
                        </div>

                        {selectedNumbers.length > 0 &&
                            <>
                                <h6 className="block uppercase tracking-wide text-gray-700 text-xs text-start font-bold mt-6 mb-2">Listado de asignados</h6>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNumbers.map((phone) => {
                                        const color = chroma("#a2042d");
                                        const background = color.alpha(0.2).css()
                                        return (
                                            <span
                                                key={`phone-added-${phone.company_phone_id}`}
                                                style={{ backgroundColor: background, border: `1px solid #a2042d` }}
                                                className="rounded-full px-2 py-1 text-xs font-bold text-gray-800 text-gray-700 flex items-center"
                                            >
                                                {phone.alias}
                                                <button
                                                    className="rounded-full"
                                                    onClick={() => removePhone(phone.company_phone_id)}
                                                >
                                                    <IconX classes="w-6 h-6 ms-1 text-gray-800" />
                                                </button>
                                            </span>
                                        )
                                    })}
                                </div>
                            </>
                        }
                    </div>

                    <Accordion
                        title="Agregar horario"
                        titleClassname="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold"
                        defaultIsOpen={type === "edit"}
                    >
                        <FormSelectSchedules scheduleGroup={scheduleGroup} setScheduleGroup={setScheduleGroup} />
                    </Accordion>
                </>
            }

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
                <CreateUserButton />
            </div>
        </div>
    )
}