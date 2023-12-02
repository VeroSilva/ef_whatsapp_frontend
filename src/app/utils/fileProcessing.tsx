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

export function isBase64(str: string): boolean {
    const base64Regex = /^data:([a-zA-Z0-9+/]+\/[a-zA-Z0-9-.+]+)(;name=.+)?;base64,(.+)$/;
    const matchResult = str.match(base64Regex);

    return !!matchResult && matchResult.length >= 3 && matchResult[3].length % 4 === 0;
}

export function base64ToFile(base64String: string): File | null {
    const matchResult = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);

    if (!matchResult) {
        console.error('Invalid base64 string format');
        return null;
    }

    const [, mimeType, base64Data] = matchResult;

    const binaryString = atob(base64Data);

    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: mimeType || 'application/octet-stream' });

    const file = new File([blob], 'file', { type: mimeType || 'application/octet-stream' });

    return file;
}

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

export const getCsvData = async (file: File) => {
    const text = await file.text();
    const lines = text.split('\n');
    const data = lines.map((line: string) => line.trim()).filter(Boolean);

    return data
};