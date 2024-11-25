"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { deleteQuickAnswers, getCatalog, getQuickAnswers } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";
import { Modal } from "@/app/components/Modal/Modal";
import { IconLoading } from "@/app/components/Icons/IconLoading";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { redirect } from "next/navigation";
import { FormQuickReply } from "@/app/components/FormQuickReply/FormQuickReply";
import useCatalog from '@/app/hooks/useCatalog';
import { IconCheck } from "@/app/components/Icons/IconCheck";
import { IconX } from "@/app/components/Icons/IconX";
import useActivePhone from "../../hooks/useActivePhone";

const QuickAnswers = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [loadingDeleteRelation, setLoadingDeleteRelation] = useState(false);
    const [relation, setRelation] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const [quickAnswersData, setQuickAnswersData] = useState({} as any);
    const { slice, range } = usePaginateTable({ data: relation, page, rowsPerPage });
    const { userState } = useUser();
    const { setCatalogState } = useCatalog();
    const { activePhone } = useActivePhone();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });

    useEffect(() => {
        handleLoadQuickAnswers();
    }, [])

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState])

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

    useEffect(() => {
        getCatalog(userState.token, activePhone).then((res) => {
            setCatalogState(res.catalog)
        })
    }, [activePhone]);

    const handleLoadQuickAnswers = () => {
        setLoading(true)

        getQuickAnswers(userState.token, activePhone).then((res => {
            setLoading(false)
            setRelation(res)
        }))
    }

    const handleDeleteRelation = () => {
        setLoadingDeleteRelation(true);

        deleteQuickAnswers(quickAnswersData.id, activePhone, userState.token).then((res => {
            setLoadingDeleteRelation(false);
            handleOpenDeleteModal(false);

            if (!res) {
                setAlert({
                    type: "error",
                    message: "Algo salió mal, vuelve a intentarlo",
                    show: true
                })
            } else {
                handleLoadQuickAnswers()
                setAlert({
                    type: "success",
                    message: "Relación eliminada con éxito!",
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

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button mb-4"
                    onClick={() => handleOpenModal(true)}
                >Nueva relación</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">

                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Palabras
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Coincidencias
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Activo
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
                                slice.map((relation, index) => {
                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{index + 1}</th>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        relation.coincidences.map((coincidencia: any, index: number) => (
                                                            <span key={`coincidencia-${index}`} className="bg-slate-200 p-2 rounded-md">
                                                                {coincidencia}
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        relation.messageData.interactive.type === "product_list" ?
                                                            relation.messageData.interactive.action.sections[0].product_items.map((item: any, index: number) => (
                                                                <span key={`item-product-${index}`} className="bg-slate-200 p-2 rounded-md">
                                                                    {item.product_name}
                                                                </span>
                                                            )) :
                                                            relation.messageData.interactive.type === "product" ?
                                                                <span className="bg-slate-200 p-2 rounded-md">
                                                                    {relation.messageData.interactive.action.product_name}
                                                                </span> :
                                                                null
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    {
                                                        relation.status ?
                                                            <IconCheck classes="w-5 h-5 rounded-full bg-emerald-500 text-slate-100" />
                                                            : <IconX classes="w-5 h-5 rounded-full bg-rose-500 text-slate-100" />
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            handleOpenEditModal(true);
                                                            setQuickAnswersData(relation);
                                                        }}
                                                    >
                                                        <IconEdit classes="w-5 h-5" />

                                                    </a>

                                                    <a
                                                        className="flex items-center text-danger text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setQuickAnswersData(relation);
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
                title="Crear nueva relación"
                onClose={() => handleOpenModal(false)}
                show={showModal}
                width="800px"
            >
                <FormQuickReply handleLoadQuickAnswers={handleLoadQuickAnswers} setAlert={setAlert} handleOpenModal={handleOpenModal} />
            </Modal>
            {/* END: Create User Modal */}

            {/* BEGIN: Edit User Modal */}
            <Modal
                title="Editar relación"
                onClose={() => handleOpenEditModal(false)}
                show={showEditModal}
                width="800px"
            >
                <FormQuickReply handleLoadQuickAnswers={handleLoadQuickAnswers} setAlert={setAlert} quickAnswersData={quickAnswersData} handleOpenModal={handleOpenEditModal} />
            </Modal>
            {/* END: Edit User Modal */}

            {/* END: Delete User Modal */}
            <Modal
                title="Eliminar relación"
                onClose={() => handleOpenDeleteModal(false)}
                show={showDeleteModal}
                width="500px"
            >
                <div className="text-xl mt-5">Estás seguro?</div>
                <div className="text-slate-500 mt-2">
                    Quieres eliminar esta relación?{" "}
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
                        className="bg-red-800 text-white rounded-md text-sm px-4 py-2 mb-8 transition ease-in-out delay-50 flex"
                        onClick={handleDeleteRelation}
                    >
                        {loadingDeleteRelation && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
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

export default QuickAnswers;
