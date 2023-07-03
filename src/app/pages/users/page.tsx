"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { createUser, getUsers } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";
import { Modal } from "@/app/components/Modal/Modal";
import { IconUser } from "@/app/components/Icons/IconUser";
import { IconEyeSlash } from "@/app/components/Icons/IconEyeSlash";
import { IconEye } from "@/app/components/Icons/IconEye";
import { IconLoading } from "@/app/components/Icons/IconLoading";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";

const Users = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [users, setUsers] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: users, page, rowsPerPage });
    // @ts-ignore
    const { userState } = useUser();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        role: "",
    });
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    })

    useEffect(() => {
        setLoading(true);
        getUsers(userState.token).then((res => {
            setUsers(res);
            setLoading(false);
        }))
    }, []);

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const dataIsValid = () => {
        if (credentials.username === "" || credentials.password === "" || credentials.rol === "") return false;
        else return true;
    };

    const handleCreateConversation = () => {
        if (!dataIsValid()) setErrorCredentials(true);
        else {
            setLoadingCreate(true)
            createUser(credentials, userState.token).then((res) => {
                setLoadingCreate(false)
                setShowModal(false)

                if (res.message) {
                    setAlert({
                        type: "error",
                        message: res.message,
                        show: true
                    })
                } else {
                    setAlert({
                        type: "success",
                        message: "Usuario creado con éxito!",
                        show: true
                    })
                }
            });
        };
    };

    const CreateConversationButton = () => (
        <button
            onClick={handleCreateConversation}
            className={
                "main-button transition ease-in-out delay-50 flex " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            Crear usuario
        </button>
    );

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button"
                    onClick={() => handleOpenModal(true)}
                >Nuevo usuario</button>
                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Username
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Rol
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonTable col={4} />
                            ) : (
                                slice.map((user, index) => (
                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{user.id}</th>
                                        <td className="px-6 py-4 text-center">{user.username}</td>
                                        <td className="px-6 py-4 text-center">
                                            {
                                                user.rol ?
                                                    <span className="bg-green-200 rounded-lg border border-green-400 text-xs px-2 py-1 font-bold">{user.rol}</span> :
                                                    <span className="bg-gray-200 rounded-lg border border-gray-400 text-xs px-2 py-1 font-bold">No registrado</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center">
                                                <a
                                                    className="flex items-center mr-3 text-xs"
                                                    href="#"
                                                    onClick={() => {
                                                        // setEditUserDataModal(true);
                                                        // setUserData(user);
                                                    }}
                                                >
                                                    <IconEdit classes="w-5 h-5" />
                                                    Editar
                                                </a>
                                                <a
                                                    className="flex items-center text-danger text-xs"
                                                    href="#"
                                                    onClick={() => {
                                                        // setDeleteConfirmationModal(true);
                                                        // setUserData(user);
                                                    }}
                                                >
                                                    <IconTrash classes="w-5 h-5 text-rose-600" />
                                                    Eliminar
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BEGIN: Create User Modal */}
            {showModal && (
                <Modal
                    title="Crear nuevo usuario"
                    onClose={() => handleOpenModal(false)}
                    show={showModal}
                    width="500px"
                >
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
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                        </div>

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
                                placeholder="Password"
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>

                        <div className="relative mb-6">
                            <select
                                id="rols"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                            >
                                <option selected className="text-gray-600">Seleccione rol</option>
                                <option value="admin">Administrador</option>
                                <option value="call">Call center</option>
                                <option value="support">Soporte</option>
                            </select>
                        </div>
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
                        <CreateConversationButton />
                    </div>
                </Modal>
            )}
            {/* END: Create User Modal */}

            {alert.show &&
                <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 right-0 flex items-center ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                    {alert.type === "success" ?
                        <IconCheckCircle classes="w-6 h-6 mr-2" /> :
                        <IconInfo classes="w-6 h-6 mr-2" />
                    }
                    <span>{alert.message}</span>
                </div>
            }
        </>
    )
}

export default Users;
