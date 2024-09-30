import { useState } from "react";
import { getConversations, setMassiveTagsToConversations } from "@/app/services/api";
import { Option } from "@/app/interfaces/selects";
import useUser from "@/app/hooks/useUser";
import { SelectPhones } from "../../Selects/SelectPhones/SelectPhones";
import dayjs from "dayjs";
import DatePicker from "react-datepicker"
import { SelectTags } from "../../Selects/SelectTags/SelectTags";
import { IconLoading } from "../../Icons/IconLoading";
import { IconSearch } from "../../Icons/IconSearch";
import { isColorDark } from "@/app/utils/functions";
import { IconCheck } from "../../Icons/IconCheck";
import { IconChevron } from "../../Icons/IconChevron";

export const MassiveManual = ({ handleShowModal, setAlert }: { handleShowModal: Function, setAlert: Function }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [errorDate, setErrorDate] = useState("");
    const [nextStepDisabled, setNextStepDisabled] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingAssign, setLoadingAssing] = useState(false);
    const [tagToAssign, setTagToAssign] = useState<Option>({} as Option);
    const [scheduleDate, setScheduleDate] = useState(new Date());
    const { userState } = useUser();
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        tags: "",
        limit: "",
        phone: "",
        search: "",
        unread: false
    });
    const [steps, setSteps] = useState([
        { number: 1, label: "Filtrar", current: true, ready: false },
        { number: 2, label: "Seleccionar tags", current: false, ready: false },
        { number: 3, label: "Confirmar", current: false, ready: false },
    ])
    const [conversations, setConversations] = useState({
        ids: "",
        mount: 0,
        searched: false
    });

    const handleSelectChange = (option: any) => {
        const idsString = option.map((option: any) => option.value).join()

        setFilters((prevFilters) => ({ ...prevFilters, tags: idsString }))
    };

    const handleSelectPhoneChange = (option: any) => {
        setFilters((prevFilters) => ({ ...prevFilters, phone: option.value }))
    };

    const handleSelectTagsChange = (option: any) => {
        setTagToAssign(option)
        setNextStepDisabled(false)
    };

    const handleLimitChange = (e: any) => {
        setFilters((prevFilters) => ({ ...prevFilters, limit: e.target.value }))
    };

    const isSearchDisabled = () => {
        if (
            filters.phone !== "" &&
            filters.startDate !== "" &&
            filters.endDate !== ""
        ) return false
        else return true
    }

    const handleNext = () => {
        const currentStep = steps.filter((step) => step.current)[0]

        setSteps((prevSteps) => {
            return prevSteps.map((step) => {
                if (step.number === currentStep.number) {
                    if (currentStep.number !== 3) {
                        if (currentStep.number === 2) setNextStepDisabled(false)
                        else setNextStepDisabled(true)

                        return { ...step, ready: true, current: false };
                    } else {
                        return { ...step, ready: true, current: true }
                    }
                } else if (step.number === currentStep.number + 1) {
                    return { ...step, current: true };
                } else {
                    return step;
                }
            });
        })

        if (steps[2].current) {
            setLoadingAssing(true)

            const conversationsData = {
                conversations: conversations.ids.split(","),
                dispatch_date: dayjs(scheduleDate).format("YYYY-MM-DD HH:mm:ss")
            }

            setMassiveTagsToConversations(
                tagToAssign.value,
                filters.phone,
                userState.token,
                conversationsData
            )
                .then((res) => {
                    setLoadingAssing(false)
                    handleShowModal(false)
                    setAlert({
                        type: "success",
                        message: "Etiquetas asignadas con éxito!",
                        show: true
                    })
                }).catch((err) => {
                    setAlert({
                        type: "error",
                        message: "Algo salió mal, vuelve a intentarlo",
                        show: true
                    })

                    console.log(err)
                })
        }
    };

    const onScheduleChange = (date: any) => {
        setScheduleDate(date)
    }

    const onChange = (dates: any) => {
        const [start, end] = dates;

        if (start && end && dayjs(end).diff(dayjs(start), 'days') > 31) {
            setErrorDate('El rango seleccionado no puede ser mayor a 31 días');
            return;
        }

        const startFormatted = dayjs(start).format("YYYY-MM-DD")
        const endFormatted = end ? dayjs(end).format("YYYY-MM-DD") : dayjs(start).format("YYYY-MM-DD")

        setFilters((prevFilters) => ({ ...prevFilters, startDate: startFormatted, endDate: endFormatted }))
        setErrorDate('');
        setEndDate(end)
        setStartDate(start)
    };

    const handleSearh = () => {
        setLoadingSearch(true);

        setSteps((prevSteps) => {
            return prevSteps.map((step) => ({ ...step, ready: false }));
        })
        setNextStepDisabled(true);

        getConversations(0, filters.limit, filters, userState.token, filters.phone).then((res) => {
            setLoadingSearch(false);

            if (res.conversations && !!res.conversations.length) {
                const ids = res.conversations.map((conversation: any) => conversation.id).join()

                setConversations({
                    ids,
                    mount: res.conversations.length,
                    searched: true
                })

                setNextStepDisabled(false)
            } else {
                setConversations((prev) => ({
                    ...prev,
                    searched: true,
                    mount: 0,
                }))
            }
        })
    }

    return (
        <div className="flex flex-col justify-between h-full items-center">
            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                {
                    steps.map((step, index) => (
                        <li key={`step-${index}`} className={`flex items-center ${step.number !== 3 ? "md:w-full sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10" : ""}`}>
                            <span className="flex flex-col items-center gap-2 after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step.ready ? "bg-green-200" : step.current ? "ring-4 ring-sky-300 bg-slate-300" : "bg-slate-300"}`}>
                                    {step.ready ?
                                        <svg className="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5" />
                                        </svg> :
                                        <span className="font-semibold">{step.number}</span>
                                    }
                                </span>

                                <h3 className="font-sm leading-tight text">{step.label}</h3>
                            </span>
                        </li>
                    ))
                }
            </ol>

            {steps[0].current &&
                <div className="w-full">
                    <div className="flex flex-wrap -mx-3 mb-6 items-center w-full">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                * Teléfono origen
                            </label>
                            <SelectPhones handleChange={handleSelectPhoneChange} />
                        </div>

                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                                * Escoge rango de fechas
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={onChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                dateFormat="dd/MM/yyyy"
                            />
                            <span className="text-xs text-rose-500">{errorDate}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6 items-center w-full">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                Selecciona tags
                            </label>
                            <SelectTags handleChange={handleSelectChange} isMulti />
                        </div>

                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                Limita la cantidad
                            </label>
                            <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                onChange={handleLimitChange}
                            />
                        </div>
                    </div>

                    {(conversations.searched && conversations.mount === 0) ?
                        <div className="mb-4">
                            <span className="bg-yellow-200 p-2 rounded-full">No se han encontrado conversaciones</span>
                        </div> :
                        (conversations.searched && conversations.mount !== 0) ?
                            <div className="mb-4">
                                <span className="bg-green-200 p-2 rounded-full">Conversaciones encontradas: <span className="font-semibold text-green-400">{conversations.mount}</span></span>
                            </div> :
                            null
                    }

                    <div className="flex justify-center items-center flex-col">
                        <small className="block">Los campos con * son obligatorios</small>
                        <button
                            className={`main-button rounded-full flex items-center justify-center mt-2 ${isSearchDisabled() ? "opacity-75" : ""}`}
                            onClick={handleSearh}
                            disabled={isSearchDisabled()}
                        >
                            {loadingSearch ? <IconLoading classes="w-6 h-6 text-slate-100 me-2" /> : <IconSearch classes="w-6 h-6" />}
                            Buscar
                        </button>
                    </div>
                </div>
            }

            {steps[1].current &&
                <div className="w-full">
                    <div className="flex flex-wrap -mx-3 mb-6 items-center w-full">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                Selecciona tag a asignar
                            </label>
                            <SelectTags handleChange={handleSelectTagsChange} />
                        </div>

                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                                Programa el día
                            </label>
                            <DatePicker
                                selected={scheduleDate}
                                onChange={onScheduleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                dateFormat="dd/MM/yyyy HH:mm:ss"
                                showTimeSelect
                            />
                        </div>
                    </div>

                    <span className="block bg-green-200 p-2 rounded-full mt-4">Conversaciones seleccionadas: <span className="font-semibold text-green-400">{conversations.mount}</span></span>
                </div>
            }

            {steps[2].current &&
                <div className="mt-6">
                    <h2>
                        ¿Está seguro que desea asignar a
                        {" "} <span className="font-semibold bg-green-200 text-green-500 p-2 rounded-full">{conversations.mount} {conversations.mount === 1 ? "conversación" : "conversaciones"}</span> {" "}
                        el tag
                        {" "} <span
                            className={`font-semibold p-2 rounded-full ${isColorDark(tagToAssign.color) ? "text-slate-200" : "text-gray-800"}`}
                            style={{ backgroundColor: tagToAssign.color }}
                        >{tagToAssign.label}</span>?
                    </h2>
                </div>
            }

            <div className="border-t border-slate-200 w-full pt-4 mt-4 flex justify-center">
                <button
                    className={`w-[150px] main-button flex items-center justify-between ${nextStepDisabled ? "opacity-75" : ""}`}
                    disabled={nextStepDisabled}
                    onClick={handleNext}
                >
                    {steps[2].current ? "Asignar" : "Siguiente"}
                    {steps[2].current ? loadingAssign ? <IconLoading classes="w-6 h-6 text-slate-100 me-2" /> : <IconCheck classes="w-6 h-6 " /> : <IconChevron classes="w-6 h-6 " />}
                </button>
            </div>
        </div>
    )
}