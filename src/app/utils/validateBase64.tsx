export const validateBase64 = (base64String: string): boolean => {

    const data = base64String.split(',');
    try {
        const decodedString = atob(data[1]);
        const encodedString = btoa(decodedString);
        return encodedString === data[1];
    } catch (error) {
        return false;
    }

}