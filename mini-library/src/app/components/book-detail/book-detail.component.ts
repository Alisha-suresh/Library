import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent {
  bookId!: number;

  book = {
    title: 'Book 1',
    author: 'Author 1',
    description: 'This is a detailed description of Book 1.'
  };

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.bookId = +params['id']; // retrieve the id from the URL
      this.setBookDetails(this.bookId);
    });
  }

  setBookDetails(bookId: number) {
    // Hardcoded data for now
    if (bookId === 1) {
      this.book = {
        title: 'Book 1',
        author: 'Author 1',
        description: 'This is a detailed description of Book 1.'
      };
    } else if (bookId === 2) {
      this.book = {
        title: 'Book 2',
        author: 'Author 2',
        description: 'This is a detailed description of Book 2.'
      };
    } else {
      this.book = {
        title: 'Book 3',
        author: 'Author 3',
        description: 'This is a detailed description of Book 3.'
      };
    }
  }
}