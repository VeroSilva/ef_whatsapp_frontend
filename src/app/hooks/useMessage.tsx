import { useEffect, useState } from "react";
import useUser from "@/app/hooks/useUser"
import { sendMessage as apiSendMessage } from "@/app/services/api"
import { blobToBase64, dataURLtoMimeType, getFilenameFromBase64 } from "@/app/utils/blobToBase64"

export const useMessage = () => {
    const [isLoading, setIsLoading] = useState(false)
    // @ts-ignore
    const { userState } = useUser()

    const sendMessage = async ({ type, data, conversationId }: { type: string, data: any, conversationId: number }) => {
        //types: text, documento, imagen, audio, template, reactions
        let dataTransformed;

        setIsLoading(true)

        if (type !== "text") {
            dataTransformed = await blobToBase64(data)
        } else {
            dataTransformed = data
        }

        const dataToSend: any = {
            type: type,
            [type]: {
            },
        };

        if (type !== "text") {
            const mimeType = dataURLtoMimeType(dataTransformed);

            if (mimeType) {
                dataToSend[type].mime_type = mimeType;
            }

            dataToSend[type].data = dataTransformed
        } else {
            dataToSend[type].body = dataTransformed
        }

        if (type === "document") {
            dataToSend[type].filename = data.name;
        }

        apiSendMessage(conversationId, {
            messageData: dataToSend,
        }, userState.token)
            .finally(() => setIsLoading(false))
    };

    return {
        sendMessage,
        isLoading
    };
};