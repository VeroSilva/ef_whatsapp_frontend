"use client"

import React, { useEffect, useState, ChangeEvent, DragEvent } from 'react';
import useTemplates from "../../hooks/useTemplates";
import { IconLoading } from '../Icons/IconLoading';
import useUser from "../../hooks/useUser"
import { importTemplates } from '@/app/services/api';
import { IconCheckCircle } from '../Icons/IconCheckCircle';
import { IconInfo } from '../Icons/IconInfo';
import useActivePhone from "@/app//hooks/useActivePhone";
import { Accordion } from '../Accordion/Accordion';
import { IconSearch } from '../Icons/IconSearch';

const Sidebar = ({ handleSaveFlow, loadingSave }: { handleSaveFlow: () => void, loadingSave: boolean }) => {
    const { templatesState } = useTemplates();
    const { userState } = useUser();
    const { activePhone } = useActivePhone();
    const [filteredTemplates, setFilteredTemplates] = useState(templatesState);
    const [loadingImport, setLoadingImport] = useState(false);
    const [alert, setAlert] = useState({
        type: "",
        message: "",
        show: false
    });

    const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string, template?: any) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';

        if (nodeType === "templateNode") event.dataTransfer.setData('template', JSON.stringify(template));
    };

    const handleImportTemplates = () => {
        setLoadingImport(true)

        importTemplates(userState.token, activePhone).then((res) => {
            setLoadingImport(false)
            setAlert({
                type: "success",
                message: "Templates importados con éxito!",
                show: true
            })
        })
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const currentSearch = templatesState.filter(template =>
            template.name.toLowerCase().startsWith(value)
        )
    
        setFilteredTemplates(currentSearch)
    };

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

    useEffect(() => {
      if (templatesState) setFilteredTemplates(templatesState)
    }, [templatesState])

    return (
        <>
            <aside className="flex flex-col justify-between">
                <div className='flex flex-col gap-2'>
                    <Accordion
                        title="Básicos"
                        titleClassname="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold"
                        defaultIsOpen={true}
                    >
                        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'textNode')} draggable>Texto</div>

                        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'imageNode')} draggable>Imagen</div>

                        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'videoNode')} draggable>Vídeo</div>

                        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'audioNode')} draggable>Audio</div>

                        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'interactiveNode')} draggable>Interactivo</div>
                    </Accordion>

                    <Accordion
                        title="Templates"
                        titleClassname="block uppercase tracking-wide text-gray-700 text-xs text-left font-bold"
                        defaultIsOpen={false}
                    >
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <IconSearch classes="w-5 h-5 absolute inset-y-0 left-0 my-auto text-slate-400 ml-3" />
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-2 pl-10 mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 input-sky"
                                placeholder="Buscar template"
                                required
                                onChange={handleSearchChange}
                            />
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {filteredTemplates &&
                                filteredTemplates.map((template, index) => {
                                    return (
                                        <div key={index} className="dndnode" onDragStart={(event) => onDragStart(event, 'templateNode', template)} draggable>
                                            {template.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Accordion>
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