import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
import useChatFilters from "@/app/hooks/useChatFilters";
import useUsersList from "@/app/hooks/useUsersList";

export interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const UsersListSelect = ({ handleChange, selectedOptions, options, isClearable }: { handleChange: any, selectedOptions: ColourOption[], options: ColourOption[], isClearable?: boolean }) => {
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

    //reestructurar para que options suceda aquí

    return (
        <Select
            value={selectedOptions ?? []}
            options={options}
            styles={colourStyles}
            onChange={handleChange}
            isClearable={isClearable ?? false}
            isSearchable
            placeholder={'Seleccione usuario'}
        />
    )
}