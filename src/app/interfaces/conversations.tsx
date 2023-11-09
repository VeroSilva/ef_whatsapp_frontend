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
    last_message_time: string,
    tags: any
}

export interface MessageDetail {
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
    json?: Json
}

export interface Json {
    action?: JsonAction,
    body?: JsonObject,
    footer?: JsonObject,
    header?: JsonObject
}

export interface JsonObject {
    text?: string
    type?: string
}

export interface JsonAction {
    sections: any
}

export interface Message {
    conversation_id: number,
    created_at: string,
    id: number,
    message: MessageDetail,
    message_type: string,
    read: boolean,
    status: string,
    replied_message?: Message | null,
}

export interface Context {
    message_id: string
}

export interface MessageDataToSend {
    type: string,
    data: Message,
    conversationId?: number,
    context?: Context
}