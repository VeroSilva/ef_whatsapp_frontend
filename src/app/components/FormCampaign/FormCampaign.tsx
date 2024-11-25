import { useEffect, useState } from "react";
import { createCampaign, editCampaign, getUsers } from "@/app/services/api";
import useUser from "../../hooks/useUser"
import { IconLoading } from "../Icons/IconLoading";
import Select, { StylesConfig } from "react-select";
import { CampaignUser, Campaing, ColourOption } from "@/app/interfaces/campaign";
//@ts-ignore
import chroma from 'chroma-js';
import { User } from "@/app/interfaces/user";
import { SelectTags } from "../Selects/SelectTags/SelectTags";

export const FormCampaign = ({ type, setAlert, handleLoadCampaigns, handleOpenModal, data }: { type: string, setAlert: Function, handleLoadCampaigns: Function, handleOpenModal: Function, data?: any }) => {
    const { userState } = useUser();
    const [errorCampaign, setErrorCampaign] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [usersOptions, setUsersOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState<ColourOption[]>([]);
    const [selectedOptionById, setSelectedOptionById] = useState<number | null>(null);
    const [dataCampaign, setDataCampaign] = useState<Campaing>({
        id_campaign: "",
        users: [],
        tag_id: null
    });
    const [selectedTag, setSelectedTag] = useState<ColourOption>({} as ColourOption);

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
        if (data && !!usersOptions.length) {
            const { id_campaign, users, tag_id} = data;
            const usersIds = users.map((user: CampaignUser) => user.id);
            const currentOptions = usersOptions.filter((item : ColourOption) => usersIds.includes(item.value));

            setDataCampaign({
                ...dataCampaign,
                id_campaign,
                users: usersIds,
                tag_id
            });

            setSelectedOptionById(tag_id);
            setSelectedOptions(currentOptions);
        }
    }, [data, usersOptions]);


    useEffect(() => {
        getUsers(userState.token).then((res => {
            const options = res.map((user: User) => ({ value: user.id, label: user.username, color: "#0369a1" }))
            setUsersOptions(options);
        }))
    }, [])

    const dataIsValid = () => {
        if (dataCampaign.id_campaign === "" || !dataCampaign.users.length ) return false;
        else return true;
    };

    const handleCreateCampaign = () => {
        if (!dataIsValid()) setErrorCampaign(true);
        else {
            setLoadingCreate(true)

            if (type === "create") {
                createCampaign(dataCampaign, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadCampaigns()
                        setAlert({
                            type: "success",
                            message: "Campaña creada con éxito!",
                            show: true
                        })
                    }
                });
            } else {
                editCampaign(dataCampaign, data.id, userState.token).then((res) => {
                    setLoadingCreate(false)
                    handleOpenModal(false)

                    if (res.message) {
                        setAlert({
                            type: "error",
                            message: res.message,
                            show: true
                        })
                    } else {
                        handleLoadCampaigns()
                        setAlert({
                            type: "success",
                            message: "Campaña editada con éxito!",
                            show: true
                        })
                    }
                });
            }
        };
    };

    const handleChange = (options: ColourOption[]) => {
        const usersIDs  = options.map((option: ColourOption) => option.value);

        setDataCampaign({...dataCampaign, users: usersIDs});
        setSelectedOptions(options);
    }

    const handleSelectChange = (option: ColourOption) => {
        setDataCampaign({...dataCampaign, tag_id: option.value});
        setSelectedTag(option);
    };

    const CreateTagButton = () => (
        <button
            onClick={handleCreateCampaign}
            className={
                "main-button transition ease-in-out delay-50 flex mb-8 " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {loadingCreate && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            {type === "create" ? "Crear" : "Editar"} Campaña
        </button>
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
                <label className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2" htmlFor="grid-first-name">
                    ID Campaña
                </label>

                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full p-2.5"
                    placeholder="ID Campaña"
                    value={dataCampaign.id_campaign ?? ""}
                    onChange={(e) => setDataCampaign({ ...dataCampaign, id_campaign: e.target.value })}
                />
            </div>

            <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2" htmlFor="grid-first-name">
                    Usuarios
                </label>

                <Select
                    closeMenuOnSelect={false}
                    value={selectedOptions}
                    options={usersOptions}
                    styles={colourStyles}
                    //@ts-ignore
                    onChange={handleChange}
                    isMulti
                    placeholder="Seleccione uno o varios usuarios"
                    className="text-start text-sm"
                />
            </div>

            <div>
                <label className="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold mb-2" htmlFor="grid-first-name">
                    Etiqueta relacionada
                </label>
                
                <SelectTags handleChange={handleSelectChange} selectedOptions={selectedTag} setSelectedOptions={setSelectedTag} selectedOptionById={selectedOptionById} />
            </div>

            {errorCampaign && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <strong className="font-bold">Ocurrió un error,</strong>{" "}
                    <span className="block sm:inline">revise los datos y envie nuevamente</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorCampaign(false)}>
                        <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            )}

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button"
                    onClick={() => handleOpenModal(false)}
                >
                    Cancelar
                </button>
                <CreateTagButton />
            </div>
        </div>
    )
}