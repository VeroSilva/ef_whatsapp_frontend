import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { base64ToFile, blobToBase64 } from '@/app/utils/fileProcessing';
import { IconMicrophone } from '../../Icons/IconMicrophone';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const AudioNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [localAudio, setLocalAudio] = useState<string>("")
    const { savedAudio, handleAudiosChange, id } = data
    const inputAudioRef = useRef<HTMLInputElement>(null)

    const handleImageIconClick = () => {
        if (inputAudioRef.current) {
            inputAudioRef.current.click()
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            const encodedAudio = await blobToBase64(file)
            setLocalAudio(encodedAudio)
            handleAudiosChange(id, file)
        }
    };

    useEffect(() => {
        const setAudio = async (audio: string) => {
            const decodedAudio = await base64ToFile(audio)
            setLocalAudio(audio)
        }

        if (savedAudio !== "") {
            setAudio(savedAudio)
        }
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                <label htmlFor="file-input-audio-flow" id="file-label" className="flex mb-2">
                    <button
                        className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 shadow-lg p-2 cursor-pointer flex text-slate-100 text-xs"
                        onClick={handleImageIconClick}
                    >
                        <IconMicrophone classes="w-4 h-4 text-slate-100 mr-1" /> {localAudio ? "Cambiar" : "Elegir"} audio
                    </button>
                </label>

                <input
                    type="file"
                    id="file-input-audio-flow"
                    accept="audio/aac, audio/mp3, audio/mpeg, audio/amr, audio/ogg"
                    style={{ display: "none" }}
                    ref={inputAudioRef}
                    onChange={handleFileChange}
                />

                {localAudio &&
                    <div className='bg-slate-200 rounded p-4'>
                        <span>Audio seleccionado</span>
                    </div>
                }
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="manually"
                isConnectable={isConnectable}
            />
        </div>
    );
};


export default AudioNode