export const getFileType = (type?: string) => {
    let typeResume

    if (type?.startsWith('image/')) {
        typeResume = "image"
    } else if (type?.startsWith('video/')) {
        typeResume = "video"
    } else if (type?.startsWith('audio/')) {
        typeResume = "audio"
    } else {
        typeResume = "document"
    }

    return typeResume
}

export const getVariables = (texto: string) => {
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    let startIndex = 0;
    const substrings = [];
    const inputString = texto;

    while ((match = regex.exec(inputString)) !== null) {
        const matchIndex = match.index;
        const substring = inputString.substring(startIndex, matchIndex);
        substrings.push(substring);
        startIndex = matchIndex + match[0].length;
    }

    const lastSubstring = inputString.substring(startIndex);
    substrings.push(lastSubstring);

    return substrings;
}