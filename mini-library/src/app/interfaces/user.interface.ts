export interface User {
    name: string;
    email: string;
    phone: string;
}

export interface Order {
    id: string;
    bookTitle: string;
    orderDate: Date;
    returnDate: Date | null;
    status: 'current' | 'past';
}