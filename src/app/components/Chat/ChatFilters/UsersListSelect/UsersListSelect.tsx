import { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
import useChatFilters from "@/app/hooks/useChatFilters";
import useUsersList from "@/app/hooks/useUsersList";

interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const UsersListSelect = ({ handleChange }: { handleChange: any }) => {
    const { usersListState } = useUsersList();
    const { chatFiltersState } = useChatFilters();
    const [options, setOptions] = useState<ColourOption[]>([]);
    const [selectedUsersOption, setSelectedUsersOption] = useState<any>([])

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

    const handleSelectChange = (selectedOption: ColourOption | null) => {
        setSelectedUsersOption(selectedOption);
        if (handleChange) {
            handleChange(selectedOption ? selectedOption.value : null);
        }
    };

    return (
        <Select
            value={selectedUsersOption ?? []}
            options={options}
            styles={colourStyles}
            onChange={handleSelectChange}
            isClearable
            isSearchable
        />
    )
}