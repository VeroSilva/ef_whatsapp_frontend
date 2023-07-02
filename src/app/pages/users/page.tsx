"use client"

import { useEffect, useState } from "react";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { SkeletonTable } from "@/app/components/Skeleton/Table";
import { usePaginateTable } from "../../hooks/usePaginateTable"
import { getUsers } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconEdit } from "@/app/components/Icons/IconEdit";
import { IconTrash } from "@/app/components/Icons/IconTrash";

const Users = (): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const { slice, range } = usePaginateTable({ data: users, page, rowsPerPage });
    // @ts-ignore
    const { userState } = useUser();

    useEffect(() => {
        setLoading(true);
        getUsers(userState.token).then((res => {
            console.log(res)
            setUsers(res);
            setLoading(false);
        }))
    }, [])

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8">
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
                            {!loading ? (
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
                                                    Edit
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
                                                    Delete
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
        </>
    )
}

export default Users;
