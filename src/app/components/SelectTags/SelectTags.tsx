import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
import useTags from '@/app/hooks/useTags';

interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const SelectTags = ({ handleChange, selectedOptions }: { handleChange: any, selectedOptions?: any }) => {
    const [options, setOptions] = useState<ColourOption[]>([]);
    const { tagsState } = useTags();

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
        if (tagsState.length > 1) {
            tagsState.map((tag: any) => {
                setOptions((prevState: ColourOption[]): ColourOption[] => [
                    ...prevState,
                    { value: tag.id, label: tag.name, color: tag.color },
                ]);
            })
        }
    }, [tagsState])

    return (
        <Select
            closeMenuOnSelect={false}
            defaultValue={selectedOptions ?? []}
            options={options}
            styles={colourStyles}
            onChange={handleChange}
        />
    )
}