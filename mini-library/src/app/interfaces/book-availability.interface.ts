export interface BookAvailability {
    id: number;
    title: string;
    author: string;
    format: string;
    location: string;
    availability: boolean;
    link?: string;
    price?: number;
}