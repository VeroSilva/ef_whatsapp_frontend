import Image from "next/image"
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';
import { IconDocument } from "../Icons/IconDocument";
import { PreviewActions } from "./PreviewActions";
import { getFileType } from "../../utils/fileType";
import { useState } from "react";
import { InputSendMessage } from "../InputSendMessage/InputSendMessage";

export const Preview = ({ file, handleSendMessage, isLoading, setShowPreview }: { file: File, handleSendMessage: Function, isLoading: boolean, setShowPreview: Function }) => {
    const [caption, setCaption] = useState("");

    const handleAccept = () => {
        const type = getFileType(file?.type)

        handleSendMessage(type, { content: file, caption }).finally(() => handleCancel())
    }

    const handleCancel = () => {
        setShowPreview(false)
    }

    return (
        <>
            {file.type.startsWith('image/') ?
                <Image
                    src={URL.createObjectURL(file)}
                    alt="Imagen seleccionada"
                    width={350}
                    height={300}
                    className="object-cover rounded-md m-auto"
                /> :
                file.type.startsWith('video/') ?
                    <ReactPlayer
                        url={URL.createObjectURL(file)}
                        controls
                        height="90%"
                    /> :
                    file.type.startsWith('audio/') ?
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
                                <span className="text-teal-600">{file.name}</span>
                            </div>
                        </div>
            }

            <div className="w-9/12 m-auto">
                <InputSendMessage handleSendMessage={handleAccept} setMessageToSend={setCaption} messageToSend={caption} />
            </div>

            <PreviewActions handleAccept={handleAccept} handleCancel={handleCancel} isLoading={isLoading} isReadyToSend={true} />
        </>
    )
}