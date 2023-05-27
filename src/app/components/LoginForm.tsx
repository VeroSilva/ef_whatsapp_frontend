'use client';
import {useState} from "react"
import { IconEmail } from "./Icons/IconEmail";
import { IconEye } from "./Icons/IconEye";
import { IconEyeSlash } from "./Icons/IconEyeSlash";

export const LoginForm = () => {
    const [ showPassword, setShowPassword ] = useState(true)

    return (
        <>
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <IconEmail classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input type="text" id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="email" />
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

                <input type={showPassword ? "text" : "password"} id="input-group-1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500" placeholder="password" />
            </div>

            <div className="text-slate-500 flex text-xs sm:text-sm mt-4">
                <div className="flex items-center mr-auto">
                    <input id="remember-me" type="checkbox" value="" className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                    <label
                        className="cursor-pointer select-none ml-2"
                        htmlFor="remember-me"
                    >
                        Remember me
                    </label>
                </div>
            </div>

            <div className="mt-5 xl:mt-8 text-center xl:text-left flex justify-center">
                <button type="button" className="text-white bg-teal-600 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2  mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800">Iniciar sesión</button>
            </div>
        </>
    )
}