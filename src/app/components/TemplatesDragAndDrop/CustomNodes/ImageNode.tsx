import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { IconImage } from '../../Icons/IconImage';
import { blobToBase64 } from '@/app/utils/fileProcessing';

interface TextUpdaterNodeProps {
    data: any;
    isConnectable: boolean;
}

const ImageNode: FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
    const [localImage, setLocalImage] = useState<string>("")
    const { savedImage, handleImagesChange, id } = data
    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleImageIconClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click()
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            const encodedImgae = await blobToBase64(file)
            setLocalImage(encodedImgae)
            handleImagesChange(id, file)
        }
    };

    useEffect(() => {
        const setImage = async (image: string) => {
            setLocalImage(image)
        }

        if (savedImage !== "") {
            setImage(savedImage)
        }
    }, [])

    return (
        <div className="text-updater-node">
            <Handle type="target" position={Position.Top} id="manually" isConnectable={isConnectable} />

            <div>
                <label htmlFor="file-input-image-flow" id="file-label" className="flex mb-2">
                    <button
                        className="rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-600 shadow-lg p-2 cursor-pointer flex text-slate-100 text-xs"
                        onClick={handleImageIconClick}
                    >
                        <IconImage classes="w-4 h-4 text-slate-100 mr-1" /> {localImage ? "Cambiar" : "Elegir"} imagen
                    </button>
                </label>

                <input
                    type="file"
                    id="file-input-image-flow"
                    accept="image/jpeg, image/png"
                    style={{ display: "none" }}
                    ref={imageInputRef}
                    onChange={handleFileChange}
                />

                {localImage &&
                    <div className='bg-slate-200 rounded p-4'>
                        <span>Imagen seleccionado</span>
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


export default ImageNode