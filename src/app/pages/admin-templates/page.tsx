"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { getTemplates } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { Modal } from "@/app/components/Modal/Modal";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { redirect } from "next/navigation";
import useActivePhone from "../../hooks/useActivePhone";
import { IconEdit } from "@/app/components/Icons/IconEdit";

const AdminTemplates = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    // const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
    const [template, setTemplate] = useState([]);
    const [campaignData, setCampaignData] = useState<any>({});
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: template, page, rowsPerPage });
    const { userState } = useUser();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    // const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    // const [showEditPasswordModal, setShowEditPasswordModal] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });
    const { activePhone } = useActivePhone();
    
    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        handleLoadTemplates()
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

    const handleLoadTemplates = () => {
        setLoading(true);

        getTemplates(userState.token, activePhone, true).then((res => {
            setTemplate(res.templates);
            setLoading(false);
        }))
    }

    const handleOpenEditModal = (show: boolean) => {
        setShowEditModal(show);
    };

    const handleOpenModal = (show: boolean) => {
        setShowModal(show);
    };

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button mb-4"
                    onClick={() => handleOpenModal(true)}
                >Nueva Campaña</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Whatsapp template ID
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
                                slice.map((template, index) => {
                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{template.id}</th>
                                            <td className="px-6 py-4 text-center">{template.name}</td>
                                            <td className="px-6 py-4 text-center">{template.whatsapp_template_id}</td>
                                            
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            handleOpenEditModal(true);
                                                            setCampaignData(template);
                                                        }}
                                                    >
                                                        <IconEdit classes="w-5 h-5" />
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

            {/* BEGIN: Edit Password User Modal */}
            <Modal
                title="Editar template"
                onClose={() => handleOpenEditModal(false)}
                show={showEditModal}
                width="500px"
            >
                {/* <FormEditPassword
                    handleOpenModal={handleOpenEditPasswordModal}
                    setAlert={setAlert}
                    data={campaignData}
                /> */}
                <></>
            </Modal>
            {/* END: Edit Password User Modal */}

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

export default AdminTemplates;
