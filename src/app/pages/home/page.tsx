"use client"
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import useUser from "@/app/hooks/useUser";
import { redirect } from 'next/navigation'
import { useEffect, useState } from "react";
import { getDashboardReport, downloadDashboardReport } from "@/app/services/api";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/esm/locale'
import { BotMessagesChart } from "@/app/components/Chart/BotMessagesChart";
import { CampaingMessagesChart } from "@/app/components/Chart/CampaingMessagesChart";
import { ReceivedMessagesChart } from "@/app/components/Chart/ReceivedMessagesChart";
import { TotalConversationsChart } from "@/app/components/Chart/TotalConversationsChart";
import { ConversationSkeleton } from "../../components/Skeleton/Conversation";
import { IconUnread } from "../../components/Icons/IconUnread"
import { IconMessage } from "../../components/Icons/IconMessage"
import { IconSearch } from "../../components/Icons/IconSearch"
import { IconDocument } from "../../components/Icons/IconDocument"
import { IconLoading } from "../../components/Icons/IconLoading";

import dayjs from "dayjs";

const Home = (): JSX.Element => {
    const { userState } = useUser();
    const [botMessagesData, setReportsData] = useState<any[]>([]);
    const [campaingMessages, setCampaingMessages] = useState<any[]>([]);
    const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
    const [totalConversations, setTotalConversations] = useState<any[]>([]);
    const currentDate = new Date();
    const initMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const [startDate, setStartDate] = useState(initMonth);
    const [endDate, setEndDate] = useState(endMonth);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }

        if (userState.role) setUserRole(userState.role)
    }, [userState]);

    const handleLoadDashboardReport = (startFormatted: String, endFormatted: String) => {
        setLoading(true)
        getDashboardReport(userState.token, startFormatted, endFormatted).then((res => {
            setLoading(false)
            if ('botMessages' in res && res.botMessages) {
                setReportsData(res.botMessages)
            }
            if ('campaingMessages' in res && res.campaingMessages) {
                setCampaingMessages(res.campaingMessages)
            }
            if ('receivedMessages' in res && res.receivedMessages) {
                setReceivedMessages(res.receivedMessages)
            }
            if ('totalConversations' in res && res.totalConversations) {
                setTotalConversations(res.totalConversations)
            }
        }))
    }

    const handleDownload = () => {
        setLoading(true)
        const startFormatted = dayjs(startDate).format("YYYY-MM-DD")
        const endFormatted = dayjs(endDate).format("YYYY-MM-DD")
        downloadDashboardReport(userState.token, startFormatted, endFormatted).then((res => {
            setLoading(false)
        }))
    }

    useEffect(() => {
        const startFormatted = dayjs(startDate).format("YYYY-MM-DD")
        const endFormatted = dayjs(endDate).format("YYYY-MM-DD")
        handleLoadDashboardReport(startFormatted, endFormatted);
    }, [])


    const onChange = (dates: any) => {
        const [start, end] = dates;
        const startFormatted = dayjs(start).format("YYYY-MM-DD")
        setStartDate(start)
        const endFormatted = end ? dayjs(end).format("YYYY-MM-DD") : dayjs(start).format("YYYY-MM-DD")
        setEndDate(end)

        if (null == end) {
            return;
        }

        handleLoadDashboardReport(startFormatted, endFormatted);
    };

    return (
        <>
            <Sidebar />
            <div className="grid grid-cols-12 min-h-full flex-1 bg-slate-50 box rounded-tr-md rounded-br-md border border-gray-200">
                {(userRole && userRole == "3") &&
                    <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 bg-slate-50 border border-gray-200">
                        <div className="box intro-y bg-slate-50 ">
                            <div className="bg-slate-50 sticky top-0 z-40">
                                <div className="flex items-center justify-between px-5 pt-5">
                                    <div className="group relative">
                                        <button >
                                            <IconUnread classes={`w-6 h-6 text-slate-500 ml-auto`} />
                                        </button>
                                        <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Filtrar mensajes no leidos</span>
                                    </div>
                                    <div className="group relative">
                                        <button>
                                            <IconMessage classes="w-6 h-6 text-slate-500 ml-auto" />
                                        </button>
                                        <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Crear nueva conversación</span>
                                    </div>
                                </div>
                                <div className="pb-5 px-5 mt-5">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                                        </div>
                                        <input
                                            type="search"
                                            id="default-search"
                                            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 input-sky"
                                            placeholder="Buscar contacto o celular"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                {
                                    [...Array(0)].map((n, index) => (
                                        <ConversationSkeleton key={index} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }
                {userRole && (userRole == "1" || userRole == "2") &&
                    <>
                        <div className="col-span-6 m-2 mx-5">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Escoge un Rango de fechas
                            </label>
                            <DatePicker
                                disabled={loading}
                                locale={es}
                                selected={startDate}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={onChange}
                                dateFormat="dd/MM/yyyy"
                                selectsRange
                            />
                        </div>
                        <div className="col-span-6 m-2 mx-5">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                Descargar detalles en Excel
                            </label>
                            <button
                                className={`main-button rounded-full flex items-center justify-center mt-2 ${loading ? "opacity-75" : ""}`}
                                onClick={handleDownload}
                                disabled={loading}
                            >
                                {loading ? <IconLoading classes="w-6 h-6 text-slate-100 me-2" /> : <IconDocument classes="w-6 h-6" />}
                                Descargar Excel
                            </button>
                        </div>
                        <div className="col-span-6 m-2">
                            <BotMessagesChart data={botMessagesData} />
                        </div>
                        <div className="col-span-6 m-2">
                            <CampaingMessagesChart data={campaingMessages} />
                        </div>
                        <div className="col-span-6 m-2">
                            <ReceivedMessagesChart data={receivedMessages} />
                        </div>
                        <div className="col-span-6 m-2">
                            <TotalConversationsChart data={totalConversations} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Home;
