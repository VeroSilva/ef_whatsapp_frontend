import { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css'
import { MassiveManual } from "./MassiveManual/MassiveManual";
import { MassiveFile } from "./MassiveFile/MassiveFile";
import "./styles.scss"

export const MassiveAssigment = ({ handleShowModal, setAlert }: { handleShowModal: Function, setAlert: Function }) => {
    const [activeTab, setActiveTab] = useState("manual");

    return (
        <div>
            <ul className="text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex w-1/2 m-auto mb-4">
                <button className="w-full" onClick={() => setActiveTab("manual")}>
                    <span className={`inline-block w-full p-4 border-r border-gray-200 font-semibold rounded-s-lg focus:ring-4 focus:ring-sky-500 focus:outline-none transition-all duration-200 ease-in-out ${activeTab === "manual" ? "bg-sky-800 text-slate-100" : "bg-gray-150"}`}>Manual</span>
                </button>
                <button className="w-full" onClick={() => setActiveTab("file")}>
                    <span className={`inline-block w-full p-4 border-s-0 border-gray-200 font-semibold rounded-e-lg focus:ring-4 focus:outline-none focus:ring-sky-500 transition-all duration-200 ease-in-out ${activeTab === "file" ? "bg-sky-800 text-slate-100" : "bg-gray-150"}`}>Archivo</span>
                </button>
            </ul>

            {activeTab === "manual" ?
                <MassiveManual handleShowModal={handleShowModal} setAlert={setAlert} /> :
                activeTab === "file" ?
                    <MassiveFile handleShowModal={handleShowModal} setAlert={setAlert} /> :
                    null
            }
        </div>
    )
}