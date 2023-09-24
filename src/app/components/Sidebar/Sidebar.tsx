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

const menuItems = [
    {
        title: "Inicio",
        link: "/pages/home",
        icon: <IconHome classes="w-6 h-6" />
    }
]

export const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const { logoutUser, userState } = useUser();
    const [active, setActive] = useState("");

    function addMenuItemIfNotExists(title: string, link: string, icon: React.JSX.Element) {
        const idx = menuItems.findIndex((item) => item.title === title);
        if (idx === -1) {
            menuItems.push({
                title,
                link,
                icon,
            });
        }
    }

    if (userState.role === "1") {
        addMenuItemIfNotExists("Usuarios", "/pages/users", <IconUsers classes="w-6 h-6" />);
        addMenuItemIfNotExists("Etiquetas", "/pages/tags", <IconTag classes="w-6 h-6" />);
        addMenuItemIfNotExists("Teléfonos", "/pages/phones", <IconPhone classes="w-6 h-6" />);
    }

    useEffect(() => {
        const activeMenu = localStorage.getItem('activeMenu')
        if (activeMenu) {
            setActive(activeMenu)
        } else {
            setActive("Chat")
        }
    }, []);

    useEffect(() => {
        if (userState?.company_phones) {
            userState?.company_phones.map((phone: CompanyPhones) => {
                const idx = menuItems.findIndex((idx) => {
                    return idx.title == `${phone.alias} +${phone.phone}`
                });

                if (idx == -1) {
                    addMenuItemIfNotExists(`${phone.alias} +${phone.phone}`, `/pages/conversation/${phone.company_phone_id}`, <IconTemplates classes="w-6 h-6" />);

                    if (userState.role == "1" || userState.role == "2") {
                        addMenuItemIfNotExists(`${phone.alias} Chatbot`, `/pages/templates-flows/${phone.company_phone_id}`, <IconFlow classes="w-5 h-5" />);
                    }
                }
            })
        }
    }, [menuItems, userState]);

    const handleActiveMenu = (menuTitle: string) => {
        setActive(menuTitle)
        localStorage.setItem('activeMenu', menuTitle);
    }

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
                {menuItems.map((menu, index) => {
                    return (
                        <li key={`menu-item-${index}`}>
                            <Link
                                href={menu.link}
                                className={
                                    `text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-1 ${active === menu.title && "bg-sky-800 text-slate-100 hover:text-gray-600"}`
                                }
                                onClick={() => handleActiveMenu(menu.title)}
                            >
                                <span>{menu.icon}</span>
                                <span className={`text-base text-sm flex-1 origin-left duration-200 ${!open && "scale-0"}`}>{menu.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <button onClick={() => logoutUser()} className="text-gray-600 flex items-center gap-x-3 p-2 hover:bg-gray-200 rounded-md my-2 w-full">
                <span><IconLogout classes='w-5 h-5 rotate-180' /></span>
                <span className={`text-base text-sm flex-1 origin-left duration-200 text-start ${!open && "scale-0"}`}>Cerrar sesión</span>
            </button>
        </div>
    )
}