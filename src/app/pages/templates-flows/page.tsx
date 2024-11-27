"use client"

import { useEffect } from 'react';
import 'reactflow/dist/style.css';
import { Sidebar } from '@/app/components/Sidebar/Sidebar';
import TemplatesDragAndDrop from '@/app/components/TemplatesDragAndDrop/TemplatesDragAndDrop';
import useTemplates from "../../hooks/useTemplates"
import { getTemplates } from '@/app/services/api';
import useUser from "../../hooks/useUser";
import useTag from "../../hooks/useTags";
import { redirect } from "next/navigation";
import useActivePhone from "../../hooks/useActivePhone";

const TemplatesFlows = () => {
    const { setTemplatesState } = useTemplates();
    const { userState } = useUser();
    const { activePhone } = useActivePhone();

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        getTemplates(userState.token, activePhone).then((res) => {
            setTemplatesState(res.templates)
        })
    }, [activePhone])

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
