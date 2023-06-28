export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const dataURLtoMimeType = (dataURL: string): string | undefined => {
    const matches = dataURL.match(/^data:(.*?);base64/);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return undefined;
};

export const getFilenameFromBase64 = (base64: string): string | undefined => {
    const matches = base64.match(/^data:(.*?);base64/);
    if (matches && matches.length > 0) {
        const mimeType = matches[1];
        const mimeTypeMatches = mimeType.match(/^.+\/(.+)$/);
        if (mimeTypeMatches && mimeTypeMatches.length > 1) {
            return mimeTypeMatches[1];
        }
    }
    return undefined;
};
