import { useEffect, useState } from "react";
import { IconChevron } from "../Icons/IconChevron"
import { IconLogout } from "../Icons/IconLogout";
import useUser from "../../hooks/useUser";
import Link from "next/link";
import { IconMessages } from "../Icons/IconMessages";
import { IconUsers } from "../Icons/IconUsers";
import { IconTag } from "../Icons/IconTag";
import { CompanyPhones } from "@/app/interfaces/user";
import { IconHome } from "../Icons/IconHome";
import { IconPhone } from "../Icons/IconPhone";
import { IconFlow } from "../Icons/IconFlow";
import { IconForward } from "../Icons/IconForward";
import { IconMegaphone } from "../Icons/IconMegaphone";
import { Accordion } from 'flowbite-react';
import "./styles.scss"
import { IconTemplates } from "../Icons/IconTemplates";
import Select, { StylesConfig } from 'react-select';
//@ts-ignore
import chroma from 'chroma-js';
import useActivePhone from "../../hooks/useActivePhone";

interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export const Sidebar = () => {
    const { logoutUser, userState } = useUser();
    const { activePhone, setActivePhone } = useActivePhone();
    const [open, setOpen] = useState(true);
    const [phoneOptions, setPhoneOptions] = useState<ColourOption[]>([]);
    const [defaultPhone, setDefaultPhone] = useState<ColourOption[]>([]);

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

    const getSubMenu = (link: string): any[] => {
        const submenu: any[] = [];

        userState?.company_phones?.map((phone: CompanyPhones) => {
            submenu.push({
                title: `${phone.alias} +${phone.phone}`,
                link: `${link}/${phone.company_phone_id}`,
                active: false,
                show: true
            })
        })

        return submenu
    }

    const [menuItems, setMenuItems] = useState([
        {
            title: "Inicio",
            link: "/pages/home",
            icon: <IconHome classes="w-6 h-6" />,
            show: true,
            active: false
        },
        {
            title: "Usuarios",
            link: "/pages/users",
            icon: <IconUsers classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Campañas",
            link: "/pages/campaigns",
            icon: <IconMegaphone classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Admin. Templates",
            link: "/pages/admin-templates",
            icon: <IconTemplates classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Etiquetas",
            link: "/pages/tags",
            icon: <IconTag classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Teléfonos",
            link: "/pages/phones",
            icon: <IconPhone classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Respuestas rápidas",
            link: "/pages/quick-answers",
            icon: <IconForward classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
        {
            title: "Chats",
            link: "/pages/conversation",
            icon: <IconMessages classes="w-6 h-6" />,
            show: userState.role === "1" || userState.role === "3",
            active: false
        },
        {
            title: "Flujos",
            link: "/pages/templates-flows",
            icon: <IconFlow classes="w-6 h-6" />,
            show: userState.role === "1",
            active: false
        },
    ])

    const handleActiveMenu = (menuTitle: string, subMenuTitle?: string) => {
        setMenuItems((prevMenuItems) =>
            prevMenuItems.map((menuItem) => {
                if (menuItem.title === menuTitle) {
                    if (menuItem.subMenu && subMenuTitle) {
                        const updatedSubMenu = menuItem.subMenu.map((sub) => {
                            if (sub.title === subMenuTitle) {
                                return { ...sub, active: true };
                            } else {
                                return sub;
                            }
                        });

                        return { ...menuItem, subMenu: updatedSubMenu, active: true };
                    } else {
                        return { ...menuItem, active: true };
                    }
                } else {
                    return { ...menuItem, active: false };
                }
            })
        );


        localStorage.setItem('activeMenu', menuTitle);
        if (subMenuTitle) localStorage.setItem('activeSubMenu', subMenuTitle);
    }

    const handleSelectChange = (option: any) => {
        setActivePhone(option.value)
        setDefaultPhone(option)
    }

    useEffect(() => {
        const activeMenu = localStorage.getItem('activeMenu')
        const activeSubMenu = localStorage.getItem('activeSubMenu')

        if (activeMenu) {
            setMenuItems((prevMenuItems) =>
                prevMenuItems.map((menuItem) => {
                    if (menuItem.title === activeMenu) {
                        if (menuItem.subMenu && activeSubMenu) {
                            const updatedSubMenu = menuItem.subMenu.map((sub) => {
                                if (sub.title === activeSubMenu) {
                                    return { ...sub, active: true };
                                } else {
                                    return sub;
                                }
                            });

                            return { ...menuItem, subMenu: updatedSubMenu, active: true };
                        } else {
                            return { ...menuItem, active: true };
                        }
                    } else {
                        return { ...menuItem, active: false };
                    }
                })
            );
        }

        if (userState.company_phones) {
            const options = userState.company_phones.map((item: any) => ({ value: item.company_phone_id, label: `${item.alias} +${item.phone}`, color: "#075985" }));
            const firstPhone = userState?.company_phones ? userState?.company_phones[0]?.company_phone_id : 1;
            const defaultUserPhone = options.filter((option: any) => {
                if (activePhone) return option.value === activePhone
                else option.value === firstPhone        
            });

            setPhoneOptions(options);
            setDefaultPhone(defaultUserPhone);
        }
    }, [userState.company_phones]);

    return (
        <div className={`bg-slate-100 z-50 shadow-sm p-5 pt-8 relative duration-200 h-full rounded-tl-md rounded-bl-md ${open ? "w-72" : "w-20"}`}>
            <button className="p-1 bg-sky-800 text-slate-100 rounded-full absolute -right-3 top-9" onClick={() => setOpen(!open)}>
                <IconChevron classes={`w-6 h-6 duration-200 ${open && "rotate-180"}`} />
            </button>

            {/* <Image
                src={open ? "/images/logo/LogoEF_PERFUMES_Horizontal.png" : "/images/logo/LogoEF_PERFUMES_Vertical.png"}
                width={200}
                height={100}
                className="h-[50px] w-auto"
                alt="Logo EF Perfumes"
            /> */}

            <Select
                closeMenuOnSelect
                value={defaultPhone}
                options={phoneOptions}
                styles={colourStyles}
                onChange={handleSelectChange}
            />

            <hr className="border my-4" />

            <div>
                <ul className="border-b border-gray-300">
                    {menuItems.filter((m) => !m.subMenu).map((menu, index) => {
                        if (menu.show) {
                            return (
                                <li key={`menu-item-${index}`}>
                                    {
                                        menu.link &&
                                        <Link
                                            href={menu.link}
                                            className={
                                                `text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-1 ${menu.active && "bg-sky-800 text-slate-100 hover:text-gray-600"}`
                                            }
                                            onClick={() => handleActiveMenu(menu.title)}
                                        >
                                            <span>{menu.icon}</span>
                                            <span className={`text-base text-sm flex-1 origin-left duration-200 ${!open && "scale-0"}`}>{menu.title}</span>
                                        </Link>
                                    }
                                </li>
                            )
                        }
                    })}

                    <Accordion className="border-none" collapseAll>
                        {menuItems
                            .filter((m) => m.subMenu)
                            .map((menu, index) => menu.show ? (

                                <Accordion.Panel
                                    itemID={`panel-${index}`}
                                    isOpen={menu.active}
                                    key={`item-acc-key-${index}`}
                                >
                                    <Accordion.Title
                                        className={`accordion-button p-0 focus:ring-0 bg-slate-100 rounded-md border-none ${!open ? "hide-arrow" : ""} ${menu.active ? "text-slate-100 bg-sky-800 hover:bg-sky-800" : "hover:bg-slate-200"}`}
                                    >
                                        <span
                                            className={`p-2 flex items-center flex-row gap-3 ${menu.active ? "text-slate-100" : "text-gray-600"} text-base text-sm flex-1 origin-left duration-200`}
                                            onClick={() => {
                                                if (!open) setOpen(!open)
                                            }}
                                        >
                                            <span className="w-6 h-6">{menu.icon}</span>
                                            <span className={`${!open && "scale-0"}`}>{menu.title}</span>
                                        </span>
                                    </Accordion.Title>
                                    {open ? (
                                        <Accordion.Content className="p-2 bg-slate-200">
                                            {menu.subMenu?.map((sub, idx) => (
                                                <Link
                                                    key={`sub-acc-key-${idx}`}
                                                    href={sub.link}
                                                    className={
                                                        `text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-1 ${sub.active && "bg-sky-800 text-slate-100 hover:text-gray-600"}`
                                                    }
                                                    onClick={() => handleActiveMenu(menu.title, sub.title)}
                                                >
                                                    <span className={`text-base text-sm flex-1 origin-left duration-200`}>{sub.title}</span>
                                                </Link>
                                            ))}
                                        </Accordion.Content>
                                    ) : (
                                        <></>
                                    )}
                                </Accordion.Panel>
                            ) : <></>)
                        }
                    </Accordion>
                </ul>

                <button onClick={() => logoutUser()} className="text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-2 w-full">
                    <span><IconLogout classes='w-5 h-5 rotate-180' /></span>
                    <span className={`text-base text-sm flex-1 origin-left duration-200 text-start ${!open && "scale-0"}`}>Cerrar sesión</span>
                </button>
            </div>
        </div>
    )
}