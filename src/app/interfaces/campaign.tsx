export interface CampaignUser {
    username: string;
    id: number
}

export interface ColourOption {
    value: number;
    label: string;
    color: string;
    isFixed?: boolean;
    isDisabled?: boolean
}

export interface Campaing {
    id_campaign: string,
    users: number[],
    tag_id?: number | null;
}