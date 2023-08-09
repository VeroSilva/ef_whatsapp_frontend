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

const menuItems = [
    {
        title: "Inicio",
        link: "/pages/home",
        icon: <IconUsers classes="w-6 h-6" />
    },
    {
        title: "Usuarios",
        link: "/pages/users",
        icon: <IconUsers classes="w-6 h-6" />
    },
    {
        title: "Etiquetas",
        link: "/pages/tags",
        icon: <IconTag classes="w-6 h-6" />
    }
]

export const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const { logoutUser, userState } = useUser();
    const [active, setActive] = useState("");

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
                    return idx.title == `+${phone.phone}`
                });
                if (idx == -1) {
                    menuItems.push(
                        {
                            title: `+${phone.phone}`,
                            link: `/pages/conversation/${phone.company_phone_id}`,
                            icon: <IconTemplates classes="w-6 h-6" />,
                        }
                    )
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