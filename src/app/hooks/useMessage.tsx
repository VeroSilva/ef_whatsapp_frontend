import { useEffect, useState } from "react";
import useUser from "@/app/hooks/useUser"
import { sendMessage as apiSendMessage } from "@/app/services/api"
import { blobToBase64, dataURLtoMimeType, getFilenameFromBase64 } from "@/app/utils/blobToBase64"
import { dataMessageToSend } from "../utils/messages";

export const useMessage = () => {
    const [isLoading, setIsLoading] = useState(false)
    // @ts-ignore
    const { userState } = useUser()

    const sendMessage = async ({ type, data, conversationId }: { type: string, data: any, conversationId: number }) => {
        //types: text, documento, imagen, audio, template, reactions
        try {
            const dataToSend = await dataMessageToSend({ data, type });
            setIsLoading(true);

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