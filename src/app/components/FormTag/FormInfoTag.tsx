import { FormField } from "@/app/interfaces/conversations"
import dayjs from "dayjs";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const FormInfoTag = ({tagFormFields, setTagFormFields} : {tagFormFields: FormField[], setTagFormFields: Function}) => {
    const [date, setDate] = useState<Date | null>(null)
    
    const handleTagFormChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, type: "decimal" | "text" | "date") => {
        let value = e.target.value;

        if (type === "decimal") value = value.replace(/\./g, ",");

        if ((type === "decimal" && /^[0-9]*,?[0-9]{0,2}$/.test(value)) || type === "text") {
            setTagFormFields((prevFields: FormField[]) => {
                const updatedFields = [...prevFields];

                updatedFields[index] = {
                  ...updatedFields[index],
                  value,
                };

                return updatedFields;
            });
        }
    }

    const onChangeDate = (date: Date | null, index: number) => {
        const formattedDate = dayjs(date).format("DD/MM/YYYY");
        setDate(date);

        setTagFormFields((prevFields: FormField[]) => {
            const updatedFields = [...prevFields];

            updatedFields[index] = {
              ...updatedFields[index],
              value: formattedDate,
            };

            return updatedFields;
        });
    };

    return (
        <div>
            {tagFormFields.map((field, index) => {
                return (
                    <div className="w-full px-2 mb-6" key={`field-${field.id}`}>
                        <label className="block uppercase tracking-wide text-gray-700 text-xs text-start font-bold mb-2" htmlFor="grid-first-name">
                            <span className="relative">{field.name}</span>
                        </label>

                        {(field.type === "decimal" || field.type === "text") ? 
                            <input
                                type="text"
                                value={tagFormFields[index].value ?? ""}
                                onChange={(e) => handleTagFormChange(e, index, field.type)}
                                placeholder={field.type === "decimal" ? "0,00" : ""}
                                className="w-full relative inline-flex items-center border border-gray-300 rounded-lg p-2.5 text-slate-500 border-gray-300 input-sky"
                            /> : field.type === "date" ?
                                <DatePicker
                                    selected={date}
                                    onChange={(date) => onChangeDate(date, index)}
                                    dateFormat="dd/MM/yyyy"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                                />
                            : null
                        }
                    </div>
                )
            })}
        </div>
    )
}