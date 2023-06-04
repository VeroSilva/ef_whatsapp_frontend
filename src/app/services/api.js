export const login = async (data) => {
    const response = await fetch(
        `${process.env.API_URL}/user/login`,
        { 
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )

    return response;
}

export const getConversations = async (offset, limit, token) => {
    const response = await fetch(
        `${process.env.API_URL}/conversation?offset=${offset}&limit=${limit}`,
        { 
            method: 'GET',
            headers: {
                Accept: '*/*',
                Authorization: token,
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )
        .then((res) => res.json())

    return response;
}

export const getMessagesByConversation = async (id, limit, token) => {
    const response = await fetch(
        `${process.env.API_URL}/conversation/${id}/messages?offset=0&limit=${limit}`,
        { 
            method: 'GET',
            headers: {
                Accept: '*/*',
                Authorization: token,
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )
        .then((res) => res.json())

    return response;
}

export const getMedia = async (token, url) => {
    const response = await fetch(
        `${process.env.API_URL}/message/downloadMedia`,
        { 
            method: 'POST',
            body: JSON.stringify({ url }),
            headers: {
                Accept: '*/*',
                Authorization: token,
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )
        .then((res) => res.text())

    return response;
}

export const markAsRead = async (token, ids) => {
    const response = await fetch(
        `${process.env.API_URL}/message/markAsRead`,
        { 
            method: 'POST',
            body: JSON.stringify({ ids: ids }),
            headers: {
                Accept: '*/*',
                Authorization: token,
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )
        .then((res) => res.text())

    return response;
}