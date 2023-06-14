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