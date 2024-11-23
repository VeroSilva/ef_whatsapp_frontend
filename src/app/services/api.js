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
  let url = `${process.env.API_URL}/conversation?offset=${offset}&limit=${limit}&company_phone_id=${company_phone_id}`;

  if (filter.search) {
    url += `&search=${filter.search}`;
  }

  if (filter.unread) {
    url += `&unread=${filter.unread}`;
  }

  if (filter.overdue) {
    url += `&overdue=${filter.overdue}`;
  }

  if (filter.startDate && filter.endDate) {
    const startHour = filter.startDate + " 00:00:00";
    const endHour = filter.endDate + " 23:59:59";

    url += `&initDate=${startHour}&endDate=${endHour}`;
  }

  if (filter.tags) url += `&tags=${filter.tags}`;

  if (filter.user_assigned_id)
    url += `&user_assigned_id=${filter.user_assigned_id}`;

  const response = await fetch(url, {
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

export const setMassiveTagsToConversations = (
  tag,
  company_phone_id,
  token,
  data
) => {
  const response = fetch(
    `${process.env.API_URL}/conversation/tag/${tag}/massive/${company_phone_id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Accept: "*/*",
        Authorization: token,
        "Content-Type": "application/json",
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  ).then((res) => {
    if (res.status === 204) return { status: true };
    else throw new Error("Error 500");
  });

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

export const deleteConversation = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/conversation/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error("Error: " + error.message);
    });

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

export const markAsRead = async (token, idConversation) => {
  const response = await fetch(`${process.env.API_URL}/message/markAsRead`, {
    method: "POST",
    body: JSON.stringify({ conversation_id: idConversation }),
    headers: {
      Accept: "*/*",
      Authorization: token,
      "Content-Type": "application/json",
      "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
    },
  }).then((res) => res.text());

  return response;
};

export const markAsUnread = async (token, idConversation) => {
  const response = await fetch(`${process.env.API_URL}/message/markAsUnread`, {
    method: "POST",
    body: JSON.stringify({ conversation_id: idConversation }),
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

export const getTemplates = async (token, company_phone_id, onlyLink) => {
  let url = `${process.env.API_URL}/template/${company_phone_id}`;
  if (onlyLink) url += `?links=${onlyLink}`;

  const response = await fetch(url, {
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

export const editTemplate = async (token, id, link) => {
  const response = await fetch(
    `${process.env.API_URL}/template/header-link/${id}`,
    {
      method: "POST",
      body: JSON.stringify({ link }),
      headers: {
        Accept: "*/*",
        Authorization: token,
        "Content-Type": "application/json",
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
      },
    }
  );

  const status = response.status;
  const data = await response.json();

  return { status, data };
};

export const importTemplates = async (token, company_phone_id) => {
  const response = await fetch(
    `${process.env.API_URL}/template/import/${company_phone_id}`,
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

export const getUsers = async (token, filters) => {
  let url = `${process.env.API_URL}/user`;

  if (filters)
    url += `?company_phone_id=${filters.company_phone_id}&role=${filters.role}`;

  const response = await fetch(url, {
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

export const getUserById = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/user/${id}`, {
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

export const editUserPassword = async (data, id, token) => {
  const response = await fetch(`${process.env.API_URL}/user/password/${id}`, {
    method: "PATCH",
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

export const addTagToConversation = async (
  idConversation,
  idTag,
  token,
  fields
) => {
  const bodyData = fields ? JSON.stringify({ fields }) : null;

  const response = await fetch(
    `${process.env.API_URL}/conversation/${idConversation}/tag/${idTag}`,
    {
      method: "POST",
      body: bodyData,
      headers: {
        Authorization: token,
        "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
        "Content-Type": "application/json",
      },
    }
  );
  const status = response.status;
  const data = await response.json();

  return { status, data };
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

export const getPhones = async (token) => {
  const response = await fetch(`${process.env.API_URL}/phone`, {
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

export const createPhone = async (data, token) => {
  const response = await fetch(`${process.env.API_URL}/phone`, {
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

export const editPhone = async (data, id, token) => {
  const response = await fetch(`${process.env.API_URL}/phone/${id}`, {
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

export const deletePhone = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/phone/${id}`, {
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

export const getFlows = async (token, company_phone_id, flow_id) => {
  const response = await fetch(
    `${process.env.API_URL}/flow/${company_phone_id}/${flow_id}`,
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

export const updateFlows = async (token, company_phone_id, data) => {
  const response = await fetch(
    `${process.env.API_URL}/flow/${company_phone_id}`,
    {
      method: "POST",
      body: JSON.stringify({ flow: data }),
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

export const getCatalog = async (token, company_phone_id) => {
  const response = await fetch(
    `${process.env.API_URL}/catalog/${company_phone_id}`,
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

export const getQuickAnswers = async (token, company_phone_id) => {
  const response = await fetch(
    `${process.env.API_URL}/quick-answer/${company_phone_id}`,
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

export const createQuickAnswer = async (data, company_phone_id, token) => {
  const response = await fetch(
    `${process.env.API_URL}/quick-answer/${company_phone_id}`,
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
  ).then((res) => res.json());

  return response;
};

export const editQuickAnswers = async (data, id, company_phone_id, token) => {
  const response = await fetch(
    `${process.env.API_URL}/quick-answer/${id}/${company_phone_id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
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

export const deleteQuickAnswers = async (id, company_phone_id, token) => {
  const response = await fetch(
    `${process.env.API_URL}/quick-answer/${id}/${company_phone_id}`,
    {
      method: "DELETE",
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

export const getDashboardReport = async (token, initDate, endDate) => {
  const response = await fetch(
    `${process.env.API_URL}/report?initDate=${initDate} 00:00:00&endDate=${endDate} 23:59:59`,
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

export const downloadDashboardReport = async (token, initDate, endDate) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/report/download?initDate=${initDate} 00:00:00&endDate=${endDate} 23:59:59`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: token,
          "Content-Type": "application/json",
          "x-ef-perfumes": process.env.API_CUSTOM_HEADER,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Reporte_WhatsappEF_${initDate}_${endDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al descargar el informe." };
  }
};

export const getCampaigns = async (token) => {
  const response = await fetch(`${process.env.API_URL}/campaign`, {
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

export const createCampaign = async (data, token) => {
  const response = await fetch(`${process.env.API_URL}/campaign`, {
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

export const editCampaign = async (data, id, token) => {
  const response = await fetch(`${process.env.API_URL}/campaign/${id}`, {
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

export const deleteCampaign = async (id, token) => {
  const response = await fetch(`${process.env.API_URL}/campaign/${id}`, {
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
