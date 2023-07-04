"use client"

import { useEffect } from 'react'
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { LoginForm } from "@/app/components/LoginForm"
import useUser from "../../hooks/useUser";
import Image from "next/image";

const Login = () => {
    const router = useRouter();
    const cookies = parseCookies();
    // @ts-ignore
    const { userState } = useUser();

    useEffect(() => {
        if (userState && userState.token) {
            router.push('./pages/conversation')
        }
    }, [userState])

    return (
        <div className="w-full min-h-screen p-5 md:p-20 flex items-center justify-center">
            <div className="w-96 intro-y">
                <div className="flex items-center flex-col text-blue-950 text-lg font-medium text-center">
                    <Image
                        src={"/images/logo/LogoEF_PERFUMES_Horizontal.png"}
                        width={250}
                        height={100}
                        className="h-[50px] duration-200"
                        alt="Logo EF Perfumes"
                    />
                    Inicia sesión
                </div>
                <div className="relative">
                    <div className="box bg-slate-200 rounded-md px-5 py-8 mt-10 max-w-[450px] relative z-[1]">
                        <LoginForm />
                    </div>
                    <div className="w-[95%] h-full bg-sky-800 border border-sky-500 absolute top-0 rounded-lg mx-auto inset-x-0 mt-6 ml-10"></div>
                </div>
            </div>
        </div>
    )
}

export default Login