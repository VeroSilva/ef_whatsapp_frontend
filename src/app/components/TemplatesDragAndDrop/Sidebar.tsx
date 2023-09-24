"use client"

import React, { useEffect, useState } from 'react';
import useTemplates from "../../hooks/useTemplates";
import { IconLoading } from '../Icons/IconLoading';
import useUser from "../../hooks/useUser"
import { importTemplates } from '@/app/services/api';
import { usePathname } from "next/navigation";
import { IconCheckCircle } from '../Icons/IconCheckCircle';
import { IconInfo } from '../Icons/IconInfo';

const Sidebar = ({ handleSaveFlow, loadingSave }: { handleSaveFlow: () => void, loadingSave: boolean }) => {
    const { templatesState } = useTemplates();
    const [loadingImport, setLoadingImport] = useState(false)
    const { userState } = useUser();
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, template: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('template', JSON.stringify(template));
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleImportTemplates = () => {
        setLoadingImport(true)

        importTemplates(userState.token, phoneId).then((res) => {
            setLoadingImport(false)
            setAlert({
                type: "success",
                message: "Templates importados con éxito!",
                show: true
            })
        })
    }

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({
                    type: alert.type,
                    message: alert.message,
                    show: false
                })
            }, 3000);
        }
    }, [alert])

    return (
        <>
            <aside className="flex flex-col justify-between">
                <div className='overflow-y-auto'>
                    {templatesState &&
                        templatesState.map((template, index) => {
                            return (
                                <div key={index} className="dndnode" onDragStart={(event) => onDragStart(event, 'default', template)} draggable>
                                    {template.name}
                                </div>
                            )
                        })
                    }
                </div>

                <div className="actions-container flex flex-col	gap-4">
                    <button className="main-button flex items-center justify-center" onClick={handleSaveFlow}>
                        {loadingSave && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                        Guardar cambios
                    </button>
                    <button className="main-button flex items-center justify-center" onClick={handleImportTemplates}>
                        {loadingImport && <IconLoading classes="w-6 h-6 text-slate-100 me-2" />}
                        Importar templates
                    </button>
                </div>
            </aside>

            <div className={`p-4 m-4 text-sm font-bold rounded-lg absolute top-0 right-0 flex items-center transition transition-opacity duration-500 ${alert.show ? "opacity-1" : "opacity-0"} ${alert.type === "success" ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'}`} role="alert">
                {alert.type === "success" ?
                    <IconCheckCircle classes="w-6 h-6 mr-2" /> :
                    <IconInfo classes="w-6 h-6 mr-2" />
                }
                <span>{alert.message}</span>
            </div>
        </>
    );
};

export default Sidebar;