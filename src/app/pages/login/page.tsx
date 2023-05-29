"use client"

import { useEffect } from 'react'
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';
import { LoginForm } from "@/app/components/LoginForm"
import useUser from "../../hooks/user/useUser";

const Login = () => {
    const router = useRouter();
    const cookies = parseCookies();
    // @ts-ignore
    const { userState } = useUser();

    useEffect(() => {
        if (userState && userState.token || cookies.remember_token) {
            router.push('./pages/chat')
        }
    }, [userState])

    return (
        <div className="w-full min-h-screen p-5 md:p-20 flex items-center justify-center bg-teal-100">
            <div className="w-96 intro-y">
                <div className="text-teal-950 text-2xl font-medium text-center">
                    Inicia sesión
                </div>
                <div className="relative">
                    <div className="box bg-slate-200 rounded-md px-5 py-8 mt-10 max-w-[450px] relative z-[1]">
                        <LoginForm />
                    </div>
                    <div className="w-[95%] h-full bg-teal-200 border border-teal-200 absolute top-0 rounded-lg mx-auto inset-x-0 mt-6 ml-10"></div>
                </div>
            </div>
        </div>
    )
}

export default Login