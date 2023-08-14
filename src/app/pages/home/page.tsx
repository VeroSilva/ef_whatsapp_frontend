"use client"
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Chat } from '@/app/components/Chat/Chat';
import { ConversationSkeleton } from "../../components/Skeleton/Conversation";
import { IconUnread } from "../../components/Icons/IconUnread"
import { IconMessage } from "../../components/Icons/IconMessage"
import { IconSearch } from "../../components/Icons/IconSearch"
import useUser from "@/app/hooks/useUser";
import { useRouter } from 'next/navigation';

const Home = (): JSX.Element => {
    const router = useRouter();
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) router.push('/pages/login');

    return (
        <>
            <Sidebar />
            <div className="grid grid-cols-12 h-full flex-1">
                {/* BEGIN: Chat Side Menu */}
                <div className="left-side col-span-12 xl:col-span-4 2xl:col-span-3 overflow-auto min-h-full bg-slate-50 border border-gray-200">
                    <div className="box intro-y bg-slate-50 ">
                        <div className="bg-slate-50 sticky top-0 z-40">
                            <div className="flex items-center justify-between px-5 pt-5">
                                <div className="group relative">
                                    <button >
                                        <IconUnread classes={`w-6 h-6 text-slate-500 ml-auto`} />
                                    </button>
                                    <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Filtrar mensajes no leidos</span>
                                </div>
                                <div className="group relative">
                                    <button>
                                        <IconMessage classes="w-6 h-6 text-slate-500 ml-auto" />
                                    </button>
                                    <span className="z-50 whitespace-nowrap fixed top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Crear nueva conversación</span>
                                </div>
                            </div>
                            <div className="pb-5 px-5 mt-5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 input-sky"
                                        placeholder="Buscar contacto o celular"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            {
                                [...Array(0)].map((n, index) => (
                                    <ConversationSkeleton key={index} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <Chat />
            </div>
        </>
    )
}

export default Home;
