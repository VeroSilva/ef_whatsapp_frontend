"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { deleteUser, getUsers } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";
import { Modal } from "@/app/components/Modal/Modal";
import { IconLoading } from "@/app/components/Icons/IconLoading";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { FormUser } from "@/app/components/FormUser/FormUser";
import { FormEditPassword } from "@/app/components/FormUser/FormEditPassword/FormEditPassword";
import { IconPassword } from "@/app/components/Icons/IconPassword";
import { redirect } from "next/navigation";

const Users = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState<any>({});
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: users, page, rowsPerPage });
    const { userState } = useUser();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });
    const roles = [
        { id: "1", name: "Administrador", classes: "bg-blue-500" },
        { id: "2", name: "Call Center", classes: "bg-indigo-500" },
        { id: "3", name: "Vendedor", classes: "bg-violet-500" },
    ]

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        handleLoadUsers()
    }, []);

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({
                    type: alert.type,
                    message: alert.message,
                    show: false
                })
            }, 3000);
        }
    }, [alert])

    const handleLoadUsers = () => {
        setLoading(true);
        getUsers(userState.token).then((res => {
            setUsers(res);
            setLoading(false);
        }))
    }

    const handleDeleteUser = () => {
        setLoadingDeleteUser(true);

        deleteUser(userData.id, userState.token).then((res => {
            setLoadingDeleteUser(false);
            handleOpenDeleteModal(false);

            if (!res) {
                setAlert({
                    type: "error",
                    message: res.message,
                    show: true
                })
            } else {
                handleLoadUsers()
                setAlert({
                    type: "success",
                    message: "Usuario eliminado con éxito!",
                    show: true
                })
            }
        }))
    }

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    const handleOpenEditModal = (show: boolean) => {
        setShowEditModal(show);
    };

    const handleOpenEditPasswordModal = (show: boolean) => {
        setShowEditPasswordModal(show)
    }

    const handleOpenDeleteModal = (show: boolean) => {
        setShowDeleteModal(show);
    };

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button mb-4"
                    onClick={() => handleOpenModal(true)}
                >Nuevo usuario</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">

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
                                <SkeletonTable col={3} />
                            ) : (
                                slice.map((user, index) => {
                                    const role = user.role && roles.find(role => role.id === user.role);

                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{index + 1}</th>
                                            <td className="px-6 py-4 text-center">{user.username}</td>
                                            <td className="px-6 py-4 text-center">
                                                {
                                                    role ?
                                                        <span className={`rounded-lg text-xs text-white px-2 py-1 ${role.classes}`}>{role.name}</span> :
                                                        <span className="bg-gray-500 text-xs text-white rounded-lg px-2 py-1">No registrado</span>
                                                }
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            handleOpenEditModal(true);
                                                            setUserData(user);
                                                        }}
                                                    >
                                                        <IconEdit classes="w-5 h-5" />

                                                    </a>

                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            setShowEditPasswordModal(true);
                                                            setUserData(user);
                                                        }}
                                                    >
                                                        <IconPassword classes="w-5 h-5" />
                                                    </a>

                                                    <a
                                                        className="flex items-center text-danger text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setUserData(user);
                                                        }}
                                                    >
                                                        <IconTrash classes="w-5 h-5 text-rose-600" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* BEGIN: Pagination */}
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
                    <TableFooter
                        range={range}
                        slice={slice}
                        setPage={setPage}
                        page={page}
                    />
                    <select
                        className="w-16 ml-2 border border-sky-800 rounded-md px-2 py-1 text-sm"
                        onChange={(event) => setRowsPerPage(Number(event.target.value))}
                    >
                        <option>5</option>
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                </div>
                {/* END: Pagination */}
            </div>

            {/* BEGIN: Create User Modal */}
            <Modal
                title="Crear nuevo usuario"
                onClose={() => handleOpenModal(false)}
                show={showModal}
                width="500px"
            >
                <FormUser
                    type="create"
                    roles={roles}
                    setAlert={setAlert}
                    handleLoadUsers={handleLoadUsers}
                    handleOpenModal={handleOpenModal}
                />
            </Modal>
            {/* END: Create User Modal */}

            {/* BEGIN: Edit User Modal */}
            <Modal
                title="Editar usuario"
                onClose={() => handleOpenEditModal(false)}
                show={showEditModal}
                width="500px"
            >
                <FormUser
                    type="edit"
                    roles={roles}
                    setAlert={setAlert}
                    handleLoadUsers={handleLoadUsers}
                    handleOpenModal={handleOpenEditModal}
                    data={userData}
                />
            </Modal>
            {/* END: Edit User Modal */}

            {/* BEGIN: Edit Password User Modal */}
            <Modal
                title="Editar contraseña de usuario"
                onClose={() => handleOpenEditPasswordModal(false)}
                show={showEditPasswordModal}
                width="500px"
            >
                <FormEditPassword
                    handleOpenModal={handleOpenEditPasswordModal}
                    setAlert={setAlert}
                    data={userData}
                />
            </Modal>
            {/* END: Edit Password User Modal */}

            {/* END: Delete User Modal */}
            <Modal
                // title="Eliminar usuario usuario"
                onClose={() => handleOpenDeleteModal(false)}
                show={showDeleteModal}
                width="500px"
            >
                <div className="text-xl mt-5">Estás seguro?</div>
                <div className="text-slate-500 mt-2">
                    Quieres eliminar el usuario de: <strong>{userData.username}</strong>?{" "}
                    <br />
                    Esta acción es irreversible.
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="second-button mb-8"
                        onClick={() => handleOpenDeleteModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-800 text-white rounded-md text-sm px-4 py-2 mb-8 transition ease-in-out delay-50 flex"
                        onClick={handleDeleteUser}
                    >
                        {loadingDeleteUser && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                        Sí, eliminar
                    </button>
                </div>
            </Modal >
            {/* END: Delete User Modal */}

            {/* {alert.show && */}
            <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 right-0 flex items-center transition transition-opacity duration-500 ${alert.show ? "opacity-1" : "opacity-0"} ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                {alert.type === "success" ?
                    <IconCheckCircle classes="w-6 h-6 mr-2" /> :
                    <IconInfo classes="w-6 h-6 mr-2" />
                }
                <span>{alert.message}</span>
            </div>
            {/* } */}
        </>
    )
}

export default Users;
