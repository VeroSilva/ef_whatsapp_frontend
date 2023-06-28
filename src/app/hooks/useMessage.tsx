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
        try {
            let dataTransformed;
            setIsLoading(true);

            if (type !== "text" && type !== "template") {
                dataTransformed = await blobToBase64(data);
            } else {
                dataTransformed = data;
            }

            const dataToSend = {
                type: type,
                [type]: {} as any,
            };

            if (type !== "text" && type !== "template") {
                const mimeType = dataURLtoMimeType(dataTransformed);

                if (mimeType) {
                    dataToSend[type].mime_type = mimeType;
                }

                dataToSend[type].data = dataTransformed;
            } else if (type === "text") {
                dataToSend[type].body = dataTransformed;
            } else if (type === "template") {
                dataToSend[type] = dataTransformed;
            } else if (type === "document") {
                dataToSend[type].filename = data.name;
            }

            await apiSendMessage(conversationId, {
                messageData: dataToSend,
            }, userState.token);
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendMessage,
        isLoading
    };
};