import Image from "next/image"
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player';
import { IconDocument } from "../Icons/IconDocument";

export const Preview = ({ file }: { file: File }) => {
    if (file.type.startsWith('image/')) {
        return (
            <Image
                src={URL.createObjectURL(file)}
                alt="Imagen seleccionada"
                width={350}
                height={300}
                className="object-cover rounded-md m-auto"
            />
        )
    } else if (file.type.startsWith('video/')) {
        return (
            <ReactPlayer
                url={URL.createObjectURL(file)}
                controls
                height="90%"
            />
        )
    } else if (file.type.startsWith('audio/')) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ReactAudioPlayer
                    src={URL.createObjectURL(file)}
                    controls
                />
            </div>
        )
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="document-card bg-slate-100 rounded-md shadow flex items-center p-5 w-auto">
                <IconDocument classes="w-8 h-8 text-teal-600" />
                <span className="text-teal-600">{file.name}</span>
            </div>
        </div>
    )
}