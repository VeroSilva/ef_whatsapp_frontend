"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconPlus } from "@/app/components/Icons/IconPlus"
import { IconSettings } from "@/app/components/Icons/IconSettings"
import { IconEdit } from "@/app/components/Icons/IconEdit"
import { IconSearch } from "@/app/components/Icons/IconSearch"
import { IconUserPlus } from "@/app/components/Icons/IconUserPlus"
import { IconEllipsisVertical } from "@/app/components/Icons/IconEllipsisVertical"
import { IconPaperClip } from "@/app/components/Icons/IconPaperClip"
import { IconSend } from "@/app/components/Icons/IconSend"
import useUser from "../../hooks/user/useUser";
import { getChats } from '@/app/services/api';
import { Button } from 'flowbite-react';
import { IconLogout } from '@/app/components/Icons/IconLogout';
import { ItemConversation } from '@/app/components/ItemConversation';

const Chat = () => {
    const router = useRouter();
    // @ts-ignore
    const { userState, logoutUser } = useUser()

    useEffect(() => {
        if (!userState || userState.token === "") {
            router.push('./pages/login');
        }

        getChats(0, 100, userState.token).then((res) => console.log(res))
    }, [userState])
    
    return (
        <div className="w-full min-h-screen p-5 md:p-20 flex items-center justify-center bg-slate-200">
            <div className='absolute top-0 right-0 m-5'>
                <Button onClick={() => logoutUser()}>
                    <IconLogout classes='w-5 h-5 text-white me-2' />
                    Cerrar sesión
                </Button>
            </div>

            {/* <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Chat</h2>
                <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
                <button className="btn btn-primary shadow-md mr-2">
                    <IconPlus classes="w-4 h-4 mr-2" /> Contacts
                </button>
                <button className="btn box">
                    <IconSettings classes="w-4 h-4 mr-2" /> Settings
                </button>
                </div>
            </div> */}
            
            <div className="grid grid-cols-12 gap-5 mt-5">
                {/* BEGIN: Chat Side Menu */}
                <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
                <div className="box intro-y bg-slate-50 rounded-md border border-gray-200 drop-shadow-md">
                    <div className="flex items-center px-5 pt-5">
                    <div className="w-5 h-5 flex items-center justify-center text-xs text-white rounded-full bg-teal-600 font-medium">
                        7
                    </div>
                    <div className="font-medium ml-2">Unread Messages</div>
                        <IconEdit classes="w-6 h-6 text-slate-500 ml-auto" />
                    </div>
                    <div className="pb-5 px-5 mt-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                        </div>
                    </div>
                    <div className="h-[642px] overflow-y-auto scrollbar-hidden">
                    {[...Array(7)].map((conversation) => (
                        <ItemConversation conversation={conversation} />
                    ))}
                    </div>
                </div>
                </div>
                {/* END: Chat Side Menu */}
                {/* BEGIN: Chat Content */}
                <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
                <div className="box intro-y bg-slate-50 rounded-md border border-gray-200 drop-shadow-md">
                    {/* BEGIN: Chat Active */}
                    <div className="h-[768px] flex flex-col">
                    <div className="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4">
                        <div className="flex items-center">
                        <div className="w-16 h-16 flex-none relative">
                            <img
                            alt="Rocketman - HTML Admin Template"
                            className="rounded-full w-16 h-16 object-cover"
                            src="https://picsum.photos/200/300"
                            />
                        </div>
                        <div className="ml-3 mr-auto">
                            <div className="flex items-center">
                            <div className="font-medium text-base">
                                Pepito Peréz
                            </div>
                            <div className="flex items-center px-2 py-0.5 text-xs ml-2 bg-green-100 border border-green-300 text-success rounded-md">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                                Online
                            </div>
                            </div>
                            <div className="mt-0.5 text-slate-500 text-xs sm:text-sm">
                            Project Manager
                            </div>
                        </div>
                        </div>
                        <div className="flex items-center sm:ml-auto mt-5 sm:mt-0 border-t sm:border-0 border-slate-200/60 pt-3 sm:pt-0 -mx-5 sm:mx-0 px-5 sm:px-0">
                        <a href="#" className="w-5 h-5 text-slate-500">
                            <IconSearch classes="w-5 h-5" />
                        </a>
                        <a href="#" className="w-5 h-5 text-slate-500 ml-5">
                            <IconUserPlus classes="w-5 h-5" />
                        </a>
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="overflow-y-scroll scrollbar-hidden px-5 pt-5 flex-1">
                        <div className="flex items-end float-left mb-10">
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative mr-5">
                            <img
                                alt="Rocketman - HTML Admin Template"
                                className="rounded-full w-14 h-14 object-fit"
                                src="https://picsum.photos/200/300"
                            />
                        </div>
                        <div className="-mb-6">
                            <div className="bg-slate-100 border border-slate-200/60 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-md">
                            Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                            2 mins ago
                            </div>
                        </div>
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        </div>
                        <div className="clear-both"></div>
                        <div className="flex items-end float-right mb-10">
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        <div className="-mb-6">
                            <div className="bg-teal-700 px-4 py-3 text-white rounded-md">
                            Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                            1 mins ago
                            </div>
                        </div>
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative ml-5">
                            <img
                                alt="Rocketman - HTML Admin Template"
                                className="rounded-full w-14 h-14 object-fit"
                                src="https://picsum.photos/200/300"
                            />
                        </div>
                        </div>
                        <div className="clear-both"></div>
                        <div className="flex items-end float-right mb-10">
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        <div className="-mb-6">
                            <div className="bg-teal-700 px-4 py-3 text-white rounded-md">
                            Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                            59 secs ago
                            </div>
                        </div>
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative ml-5">
                            <img
                            alt="Rocketman - HTML Admin Template"
                            className="rounded-full w-14 h-14 object-fit"
                            src="https://picsum.photos/200/300"
                            />
                        </div>
                        </div>
                        <div className="clear-both"></div>
                        <div className="text-slate-400 dark:text-slate-500 text-xs text-center mb-10 mt-5">
                        12 June 2020
                        </div>
                        <div className="flex items-end float-left mb-10">
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative mr-5">
                            <img
                            alt="Rocketman - HTML Admin Template"
                            className="rounded-full w-14 h-14 object-fit"
                            src="https://picsum.photos/200/300"
                            />
                        </div>
                        <div className="-mb-6">
                            <div className="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-md">
                            Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                            10 secs ago
                            </div>
                        </div>
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        </div>
                        <div className="clear-both"></div>
                        <div className="flex items-end float-right mb-10">
                        <button id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900" type="button"> 
                            <IconEllipsisVertical classes="w-6 h-6" />
                        </button>

                        <div id="dropdownDots" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                            </li>
                            <li>
                                <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                            </li>
                            </ul>
                            <div className="py-2">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                            </div>
                        </div>
                        <div className="-mb-6">
                            <div className="bg-teal-700 px-4 py-3 text-white rounded-md">
                            Lorem ipsum
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                            1 secs ago
                            </div>
                        </div>
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative ml-5">
                            <img
                            alt="Rocketman - HTML Admin Template"
                            className="rounded-full w-14 h-14 object-fit"
                            src="https://picsum.photos/200/300"
                            />
                        </div>
                        </div>
                        <div className="clear-both"></div>
                        <div className="flex items-end float-left mb-10">
                        <div className="w-14 h-14 hidden sm:block flex-none image-fit relative mr-5">
                            <img
                            alt="Rocketman - HTML Admin Template"
                            className="rounded-full w-14 h-14 object-fit"
                            src="https://picsum.photos/200/300"
                            />
                        </div>
                        <div className="-mb-6">
                            <div className="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-md">
                            Pedrito Perez is typing
                            <span className="typing-dots ml-1">
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="p-5 flex items-center border-t border-slate-200/60 dark:border-darkmode-400">
                        <textarea
                            className="h-[56px] mx-3 w-full form-control h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0"
                            rows={1}
                            placeholder="Type your message..."
                        ></textarea>
                        <div className="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0">

                        <div className="w-4 h-4 sm:w-5 sm:h-5 relative text-slate-500 mr-3 sm:mr-5">
                            <IconPaperClip classes="w-full h-full text-gray-600" />
                            <input
                                type="file"
                                className="w-full h-full top-0 left-0 absolute opacity-0"
                            />
                        </div>
                    </div>

                    <a
                        href="#"
                        className="w-8 h-8 block bg-primary text-white rounded-full flex-none flex items-center justify-center"
                    >
                        <IconSend classes="w-8 h-8 text-teal-600" />
                    </a>
                    </div>
                    </div>
                    {/* END: Chat Active */}
                </div>
                </div>
                {/* END: Chat Content */}
            </div>
        </div>
    )
}

export default Chat