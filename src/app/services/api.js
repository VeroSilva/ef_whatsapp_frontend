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

export const getChats = async (offset, limit, token) => {
    console.log(token)
    const response = await fetch(
        `${process.env.API_URL}/conversation?offset=${offset}&limit=${limit}`,
        { 
            method: 'GET',
            headers: {
                Accept: '*/*',
                Authorization: `${token}`,
                'Content-Type': 'application/json',
                'x-ef-perfumes': process.env.API_CUSTOM_HEADER
            }
        }
    )
        .then((res) => res.json)

    return response;
}