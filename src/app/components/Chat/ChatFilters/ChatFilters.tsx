import { useEffect, useState } from "react"
import { Modal } from "@/app/components/Modal/Modal";
import { IconFilter } from "../../Icons/IconFilter";
import { SelectTags } from "../../Selects/SelectTags/SelectTags";
import dayjs from "dayjs";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import useChatFilters from "@/app/hooks/useChatFilters";
import { INITIAL_STATE } from "@/app/context/chatFilters/ChatFiltersProvider";
import { IconUnread } from "../../Icons/IconUnread";
import { IconWarning } from "../../Icons/IconWarning";
import "./styles.scss"
import { ColourOption, UsersListSelect } from "./UsersListSelect/UsersListSelect";
import useUser from "@/app/hooks/useUser";
import useUsersList from "@/app/hooks/useUsersList";

export const ChatFilters = ({ handleLoadConversations }: { handleLoadConversations: Function }) => {
    const { chatFiltersState, setChatFiltersState, chatFiltersActive } = useChatFilters();
    const { userState } = useUser();
    const { usersListState } = useUsersList();
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errorDate, setErrorDate] = useState("");
    const [options, setOptions] = useState<ColourOption[]>([]);
    const [selectedUsersOption, setSelectedUsersOption] = useState<any>([]);

    const handleSelectChange = (options: any) => {
        setChatFiltersState({ ...chatFiltersState, tags: options })
    };

    const handleSelectUsersChange = (selectedOption: ColourOption | null) => {
        setSelectedUsersOption(selectedOption);

        setChatFiltersState({ ...chatFiltersState, user_assigned_id: selectedOption ? selectedOption.value : null });
    };

    const onChangeDate = (dates: any) => {
        const [start, end] = dates;

        if (start && end && dayjs(end).diff(dayjs(start), 'days') > 31) {
            setErrorDate('El rango seleccionado no puede ser mayor a 31 días');
            return;
        }

        const startFormatted = dayjs(start).format("YYYY-MM-DD");
        const endFormatted = end ? dayjs(end).format("YYYY-MM-DD") : dayjs(start).format("YYYY-MM-DD");

        setChatFiltersState({ ...chatFiltersState, startDate: startFormatted, endDate: endFormatted })
        setErrorDate('');
        setEndDate(end);
        setStartDate(start);
    };

    const handleUnread = () => {
        const unreadValue = !chatFiltersState.unread;

        setChatFiltersState({ ...chatFiltersState, unread: unreadValue })
    };

    const handleOverdue = () => {
        const overdueValue = !chatFiltersState.overdue;

        setChatFiltersState({ ...chatFiltersState, overdue: overdueValue })
    };

    const handleFiltersApplied = () => {
        handleLoadConversations()
        setShowFilterModal(false)
    };

    const handleCleanFilters = () => {
        setChatFiltersState(INITIAL_STATE)
        setShowFilterModal(false)
        handleLoadConversations()
    }

    const handleClearDates = () => {
        setStartDate(null);
        setEndDate(null);

        setChatFiltersState({ ...chatFiltersState, startDate: null, endDate: null })
    }

    useEffect(() => {
        if (usersListState && usersListState.length > 0) {
            const userOptions = usersListState.map((user: any) => ({
                value: user.id,
                label: user.username,
                color: "#075985",
            }));
            setOptions(userOptions);
        }
    }, [usersListState]);

    useEffect(() => {
        if (options.length > 0 && chatFiltersState.user_assigned_id) {
            const current = options.find(
                (opt) => opt.value === Number(chatFiltersState.user_assigned_id)
            );
            setSelectedUsersOption(current || null);
        }
    }, [chatFiltersState.user_assigned_id, options]);

    return (
        <>
            <button onClick={() => setShowFilterModal(true)} className={`relative flex items-center gap-1 text-sm text-gray-500 border rounded-2xl py-1 px-2 ${chatFiltersActive ? "text-sky-600 border-sky-500" : "text-slate-500 border-slate-500"}`}>
                <IconFilter classes="w-4 h-4 ml-auto" />
                <span>Filtros</span>
                {chatFiltersActive &&
                    <>
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-sky-500"></div>
                    </>
                }
            </button>

            <Modal
                title="Filtros de conversaciones"
                onClose={() => setShowFilterModal(false)}
                show={showFilterModal}
                width="600px"
            >
                <div className='h-[400px] flex flex-col justify-between items-center'>
                    <div className="flex flex-wrap mb-6 items-center w-full justify-center gap-6">
                        <div className="flex w-full">
                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    <span className="relative">
                                        Etiquetas activas

                                        {!!chatFiltersState.tags.length ? (
                                            <>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500"></div>
                                            </>
                                        ) : null}
                                    </span>
                                </label>
                                <SelectTags handleChange={handleSelectChange} selectedOptions={chatFiltersState.tags} isMulti />
                            </div>

                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    <span className="relative">
                                        Escoge rango de fechas

                                        {(chatFiltersState.stardDate || chatFiltersState.endDate) ? (
                                            <>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500"></div>
                                            </>
                                        ) : null}
                                    </span>

                                </label>

                                <div className="relative">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={onChangeDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        selectsRange
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecciona un rango de fechas"
                                    />

                                    {(chatFiltersState.stardDate || chatFiltersState.endDate) ? (
                                        <button
                                            className="h-5 w-5 bg-slate-100 text-slate-500 rounded-full absolute right-2 top-0 bottom-0 m-auto text-sm"
                                            onClick={handleClearDates}
                                        >x</button>
                                    ) : null}
                                </div>
                                <span className="text-xs text-rose-500 block">{errorDate}</span>
                            </div>
                        </div>

                        <div className="flex w-full">
                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    <span className="relative">
                                        Chats sin leer

                                        {chatFiltersState.unread ? (
                                            <>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500"></div>
                                            </>
                                        ) : null}
                                    </span>
                                </label>

                                <button
                                    className={`w-full relative inline-flex items-center justify-center cursor-pointer border rounded-lg p-2.5 text-center ${chatFiltersState.unread ? 'text-sky-600 border-sky-600' : 'text-slate-500 border-gray-300'}`}
                                    onClick={handleUnread}
                                >
                                    <IconUnread classes="w-5 h-5" />
                                    <span className="ms-1 text-sm font-medium">Sin leer</span>
                                </button>
                            </div>

                            <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                    <span className="relative">
                                        Chats con recontacto

                                        {chatFiltersState.overdue ? (
                                            <>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                                                <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500"></div>
                                            </>
                                        ) : null}
                                    </span>
                                </label>

                                <button
                                    className={`w-full relative inline-flex items-center justify-center cursor-pointer border border-gray-300 rounded-lg p-2.5 text-center ${chatFiltersState.overdue ? 'text-sky-600 border-sky-600' : 'text-slate-500 border-gray-300'}`}
                                    onClick={handleOverdue}
                                >
                                    <IconWarning classes="w-4 h-4" />
                                    <span className="ms-1 text-sm font-medium">Necesita recontacto</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex w-full">
                            {(userState.role === "1" && !!usersListState.length) ?
                                <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                        <span className="relative">
                                            Usuario asignado

                                            {chatFiltersState.user_assigned_id ? (
                                                <>
                                                    <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500 animate-ping"></div>
                                                    <div className="absolute top-0 -right-2 w-2 h-2 rounded-full bg-sky-500"></div>
                                                </>
                                            ) : null}
                                        </span>
                                    </label>

                                    <UsersListSelect handleChange={handleSelectUsersChange} selectedOptions={selectedUsersOption} options={options} isClearable />
                                </div>
                                : null
                            }
                        </div>
                    </div>

                    <div className="sticky bottom-0 flex items-center gap-2 bg-slate-50">
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