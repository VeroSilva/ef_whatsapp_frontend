interface TemplateComponents {
    text?: string;
    example?: any;
    buttons?: any;
    type: string;
    format: string;
}

export interface Template {
    category: string;
    components: TemplateComponents[];
    id: number;
    language: string;
    name: string;
    status: string;
    whatsapp_template_id: string;
}