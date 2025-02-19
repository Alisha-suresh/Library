import { Store, StoreConfig } from '@datorama/akita';
import { BookAvailability } from '../interfaces/book-availability.interface';
import { Injectable } from '@angular/core';


export interface BookState {
    books: BookAvailability[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'books' })
export class BookStore extends Store<BookState> {
    constructor() {
        super({ books: [] });
    }
}