import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { base64ToFile, blobToBase64 } from '@/app/utils/blobToBase64';
import { IconVideoCamera } from '../../Icons/IconVideoCamera';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const VideoNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [localVideo, setLocalVideo] = useState<string>("")
    const { savedVideo, handleVideosChange, id } = data
    const videoInputRef = useRef<HTMLInputElement>(null)

    const handleImageIconClick = () => {
        if (videoInputRef.current) {
            videoInputRef.current.click()
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            const encodedVideo = await blobToBase64(file)
            setLocalVideo(encodedVideo)
            handleVideosChange(id, file)
        }
    };

    useEffect(() => {
        const setVideo = async (audio: string) => {
            const decodedVideo = await base64ToFile(audio)
            setLocalVideo(audio)
        }

        if (savedVideo !== "") {
            setVideo(savedVideo)
        }
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                <label htmlFor="file-input-image-flow" id="file-label" className="flex mb-2">
                    <button
                        className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg p-2 cursor-pointer flex text-slate-100 text-xs"
                        onClick={handleImageIconClick}
                    >
                        <IconVideoCamera classes="w-4 h-4 text-slate-100 mr-1" /> {localVideo ? "Cambiar" : "Elegir"} video
                    </button>
                </label>

                <input
                    type="file"
                    id="file-input-image-flow"
                    accept="video/mp4, video/3gp"
                    style={{ display: "none" }}
                    ref={videoInputRef}
                    onChange={handleFileChange}
                />

                {localVideo &&
                    <div className='bg-slate-200 rounded p-4'>
                        <span>Video seleccionado</span>
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


export default VideoNode