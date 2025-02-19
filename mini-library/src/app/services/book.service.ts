import { Injectable } from '@angular/core';
import { BookStore } from '../store/book.store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { BookAvailability, BookApiResponse } from '../interfaces/book-availability.interface';

@Injectable({
  providedIn: 'root'
})


export class BookService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private bookStore: BookStore,
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchBooks(title: string): Observable<BookAvailability[]> {
    return this.http.get<BookApiResponse>(
      `${this.apiUrl}/fetch-books?title=${encodeURIComponent(title)}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => response.books),
      tap(books => this.bookStore.update({ books }))
    );
  }
}