"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { deleteCampaign, getCampaigns } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";
import { Modal } from "@/app/components/Modal/Modal";
import { IconLoading } from "@/app/components/Icons/IconLoading";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { FormEditPassword } from "@/app/components/FormUser/FormEditPassword/FormEditPassword";
import { redirect } from "next/navigation";
import { CampaignUser } from "@/app/interfaces/campaign";
import { FormCampaign } from "@/app/components/FormCampaign/FormCampaign";
import useTags from '@/app/hooks/useTags';

const Campaigns = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [campaignData, setCampaignData] = useState<any>({});
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: campaigns, page, rowsPerPage });
    const { userState } = useUser();
    const { tagsState } = useTags();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState<boolean>(false);
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
        handleLoadCampaigns()
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

    const handleLoadCampaigns = () => {
        setLoading(true);

        getCampaigns(userState.token).then((res => {
            setCampaigns(res);
            setLoading(false);
        }))
    }

    const handleDeleteUser = () => {
        setLoadingDeleteUser(true);

        deleteCampaign(campaignData.id, userState.token).then((res => {
            setLoadingDeleteUser(false);
            handleOpenDeleteModal(false);

            if (!res) {
                setAlert({
                    type: "error",
                    message: res.message,
                    show: true
                })
            } else {
                handleLoadCampaigns()
                setAlert({
                    type: "success",
                    message: "Campaña eliminada con éxito!",
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
                >Nueva Campaña</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">

                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    ID Campaña
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Usuarios
                                </th>
                                <th scope="col" className="px-6 py-3 text-center">
                                    Etiqueta
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
                                slice.map((campaign, index) => {
                                    const currentTag: any = tagsState.filter((tag) => tag.id === Number(campaign.tag_id))[0];

                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{campaign.id}</td>
                                            <td className="px-6 py-4 text-center">{campaign.id_campaign}</td>
                                            <td className="px-6 py-4 text-center flex gap-2 justify-center">{
                                                campaign.users.map((user: CampaignUser) => (
                                                    <span className="rounded-lg text-xs text-blue-900 px-2 py-1 bg-slate-100" key={`user-${user.id}`}>{user.username}</span>
                                                ))
                                            }</td>
                                            <td className="px-6 py-4 text-center">{currentTag ? currentTag.name : ""}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center items-center">
                                                    <a
                                                        className="flex items-center mr-3 text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            handleOpenEditModal(true);
                                                            setCampaignData(campaign);
                                                        }}
                                                    >
                                                        <IconEdit classes="w-5 h-5" />
                                                    </a>

                                                    <a
                                                        className="flex items-center text-danger text-xs"
                                                        href="#"
                                                        onClick={() => {
                                                            setShowDeleteModal(true);
                                                            setCampaignData(campaign);
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
                title="Crear nueva Campaña"
                onClose={() => handleOpenModal(false)}
                show={showModal}
                width="500px"
            >
                <FormCampaign
                    type="create"
                    setAlert={setAlert}
                    handleLoadCampaigns={handleLoadCampaigns}
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
                <FormCampaign
                    type="edit"
                    setAlert={setAlert}
                    handleLoadCampaigns={handleLoadCampaigns}
                    handleOpenModal={handleOpenEditModal}
                    data={campaignData}
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
                    data={campaignData}
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
                    Quieres eliminar la Campaña: <strong>{campaignData.id_campaign}</strong>?{" "}
                    <br />
                    Esta acción es irreversible.
                </div>

                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="second-button"
                        onClick={() => handleOpenDeleteModal(false)}
                    >
                        Cancelar
                    </button>
                    <button
                        className="bg-red-800 text-white rounded-md text-sm px-4 py-2 transition ease-in-out delay-50 flex"
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

export default Campaigns;
