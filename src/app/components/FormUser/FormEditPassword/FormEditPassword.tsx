import useUser from "@/app/hooks/useUser";
import { editUserPassword } from "@/app/services/api";
import { useState } from "react";
import { IconEye } from "../../Icons/IconEye";
import { IconEyeSlash } from "../../Icons/IconEyeSlash";
import { IconLoading } from "../../Icons/IconLoading";

export const FormEditPassword = ({ handleOpenModal, setAlert, data }: { handleOpenModal: Function, setAlert: Function, data: any }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userState } = useUser();

    const dataIsValid = () => {
        if (password === "" || passwordConfirm === "") return false;
        else return true;
    };

    const handleEditPassword = () => {
        if (!dataIsValid()) setErrorCredentials(true);

        setIsLoading(true)
        editUserPassword({ password }, data.id, userState.token).then((res) => {
            setIsLoading(false)
            handleOpenModal(false)

            if (res.message) {
                setAlert({
                    type: "error",
                    message: res.message,
                    show: true
                })
            } else {
                setAlert({
                    type: "success",
                    message: "Usuario editado con éxito!",
                    show: true
                })
            }
        });
    };

    const handleConfirmBlur = () => {
        if (password !== passwordConfirm) setErrorCredentials(true);
        else setErrorCredentials(false)
    }

    const EditPasswordButton = () => (
        <button
            onClick={handleEditPassword}
            className={
                "main-button transition ease-in-out delay-50 flex mb-8 " +
                (!dataIsValid() ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-sky-700")
            }
            disabled={!dataIsValid()}
        >
            {isLoading && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
            Editar contraseña
        </button>
    );

    return (
        <div className="flex flex-col space-y-4">
            <div className="relative">
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Contraseña"
                    value={password ?? ""}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="relative">
                <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                >
                    {showPasswordConfirm ?
                        <IconEyeSlash classes="w-5 h-5 text-gray-500 dark:text-gray-400" /> :
                        <IconEye classes="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    }
                </div>

                <input
                    type={showPasswordConfirm ? "text" : "password"}
                    id="input-group-1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg input-sky block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                    placeholder="Confirmar contraseña"
                    value={passwordConfirm ?? ""}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onBlur={handleConfirmBlur}
                />
            </div>

            {errorCredentials && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
                    <span className="block sm:inline">Las contraseñas deben coincidir</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorCredentials(false)}>
                        <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            )}

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="second-button mb-8"
                    onClick={() => handleOpenModal(false)}
                >
                    Cancelar
                </button>
                <EditPasswordButton />
            </div>
        </div>
    )
}