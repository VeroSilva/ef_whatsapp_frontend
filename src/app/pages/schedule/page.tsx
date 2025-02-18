"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable";
import { getSchedule } from "@/app/services/api";
import useUser from "../../hooks/useUser";
import { redirect } from "next/navigation";
import { TableFooter } from "@/app/components/TableFooter/TableFooter";
import { Modal } from "@/app/components/Modal/Modal";
import { MassiveAssigment } from "@/app/components/MassiveAssigment/MassiveAssigment";
import { IconCheckCircle } from "@/app/components/Icons/IconCheckCircle";
import { IconInfo } from "@/app/components/Icons/IconInfo";

const Schedule = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [page, setPage] = useState(1);
    const [showAssignmentModal, setShowassignmentModal] = useState<boolean>(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });
    const { slice, range } = usePaginateTable({ data: schedule, page, rowsPerPage });
    const { userState } = useUser();

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login');
        }
    }, [userState]);

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
    }, [alert]);

    useEffect(() => {
        handleLoadSchedule();
    }, []);

    const handleLoadSchedule = () => {
        setLoading(true);
        getSchedule(userState.token).then((res) => {
            setSchedule(res);
            setLoading(false);
        });
    };

    const handleOpenAssigmentModal = (show: boolean) => {
        setShowassignmentModal(show);
    };

    const getStatus = (item: any) => {
        const now = new Date();
        const dispatchDate = new Date(item.dispatch_date);

        if (item.processed) {
            return { status: "Procesado", color: "green" };
        } else if (item.error) {
            return { status: "Error", color: "red" };
        } else if (dispatchDate > now) {
            return { status: "Pendiente", color: "orange" };
        } else {
            return { status: "Procesando", color: "yellow" };
        }
    };

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <button
                    className="main-button mb-4"
                    onClick={() => handleOpenAssigmentModal(true)}
                >Asignación masiva</button>

                <div className="relative overflow-x-auto w-full rounded-md">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-300">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-center">Nro</th>
                                <th scope="col" className="px-4 py-2 text-center">Etiqueta</th>
                                <th scope="col" className="px-4 py-2 text-center">Teléfono</th>
                                <th scope="col" className="px-4 py-2 text-center">Usuario</th>
                                <th scope="col" className="px-4 py-2 text-center">Conversaciones</th>
                                <th scope="col" className="px-4 py-2 text-center">Teléfonos</th>
                                <th scope="col" className="px-4 py-2 text-center">Ejecución</th>
                                <th scope="col" className="px-4 py-2 text-center">Creación</th>
                                <th scope="col" className="px-4 py-2 text-center">Estado</th>
                                <th scope="col" className="px-4 py-2 text-center">Detalle del Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <SkeletonTable col={10} />
                            ) : (
                                slice.map((item, index) => {
                                    const { status, color } = getStatus(item);
                                    return (
                                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" className="px-4 py-2 font-medium text-gray-900 text-center whitespace-nowrap dark:text-white">{index + 1}</th>
                                            <td className="px-4 py-2 text-center">
                                                <span className="flex items-center justify-center">
                                                    <span className="mr-2">{item.name}</span>
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">{`${item.alias} - ${item.phone}`}</td>
                                            <td className="px-4 py-2 text-center">{item.username}</td>
                                            <td className="px-4 py-2 text-center">{item.conversations_count}</td>
                                            <td className="px-4 py-2 text-center">{item.phones_count}</td>
                                            <td className="px-4 py-2 text-center whitespace-pre-wrap">{item.dispatch_date.replace(' ', '\n')}</td>
                                            <td className="px-4 py-2 text-center whitespace-pre-wrap">{item.created_at.replace(' ', '\n')}</td>
                                            <td className="px-4 py-2 text-center">
                                                <span className="flex items-center justify-center">
                                                    <span className="mr-2">{status}</span>
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">{item.error_detail}</td>
                                        </tr>
                                    );
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

            {/* START: Asignación Masiva Modal */}
            <Modal
                title="Asignación masiva de etiquetas"
                onClose={() => handleOpenAssigmentModal(false)}
                show={showAssignmentModal}
                width="800px"
            >
                <div>
                    <MassiveAssigment handleShowModal={handleOpenAssigmentModal} setAlert={setAlert} />
                </div>
            </Modal>
            {/* END: Asignación Masiva Modal */}

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
    );
};

export default Schedule;