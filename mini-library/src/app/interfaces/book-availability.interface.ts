export interface BookApiResponse {
    message: string;
    books: BookAvailability[];
}

export interface BookAvailability {
    id: number;
    title: string;
    author: string;
    format: string;
    location: string[];
    availability: number;
    source_id: string;
    locations: string;

}