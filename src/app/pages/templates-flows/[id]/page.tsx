"use client"

import { useEffect } from 'react';
import 'reactflow/dist/style.css';
import { Sidebar } from '@/app/components/Sidebar/Sidebar';
import TemplatesDragAndDrop from '@/app/components/TemplatesDragAndDrop/TemplatesDragAndDrop';
import useTemplates from "../../../hooks/useTemplates"
import { getTags, getTemplates } from '@/app/services/api';
import useUser from "../../../hooks/useUser";
import useTag from "../../../hooks/useTags";
import { redirect } from "next/navigation";
import { usePathname } from 'next/navigation';

const TemplatesFlows = () => {
    const { setTemplatesState } = useTemplates();
    const { userState } = useUser();
    const { setTagsState } = useTag();
    const pathname = usePathname();
    const parts = pathname.split('/');
    const phoneId = Number(parts[parts.length - 1]);

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        getTemplates(userState.token, phoneId).then((res) => {
            setTemplatesState(res.templates)
        })

        getTags(userState.token).then((res => {
            setTagsState(res)
        }))
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
function useTags(): { userState: any; } {
    throw new Error('Function not implemented.');
}

