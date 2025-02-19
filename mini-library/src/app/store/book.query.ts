import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { BookState, BookStore } from './book.store';

@Injectable({ providedIn: 'root' })
export class BookQuery extends Query<BookState> {
    constructor(protected override store: BookStore) {
        super(store);
    }
}