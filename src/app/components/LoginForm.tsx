'use client';
import { useState, useEffect } from "react"
import { setCookie } from 'nookies';
import { IconUser } from "./Icons/IconUser";
import { IconEye } from "./Icons/IconEye";
import { IconEyeSlash } from "./Icons/IconEyeSlash";
import { IconExclamationCircle } from "./Icons/IconExclamationCircle";
import { IconLoading } from "./Icons/IconLoading";
import { login } from "../services/api";
import useUser from "../hooks/useUser";

export const LoginForm = () => {
    // @ts-ignore
    const { userState, loginUser } = useUser();
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    useEffect(() => {
        if (credentials.username === "" && credentials.password === "") setDisabled(true)
        else setDisabled(false)
    }, [credentials])

    const handleLogin = () => {
        setLoading(true)

        login(credentials)
            .then((res) => {
                if (res.status === 200) {
                    const data: any = res.json()

                    data.then((d: any) => {
                        loginUser({
                            username: credentials.username,
                            token: d.token
                        })

                        if (rememberMe) {
                            setCookie(null, 'remember_token', d.token, {
                                maxAge: 604800,
                                path: '/',
                                secure: true,
                            })
                        }

                        setLoading(false)
                    })
                } else {
                    setError(true)
                }
            })
    }

    return (
        <>
            {error &&
                <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-gray-800 dark:text-red-400" role="alert">
                    <IconExclamationCircle classes="flex-shrink-0 inline w-5 h-5 mr-3" />
                    <span className="sr-only">Info</span>
                    <div>
                        <span className="font-medium font-semibold	">Algo salió mal</span>, verifica los datos.
                    </div>
                </div>
            }

            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconUser classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                    type="text"
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="username"
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
            </div>

            <div className="relative mb-6">
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ?
                        <IconEyeSlash classes="w-5 h-5 text-gray-500 dark:text-gray-400" /> :
                        <IconEye classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    }
                </div>

                <input
                    type={showPassword ? "text" : "password"}
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="password"
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
            </div>

            <div className="text-slate-500 flex text-xs sm:text-sm mt-4">
                <div className="flex items-center mr-auto">
                    <input
                        id="remember-me"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    ></input>
                    <label
                        className="cursor-pointer select-none ml-2"
                        htmlFor="remember-me"
                    >
                        Remember me
                    </label>
                </div>
            </div>

            <div className="mt-5 xl:mt-8 text-center xl:text-left flex justify-center">
                <button
                    type="button"
                    className={"flex text-white focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2  mb-2 focus:outline-none transition ease-in-out delay-150 " + (disabled ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-800")}
                    disabled={disabled}
                    onClick={handleLogin}
                >
                    {loading && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                    Iniciar sesión
                </button>
            </div>
        </>
    )
}