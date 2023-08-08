import { blobToBase64, dataURLtoMimeType } from "./blobToBase64";

export const dataMessageToSend = async ({ type, data }: { type: string, data: any }) => {
    let dataTransformed;

    if (type !== "text" && type !== "template") {
        dataTransformed = await blobToBase64(type === "audio" ? data : data.content);
    } else {
        dataTransformed = type === "text" ? data : data.content;
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
        dataToSend[type].filename = data.content.name;
    }

    if (type === "image" || type === "video") {
        dataToSend[type].caption = data.caption;
    }

    return dataToSend
}