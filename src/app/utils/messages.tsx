import { blobToBase64, dataURLtoMimeType } from "./blobToBase64";

export const dataMessageToSend = async ({ type, data }: { type: string, data: any }) => {
    let dataTransformed;

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
    }

    if (type === "text") {
        dataToSend[type].body = dataTransformed;
    } else if (type === "template") {
        dataToSend[type] = dataTransformed;
    } else if (type === "document") {
        dataToSend[type].filename = data.name;
    }

    return dataToSend
}