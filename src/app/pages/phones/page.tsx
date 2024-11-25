"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { deletePhone, getPhones } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";
import { Modal } from "@/app/components/Modal/Modal";
import { IconLoading } from "@/app/components/Icons/IconLoading";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { IconFacebook } from "@/app/components/Icons/IconFacebook";
import { IconCopy } from "@/app/components/Icons/IconCopy";
import { FormPhones } from "@/app/components/FormPhones/FormPhones";
import { redirect } from "next/navigation";
import useTags from '@/app/hooks/useTags';

const Users = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [loadingDeletePhone, setLoadingDeletePhone] = useState(false);
    const [phones, setPhones] = useState([]);
    const [phoneData, setPhoneData] = useState<any>({});
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: phones, page, rowsPerPage });
    const { userState } = useUser();
    const { tagsState } = useTags();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        handleLoadPhones()
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

    const handleLoadPhones = () => {
        setLoading(true);
        getPhones(userState.token).then((res => {
            setPhones(res);
            setLoading(false);
        }))
    }

    const handleDeletePhones = () => {
        setLoadingDeletePhone(true);

        deletePhone(phoneData.id, userState.token).then((res => {
            setLoadingDeletePhone(false);
            handleOpenDeleteModal(false);

            if (!res) {
                setAlert({
                    type: "error",
                    message: res.message,
                    show: true
                })
            } else {
                handleLoadPhones()
                setAlert({
                    type: "success",
                    message: "Teléfono eliminado con éxito!",
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

    const handleOpenDeleteModal = (show: boolean) => {
        setShowDeleteModal(show);
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button mb-4"
                    onClick={() => handleOpenModal(true)}
                >Nuevo teléfono</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center text-xs">

                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    Alias
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    Teléfono
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    Etiqueta
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    Catálogo ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    <span className="flex items-center justify-center gap-1"><span><IconFacebook classes="w-4 h-4" /></span> Whatsapp teléfono ID</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    <span className="flex items-center justify-center gap-1"><span><IconFacebook classes="w-4 h-4" /></span> Whatsapp busisness ID</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    <span className="flex items-center justify-center gap-1"><span><IconFacebook classes="w-4 h-4" /></span> Busisness ID</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    <span className="flex items-center justify-center gap-1"><span><IconFacebook classes="w-4 h-4" /></span> Whatsapp bearer token</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonTable col={9} />
                            ) : (
                                slice.map((phone, index) => {
                                    const currentTag: any = tagsState.filter((tag) => tag.id === Number(phone.tag_id))[0];
                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{index + 1}</th>
                                            <td className="px-6 py-4 text-center text-xs">{phone.phone}</td>
                                            <td className="px-6 py-4 text-center text-xs">{phone.alias}</td>
                                            <td className="px-6 py-4 text-center text-xs">{currentTag ? currentTag.name : ""}</td>
                                            <td className="px-6 py-4 text-center text-xs">{phone.catalog_id}</td>
                                            <td className="px-6 py-4 text-center text-xs max-w-[250px]">{phone.wp_phone_id}</td>
                                            <td className="px-6 py-4 text-center text-xs max-w-[250px]">{phone.waba_id}</td>
                                            <td className="px-6 py-4 text-center text-xs max-w-[250px]">{phone.bussines_id}</td>
                                            <td className="px-6 py-4 text-center text-xs max-w-[250px]">
                                                <div className="flex items-center">
                                                    <p className="truncate">{phone.wp_bearer_token}</p>
                                                    <button onClick={() => handleCopyToClipboard(phone.wp_bearer_token)}><IconCopy classes="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            handleOpenEditModal(true);
                                                            setPhoneData(phone);
                                                        }}
                                                    >
                                                        <IconEdit classes="w-5 h-5" />
                                                    </a>

                                                    <a
                                                        className="flex items-center text-danger text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setPhoneData(phone);
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
                title="Crear nuevo teléfono"
                onClose={() => handleOpenModal(false)}
                show={showModal}
                width="500px"
            >
                <FormPhones
                    type="create"
                    setAlert={setAlert}
                    handleLoadPhones={handleLoadPhones}
                    handleOpenModal={handleOpenModal}
                />
            </Modal>
            {/* END: Create User Modal */}

            {/* BEGIN: Edit User Modal */}
            <Modal
                title="Editar teléfono"
                onClose={() => handleOpenEditModal(false)}
                show={showEditModal}
                width="500px"
            >
                <FormPhones
                    type="edit"
                    setAlert={setAlert}
                    handleLoadPhones={handleLoadPhones}
                    handleOpenModal={handleOpenEditModal}
                    data={phoneData}
                />
            </Modal>
            {/* END: Edit User Modal */}

            {/* END: Delete User Modal */}
            <Modal
                // title="Eliminar usuario usuario"
                onClose={() => handleOpenDeleteModal(false)}
                show={showDeleteModal}
                width="500px"
            >
                <div className="text-xl mt-5">Estás seguro?</div>
                <div className="text-slate-500 mt-2">
                    Quieres eliminar el teléfono: <strong>{phoneData.phone}-{phoneData.alias}</strong>?{" "}
                    <br />
                    Esta acción es irreversible.
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="second-button"
                        onClick={() => handleOpenModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-800 text-white rounded-md text-sm px-4 py-2 transition ease-in-out delay-50 flex"
                        onClick={handleDeletePhones}
                    >
                        {loadingDeletePhone && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
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
