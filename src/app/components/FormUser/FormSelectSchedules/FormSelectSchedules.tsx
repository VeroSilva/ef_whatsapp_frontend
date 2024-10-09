import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select, { MultiValue } from "react-select";

type DayOption = {
    label: string;
    value: string;
};

type Schedule = {
    days: string[];
    startTime: string | null;
    endTime: string | null;
};

export const FormSelectSchedules = ({
    scheduleGroup, setScheduleGroup
} : {
    scheduleGroup: Schedule[],
    setScheduleGroup: React.Dispatch<React.SetStateAction<Schedule[]>>
}) => {
    const [selectedDays, setSelectedDays] = useState<MultiValue<DayOption>>([]);
    const [startTime, setStartTime] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<string | null>(null);
    const initialDaysOptions: DayOption[] = [
        { label: "Lunes", value: "Lunes" },
        { label: "Martes", value: "Martes" },
        { label: "Miércoles", value: "Miércoles" },
        { label: "Jueves", value: "Jueves" },
        { label: "Viernes", value: "Viernes" },
        { label: "Sábado", value: "Sábado" },
        { label: "Domingo", value: "Domingo" }
    ];
    const [daysOptions, setDaysOptions] = useState<DayOption[]>(initialDaysOptions); 
    const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    const handleTimeChange = (date: Date | null, setTime: React.Dispatch<React.SetStateAction<string | null>>) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
        } else {
            setTime(null);
        }
    };

    const timeToDate = (time: string | null): Date | null => {
        if (!time) return null;
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date instanceof Date && !isNaN(date.getTime()) ? date : null;
    };

    const removeSchedule = (index: number) => {
        const removedSchedule = scheduleGroup[index];
        setScheduleGroup((prev) => prev.filter((_, i) => i !== index));
    
        const restoredDaysOptions = [
          ...daysOptions,
          ...removedSchedule.days.map(day => ({ label: day, value: day } as DayOption))
        ];
    
        const orderedDaysOptions = restoredDaysOptions.sort((a, b) => {
          return daysOrder.indexOf(a.value) - daysOrder.indexOf(b.value);
        });
    
        setDaysOptions(orderedDaysOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        const newSchedule: Schedule = {
            days: selectedDays.map(day => day.value),
            startTime,
            endTime
        };

        setScheduleGroup((prevScheduleGroup) => [...prevScheduleGroup, newSchedule]);

        const filteredDaysOptions = daysOptions.filter(dayOption =>
            !selectedDays.some(selectedDay => selectedDay.value === dayOption.value)
        );

        setDaysOptions(filteredDaysOptions);

        setStartTime(null);
        setEndTime(null);
        setSelectedDays([]);
    };

    const isValidForm = () => {
        if (
            !!selectedDays.length &&
            startTime &&
            endTime
        ) return true
        else return false
    }

    return (
        <form onSubmit={handleSubmit}>
            {!!scheduleGroup.length &&
                <div className="border rounded px-4 py-2 my-2 bg-gray-100 shadow-sm">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Horarios seleccionados</label>

                    {scheduleGroup.map((schedule, index) => {
                        const days = schedule.days.join(', ');

                        return (
                            <div key={index} className="bg-gray-50 mt-2 mb-4 p-2 rounded-sm shadow-sm grid grid-cols-12">
                                <span className="text-sm text-start col-span-9">
                                {days} desde {schedule.startTime} hasta {schedule.endTime}
                                </span>

                                <button
                                onClick={() => removeSchedule(index)}
                                className="ml-4 bg-red-200 text-red-900 text-xs px-2 py-1 rounded col-span-3"
                                >
                                    Eliminar
                                </button>
                            </div>
                        );
                    })}
                </div>
            }

            {!!daysOptions.length &&
                <>
                    <Select
                        isMulti
                        options={daysOptions}
                        value={selectedDays}
                        onChange={setSelectedDays}
                        placeholder="Días laborales"
                        className="text-gray-900 text-sm text-start"
                    />

                    <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-6">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Hora inicio: </label>
                            <DatePicker
                                selected={timeToDate(startTime)}
                                onChange={(date) => handleTimeChange(date, setStartTime)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Start Time"
                                dateFormat="h:mm aa"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                            />
                        </div>
                        <div className="col-span-6">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold">Hora fin: </label>
                            <DatePicker
                                selected={timeToDate(endTime)} // Usamos timeToDate para convertirlo en una instancia de Date
                                onChange={(date) => handleTimeChange(date, setEndTime)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="End Time"
                                dateFormat="h:mm aa"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className={"main-button transition ease-in-out delay-50 flex mt-4 " + (!isValidForm() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")}
                            disabled={!isValidForm()}
                        >
                            Agregar horario
                        </button>
                    </div>
                </>
            }
        </form>
    );
};
