import Image from "next/image"
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';
import { IconDocument } from "../../../Icons/IconDocument";
import { PreviewActions } from "../../PreviewActions";
import { getFileType } from "../../../../utils/fileType";
import { useEffect, useState } from "react";
import { InputSendMessage } from "../../../InputSendMessage/InputSendMessage";
import useActiveMessageReply from "@/app/hooks/useActiveMessageReply";
import { MessageContent } from "../../../Message/MessageContent/MessageContent";
import { IconX } from "../../../Icons/IconX";
import { initialStateActiveMessageReply } from "@/app/context/activeMessageReply/ActiveMessageReplyProvider";

export const PreviewFile = ({ file, handleSendMessage, isLoading, handleClosePreview }: { file: File | null | undefined, handleSendMessage: Function, isLoading: boolean, handleClosePreview: Function }) => {
    const [caption, setCaption] = useState("");
    const { activeMessageReply, setActiveMessageReply } = useActiveMessageReply();

    const handleAccept = () => {
        const type = getFileType(file?.type)

        handleSendMessage(type, { content: file, caption }).finally(() => handleCancel())
    }

    const handleCancel = () => {
        handleClosePreview()
    }

    const handleResetActiveMessageReply = () => {
        setActiveMessageReply(initialStateActiveMessageReply)
    }

    const handleKeyPress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!isLoading) handleAccept();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [isLoading]);

    return (
        <>
            {file && file.type.startsWith('image/') ?
                <Image
                    src={URL.createObjectURL(file)}
                    alt="Imagen seleccionada"
                    width={350}
                    height={300}
                    className="object-cover rounded-md m-auto"
                /> :
                file?.type.startsWith('video/') ?
                    <ReactPlayer
                        url={URL.createObjectURL(file)}
                        controls
                        height="90%"
                    /> :
                    file?.type.startsWith('audio/') ?
                        <div className="w-full h-full flex items-center justify-center">
                            <ReactAudioPlayer
                                src={URL.createObjectURL(file)}
                                controls
                            />
                        </div>
                        :
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="document-card bg-slate-100 rounded-md shadow flex items-center p-5 w-auto">
                                <IconDocument classes="w-8 h-8 text-teal-600" />
                                <span className="text-teal-600">{file?.name}</span>
                            </div>
                        </div>
            }

            <div className="w-9/12 m-auto">
                {activeMessageReply.conversation_id !== 0 &&
                    <div className="reply flex items-center justify-between m-4 p-2 border-2 border-teal-200 rounded-md border-l-teal-500 bg-teal-100 w-full">
                        <MessageContent message={activeMessageReply} isReply={true} />

                        <button onClick={handleResetActiveMessageReply}>
                            <IconX classes="w-6 h-6" />
                        </button>
                    </div>
                }
                <InputSendMessage handleSendMessage={handleAccept} setMessageToSend={setCaption} messageToSend={caption} />
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={true} />
        </>
    )
}