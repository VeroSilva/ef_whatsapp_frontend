import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
import useUser from '@/app/hooks/useUser';

interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const SelectPhones = ({ handleChange }: { handleChange: any }) => {
    const [options, setOptions] = useState<ColourOption[]>([]);
    const { userState } = useUser();

    const colourStyles: StylesConfig<ColourOption, true> = {
        control: (styles) => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            const color = chroma(data.color);

            return {
                ...styles,
                backgroundColor: isDisabled
                    ? undefined
                    : isSelected
                        ? data.color
                        : isFocused
                            ? color.alpha(0.1).css()
                            : undefined,
                color: isDisabled
                    ? '#ccc'
                    : isSelected
                        ? chroma.contrast(color, 'white') > 2
                            ? 'white'
                            : 'black'
                        : data.color,
                cursor: isDisabled ? 'not-allowed' : 'default',
                ':active': {
                    ...styles[':active'],
                    backgroundColor: !isDisabled
                        ? isSelected
                            ? data.color
                            : color.alpha(0.3).css()
                        : undefined,
                },
            };
        },
        multiValue: (styles, { data }) => {
            const color = chroma(data.color);
            return {
                ...styles,
                backgroundColor: color.alpha(0.1).css(),
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            color: data.color,
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: data.color,
            ':hover': {
                backgroundColor: data.color,
                color: 'white',
            },
        }),
    };

    useEffect(() => {
        if (userState.company_phones && !!userState.company_phones.length) {
            userState.company_phones.map((phone: any) => {
                setOptions((prevState: ColourOption[]): ColourOption[] => [
                    ...prevState,
                    { value: phone.company_phone_id, label: `${phone.alias} | ${phone.phone}`, color: "#075985" },
                ]);
            })
        }
    }, [userState])

    return (
        <Select
            closeMenuOnSelect={false}
            options={options}
            styles={colourStyles}
            onChange={handleChange}
        />
    )
}