export interface Contact {
    country: string,
    email: string,
    name: string,
    phone: string,
    tag_id: string,
    id: number
}

export interface Tag {
    id: number,
    name: string,
    color: string,
    description: string
}

export interface Conversation {
    contact: Contact,
    contact_id: number,
    id: number,
    last_message: string,
    message_created_at: string,
    message_type: string,
    status: string,
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
    template?: any,
    response_to?: string,
    text?: string,
    caption?: string
}

export interface Message {
    conversation_id: number,
    created_at: string,
    id: number,
    message: MessageDetail,
    message_type: string,
    read: boolean,
    status: string,
    replied_message?: Message | null
}