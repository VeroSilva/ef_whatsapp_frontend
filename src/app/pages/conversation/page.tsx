"use client"
import { useEffect, useRef } from 'react';
import { redirect } from 'next/navigation';
import useUser from "../../hooks/useUser";
import useActiveConversation from "../../hooks/useActiveConversation";
import { Sidebar } from '@/app/components/Sidebar/Sidebar';
//@ts-ignore
import { Chat } from '@/app/components/Chat/Chat';
import { ChatSidebar } from '@/app/components/ChatSidebar/ChatSidebar';
import { Socket, io } from 'socket.io-client';
import { useSocket } from '@/app/context/socket/SocketContext';
import { getUsers } from '@/app/services/api';
import useUsersListState from '@/app/hooks/useUsersList';
import useActivePhone from "@/app/hooks/useActivePhone";

const Conversation = (): JSX.Element => {
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState, resetActiveConversation } = useActiveConversation();
    const socketRef = useRef<Socket | null>(null);
    const { setSocketInstance } = useSocket();
    const { setUsersListState } = useUsersListState();
    const { activePhone } = useActivePhone();

    useEffect(() => {
        if (!userState || userState.token === "") {
            redirect('/pages/login')
        }
    }, [userState]);

    useEffect(() => {
        getUsers(userState.token, { company_phone_id: activePhone, role: 3 }).then((res => {
            setUsersListState(res)
        }))
    }, [activePhone])

    useEffect(() => {
        if (activeConversationState.id === -1) resetActiveConversation();
    }, [])

    useEffect(() => {
        const handleEscKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                resetActiveConversation();
            }
        };

        document.addEventListener('keydown', handleEscKeyPress);

        return () => {
            document.removeEventListener('keydown', handleEscKeyPress);
        };
    }, [activeConversationState]);

    useEffect(() => {
        if (!socketRef.current && userState.token) {
            const apiUrl: string = process.env.API_SOCKET ?? "";
            socketRef.current = io(apiUrl, {
                auth: { token: userState.token },
            });
            socketRef.current.emit('join_new_channel');
            setSocketInstance(socketRef.current);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, [userState.token])

    return (
        <>
            <Sidebar />
            <div className="grid grid-cols-12 h-full flex-1">
                {/* BEGIN: Chat Side Menu */}
                <ChatSidebar />
                {/* END: Chat Side Menu */}
                {/* BEGIN: Chat Content */}
                <Chat />
                {/* END: Chat Content */}
            </div>

            {/* BEGIN: Modal */}
            {/* <MemoziedModalCreateConversartion show={showModal} handleOpenModal={handleOpenModal} setMessages={setMessages} /> */}
            {/* END: Modal */}
        </>
    );
};

export default Conversation;
