"use client"
import { useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import useUser from "../../../hooks/useUser";
import useActiveConversation from "../../../hooks/useActiveConversation";
import { Sidebar } from '@/app/components/Sidebar/Sidebar';
import { ModalCreateConversartion } from '@/app/components/ModalCreateConversastion/ModalCreateConversastion';
//@ts-ignore
import { Chat } from '@/app/components/Chat/Chat';
import { ChatSidebar } from '@/app/components/ChatSidebar/ChatSidebar';

const Conversation = (): JSX.Element => {
    const router = useRouter();
    const { userState } = useUser();
    //@ts-ignore
    const { activeConversationState, resetActiveConversation, setActiveConversation } = useActiveConversation();

    useEffect(() => {
        if (!userState || userState.token === "") {
            router.push('./pages/login');
        }
    }, [userState]);

    useEffect(() => {
        if (activeConversationState.id === -1) resetActiveConversation()
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

    const MemoziedModalCreateConversartion = memo(ModalCreateConversartion);

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