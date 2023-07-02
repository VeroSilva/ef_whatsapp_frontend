export const login = async (data) => {
  const response = await fetch(`${process.env.API_URL}/user/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  });

  return response;
};

export const getConversations = async (offset, limit, search, token) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation?offset=${offset}&limit=${limit}&search=${search}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: token,
        "Content-Type": "application/json",
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  ).then((res) => res.json());

  return response;
};

export const getMessagesByConversation = async (id, limit, token) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation/${id}/messages?offset=0&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: token,
        "Content-Type": "application/json",
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => {
      throw new Error("Error: " + error.message);
    });

  return response;
};

export const createConversation = async (data, token) => {
  const response = await fetch(`${process.env.API_URL}/conversation`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.json());

  return response;
};

export const sendMessage = async (id, data, token) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/conversation/${id}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          Accept: "*/*",
          Authorization: token,
          "Content-Type": "application/json",
          "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error al enviar el mensaje. Código de respuesta: " + response.status
      );
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al enviar el mensaje: " + error.message);
  }
};

export const getMedia = async (token, url) => {
  const response = await fetch(`${process.env.API_URL}/message/downloadMedia`, {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  });

  return response.text();
};

export const markAsRead = async (token, ids) => {
  const response = await fetch(`${process.env.API_URL}/message/markAsRead`, {
    method: "POST",
    body: JSON.stringify({ ids: ids }),
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.text());

  return response;
};

export const getContact = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/contact/${id}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  });

  return response;
};

export const getTemplates = async (token) => {
  const response = await fetch(`${process.env.API_URL}/template`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.json());

  return response;
};
