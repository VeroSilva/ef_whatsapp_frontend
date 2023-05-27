import { LoginForm } from "@/app/components/LoginForm"

const Login = () => {
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