export interface Conversation {
    contact: string,
    id: number,
    last_message: string,
    message_created_at: string,
    message_type: string,
    status: string,
    phone: string
    last_message_time: string
}

interface MessageDetail {
    body: string,
    id: number,
    id_whatsapp: string,
    url?: string,
    sha256?: string,
    mime_type?: string,
    file_size?: number,
    filename?: number,
    media_id?: string,
    emoji?: string,
    latitude?: string,
    longitude?: string,
    voice?: string,
    animated?: string,
    reacted_message_id?: string,
}

export interface Message {
    conversation_id: number,
    created_at: string,
    id: number,
    message: MessageDetail,
    message_type: string,
    read: boolean,
    status: string
}