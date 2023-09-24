export interface User {
    username: string;
    token: string;
    company_phones?: [CompanyPhones]
    role?: string
}

export interface CompanyPhones {
    company_phone_id: number,
    phone: string,
    alias: string,
}