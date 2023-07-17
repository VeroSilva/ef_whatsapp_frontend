//@ts-ignore
// @ts-nocheck

"use client"

import { useEffect } from 'react';
import 'reactflow/dist/style.css';
import { Sidebar } from '@/app/components/Sidebar/Sidebar';
import TemplatesDragAndDrop from '@/app/components/TemplatesDragAndDrop/TemplatesDragAndDrop';
import useTemplates from "../../hooks/useTemplates"
import { getTemplates } from '@/app/services/api';
import useUser from "../../hooks/useUser";

const TemplatesFlows = () => {
    const { setTemplatesState } = useTemplates();
    const { userState } = useUser();

    useEffect(() => {
        getTemplates(userState.token).then((res) => {
            setTemplatesState(res.templates)
        })
    }, [])

    return (
        <>
            <Sidebar />

            <div className="flex-1 h-full p-8 bg-slate-200">
                <TemplatesDragAndDrop />
            </div>
        </>
    );
};

export default TemplatesFlows;
