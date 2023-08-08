import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
// import { ColourOption } from './data';
import { Tag } from '@/app/interfaces/conversations';
import useActiveConversation from "@/app/hooks/useActiveConversation";
import { getTags } from '@/app/services/api';
import useUser from "@/app/hooks/useUser"

interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const SelectTags = () => {
    const [tags, setTags] = useState<Tag[]>([])
    const [options, setOptions] = useState<ColourOption[]>([]);

    // @ts-ignore
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState } = useActiveConversation();
    const colourOptions: readonly ColourOption[] = [
        { value: 1, label: 'Ocean', color: '#00B8D9', isFixed: true },
        { value: 1, label: 'Blue', color: '#0052CC', isDisabled: true },
        { value: 1, label: 'Purple', color: '#5243AA' },
        { value: 1, label: 'Red', color: '#FF5630', isFixed: true },
        { value: 1, label: 'Orange', color: '#FF8B00' },
        { value: 1, label: 'Yellow', color: '#FFC400' },
        { value: 1, label: 'Green', color: '#36B37E' },
        { value: 1, label: 'Forest', color: '#00875A' },
        { value: 1, label: 'Slate', color: '#253858' },
        { value: 1, label: 'Silver', color: '#666666' },
    ];

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
        getTags(userState.token).then((res => {
            res.map((tag: Tag) => {
                setOptions((prevState: ColourOption[]): ColourOption[] => [
                    ...prevState,
                    { value: tag.id, label: tag.name, color: tag.color },
                ]);
            })
        }))
    }, [])

    return (
        <Select
            closeMenuOnSelect={false}
            defaultValue={[]}
            isMulti
            options={options}
            styles={colourStyles}
        />
    )
}