"use client"

import React, { useState, useEffect } from 'react';
import 'reactflow/dist/style.css';
import './index.scss';
import { getCatalog, getUserById } from '@/app/services/api';
import { IconPlus } from '../Icons/IconPlus';
import { Flow } from './Flow/Flow';
import useUser from '@/app/hooks/useUser';
import useCatalog from '@/app/hooks/useCatalog';
import { Modal } from "@/app/components/Modal/Modal";
import { SelectTags } from '../Selects/SelectTags/SelectTags';
import useTags from '@/app/hooks/useTags';
import useActivePhone from "@/app//hooks/useActivePhone";

const TemplatesDragAndDrop = () => {
    const { userState } = useUser();
    const { tagsState } = useTags();
    const { activePhone } = useActivePhone();
    const { setCatalogState } = useCatalog();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [tag, setTag] = useState<any>([])
    const [tabs, setTabs] = useState<any[]>([
        {
            name: "Principal",
            id: 0,
            initialNode: [
                { id: 'client-message', type: 'input', position: { x: 0, y: 0 }, data: { label: "Mensaje cliente" } }
            ],
            show: true
        }
    ])

    useEffect(() => {
        getCatalog(userState.token, activePhone).then((res) => {
            setCatalogState(res.catalog)
        })
    }, [])

    useEffect(() => {
        if (userState.id !== 0 && !(tagsState.length === 1 && tagsState[0].id === 0)) {
            getUserById(userState.id, userState.token).then((res) => {
                const phoneData = res?.company_phones?.filter((phone: any) => phone.company_phone_id === activePhone)[0]

                phoneData?.flows?.forEach((flow: any, index: number) => {
                    const flowId = Number(flow.flow_id);

                    if (flowId !== 0) {
                        setTabs((prevTabs) => {
                            if (prevTabs.some(tab => tab.id === flowId)) {
                                return prevTabs;
                            }

                            const currentTag = tagsState.find((tag) => tag.id === flowId);

                            if (currentTag) {
                                const newTab = {
                                    name: currentTag.name,
                                    id: flowId,
                                    initialNode: [
                                        { id: `${flowId}-${currentTag.name}`, type: 'input', position: { x: 0, y: 0 }, data: { label: currentTag.name } }
                                    ],
                                    show: false
                                };

                                return [...prevTabs, newTab];
                            }

                            return prevTabs;
                        });
                    }
                })
            })
        }
    }, [userState, tagsState])

    const handleOpenModal = () => {
        setShowModal(!showModal);
    };

    const handleSelectChange = (option: any) => {
        setTag(option)
    };

    const handleAcceptTag = () => {
        setTabs((prevTabs) => [
            ...prevTabs.map((tab) => ({ ...tab, show: false })),
            {
                name: tag.label,
                id: tag.value,
                initialNode: [
                    { id: `${tag.value}-${tag.label}`, type: 'input', position: { x: 0, y: 0 }, data: { label: tag.label } }
                ],
                show: true
            }
        ])

        handleOpenModal()
    }

    const handleActiveTab = (id: number) => {
        setTabs((prevTabs) =>
            prevTabs.map((tab) => ({
                ...tab,
                show: tab.id === id
            }))
        );
    }

    return (
        <>
            <div className="dndflow relative">
                <div className="w-full flex gap-4 items-center absolute z-10 bg-slate-100 rounded-lg p-2">
                    <div className="w-full flex gap-4 items-center overflow-auto tags-container">
                        {tabs.map((tab, index) => (
                            <button
                                key={`btn-tab-${index}`}
                                className={`p-2 rounded text-nowrap	${tab.show ? "bg-sky-800 text-slate-100" : "bg-slate-300"}`}
                                onClick={() => handleActiveTab(tab.id)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <button
                        className='rounded-full bg-sky-800 p-1'
                        onClick={handleOpenModal}
                    >
                        <IconPlus classes="w-5 h-5 text-slate-100" />
                    </button>
                </div>

                {tabs.map((tab, index) => (
                    <>
                        {tab.show && <Flow key={`tab-${index}`} initialNode={tab.initialNode} activeFlow={tab.id} />}
                    </>
                ))
                }
            </div>


            <Modal
                title="Selecciona una etiqueta"
                onClose={handleOpenModal}
                show={showModal}
                width="500px"
            >
                <div className='h-[400px] flex flex-col justify-between'>
                    <div>
                        <p className='mb-4'>Esta etiqueta iniciará el flujo creado.</p>

                        <SelectTags handleChange={handleSelectChange} selectedOptions={tag} flows={tabs} />
                    </div>
                    
                    <button
                        className='main-button flex items-center justify-center self-center w-1/2'
                        onClick={handleAcceptTag}
                    >Aceptar</button>
                </div>
            </Modal>
        </>
    );
};

export default TemplatesDragAndDrop;