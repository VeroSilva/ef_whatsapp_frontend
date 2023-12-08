import { useEffect, useState } from "react";
import { IconChevron } from "../Icons/IconChevron"
import { IconLogout } from "../Icons/IconLogout";
import useUser from "../../hooks/useUser";
import Link from "next/link";
import { IconTemplates } from "../Icons/IconTemplates";
import { IconUsers } from "../Icons/IconUsers";
import { IconTag } from "../Icons/IconTag";
import Image from "next/image";
import { CompanyPhones } from "@/app/interfaces/user";
import { IconHome } from "../Icons/IconHome";
import { IconPhone } from "../Icons/IconPhone";
import { IconFlow } from "../Icons/IconFlow";
import { IconForward } from "../Icons/IconForward";
import { Accordion } from 'flowbite-react';

export const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const { logoutUser, userState } = useUser();

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
            icon: <IconForward classes="w-6 h-6" />,
            subMenu: getSubMenu("/pages/quick-answers"),
            open: false,
            show: true,
            active: false
        },
        {
            title: "Chats",
            icon: <IconTemplates classes="w-6 h-6" />,
            subMenu: getSubMenu("/pages/conversation"),
            open: false,
            show: true,
            active: false
        },
        {
            title: "Flujos",
            icon: <IconFlow classes="w-6 h-6" />,
            subMenu: getSubMenu("/pages/templates-flows"),
            open: false,
            show: true,
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
    }, []);

    return (
        <div className={`bg-slate-100 z-50 shadow-sm p-5 pt-8 relative duration-200 h-full rounded-tl-md rounded-bl-md ${open ? "w-72" : "w-20"}`}>
            <button className="p-1 bg-sky-800 text-slate-100 rounded-full absolute -right-3 top-9" onClick={() => setOpen(!open)}>
                <IconChevron classes={`w-6 h-6 duration-200 ${open && "rotate-180"}`} />
            </button>

            <Image
                src={open ? "/images/logo/LogoEF_PERFUMES_Horizontal.png" : "/images/logo/LogoEF_PERFUMES_Vertical.png"}
                width={200}
                height={100}
                className="h-[50px] w-auto"
                alt="Logo EF Perfumes"
            />

            <ul className="mt-8 border-b border-gray-300">
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
                        .map((menu, index) => (
                            <Accordion.Panel itemID={`panel-${index}`} isOpen={menu.active} key={`item-acc-key-${index}`}>
                                <Accordion.Title className={`p-2 focus:ring-0 bg-slate-100 rounded-md border-none ${menu.active ? "text-slate-100 bg-sky-800 hover:bg-sky-800" : "hover:bg-slate-200"}`}>
                                    <span className={`flex items-center flex-row gap-3 ${menu.active ? "text-slate-100" : "text-gray-600"} text-base text-sm flex-1 origin-left duration-200 ${!open && "scale-0"}`}>
                                        {menu.icon} {menu.title}
                                    </span>
                                </Accordion.Title>
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
                            </Accordion.Panel>
                        ))
                    }
                </Accordion>
            </ul>

            <button onClick={() => logoutUser()} className="text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-2 w-full">
                <span><IconLogout classes='w-5 h-5 rotate-180' /></span>
                <span className={`text-base text-sm flex-1 origin-left duration-200 text-start ${!open && "scale-0"}`}>Cerrar sesión</span>
            </button>
        </div>
    )
}