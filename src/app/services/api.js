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

export const getConversations = async (
  offset,
  limit,
  filter,
  token,
  company_phone_id
) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation?offset=${offset}&limit=${limit}&search=${filter.search}&unread=${filter.unread}&company_phone_id=${company_phone_id}`,
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

export const getMessagesByConversation = async (id, offset, limit, token) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation/${id}/messages?offset=${offset}&limit=${limit}`,
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

export const getMedia = async (token, url, conversation_id) => {
  const response = await fetch(`${process.env.API_URL}/message/downloadMedia`, {
    method: "POST",
    body: JSON.stringify({ url, conversation_id }),
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

export const getUsers = async (token) => {
  const response = await fetch(`${process.env.API_URL}/user`, {
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

export const createUser = async (data, token) => {
  const response = await fetch(`${process.env.API_URL}/user`, {
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

export const editUser = async (data, id, token) => {
  const response = await fetch(`${process.env.API_URL}/user/${id}`, {
    method: "PUT",
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

export const deleteUser = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.json());

  return response;
};

export const getTags = async (token) => {
  const response = await fetch(`${process.env.API_URL}/tag`, {
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

export const createTag = async (data, token) => {
  const response = await fetch(`${process.env.API_URL}/tag`, {
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

export const editTag = async (data, id, token) => {
  const response = await fetch(`${process.env.API_URL}/tag/${id}`, {
    method: "PUT",
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

export const deleteTag = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/tag/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.json());

  return response;
};

export const addTagToConversation = async (idConversation, idTag, token) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation/${idConversation}/tag/${idTag}`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  ).then((res) => res.json());

  return response;
};

export const removeTagToConversation = async (idConversation, idTag, token) => {
  const response = await fetch(
    `${process.env.API_URL}/conversation/${idConversation}/tag/${idTag}`,
    {
      method: "DELETE",
      headers: {
        Authorization: token,
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  ).then((res) => res.json());

  return response;
};
