import { useState } from "react"
import { Modal } from "@/app/components/Modal/Modal";
import { IconFilter } from "../../Icons/IconFilter";
import { SelectTags } from "../../Selects/SelectTags/SelectTags";
import dayjs from "dayjs";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import useChatFilters from "@/app/hooks/useChatFilters";
import { INITIAL_STATE } from "@/app/context/chatFilters/ChatFiltersProvider";

export const ChatFilters = ({ handleLoadConversations }: { handleLoadConversations: Function }) => {
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [errorDate, setErrorDate] = useState("");
    const { chatFiltersState, setChatFiltersState, chatFiltersActive } = useChatFilters();

    const handleSelectChange = (options: any) => {
        setChatFiltersState({ ...chatFiltersState, tags: options })
    };

    const onChangeDate = (dates: any) => {
        const [start, end] = dates;

        if (start && end && dayjs(end).diff(dayjs(start), 'days') > 31) {
            setErrorDate('El rango seleccionado no puede ser mayor a 31 días');
            return;
        }

        const startFormatted = dayjs(start).format("YYYY-MM-DD")
        const endFormatted = end ? dayjs(end).format("YYYY-MM-DD") : dayjs(start).format("YYYY-MM-DD")

        setChatFiltersState({ ...chatFiltersState, startDate: startFormatted, endDate: endFormatted })
        setErrorDate('');
        setEndDate(end)
        setStartDate(start)
    };

    const handleUnread = (event: any) => {
        setChatFiltersState({ ...chatFiltersState, unread: event?.target.checked })
    };

    const handleOverdue = (event: any) => {
        setChatFiltersState({ ...chatFiltersState, overdue: event?.target.checked })
    };

    const handleFiltersApplied = () => {
        handleLoadConversations()
        setShowFilterModal(false)
    };

    const handleCleanFilters = () => {
        setChatFiltersState(INITIAL_STATE)
        setShowFilterModal(false)
    }

    return (
        <>
            <button onClick={() => setShowFilterModal(true)} className="relative">
                <IconFilter classes={`w-6 h-6 ml-auto ${chatFiltersActive ? "text-sky-600" : "text-slate-500"} `} />
                {chatFiltersActive &&
                    <>
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-sky-500"></div>
                    </>}
            </button>

            <Modal
                title="Filtros de conversaciones"
                onClose={() => setShowFilterModal(false)}
                show={showFilterModal}
                width="600px"
            >
                <div className='h-[400px] flex flex-col justify-between items-center'>
                    <div className="flex flex-wrap mb-6 items-center w-full justify-center gap-2">
                        <div className="flex w-full">
                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Etiquetas activas
                                </label>
                                <SelectTags handleChange={handleSelectChange} selectedOptions={chatFiltersState.tags} isMulti />
                            </div>

                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    Escoge rango de fechas
                                </label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChangeDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <span className="text-xs text-rose-500 block">{errorDate}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" onChange={(e) => handleUnread(e)} checked={chatFiltersState.unread} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                                <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Sin leer</span>
                            </label>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" onChange={(e) => handleOverdue(e)} checked={chatFiltersState.overdue} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                                <span className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300">Necesita recontacto</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className='border border-sky-800 text-sky-800 rounded-md text-sm px-4 py-2 transition ease-in-out delay-50 flex'
                            onClick={handleCleanFilters}
                        >
                            Limpiar filtros
                        </button>

                        <button
                            className='main-button transition ease-in-out delay-50 flex'
                            onClick={handleFiltersApplied}
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}