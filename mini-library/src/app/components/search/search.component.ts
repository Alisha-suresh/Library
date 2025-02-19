import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { BookAvailability } from '../../interfaces/book-availability.interface';
import { BookingDialogComponent } from '../booking-dialog/booking-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from '../../services/book.service';
import { BookQuery } from '../../store/book.query';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    AgGridModule,
    RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit {
  private booksSubscription!: Subscription;
  searchQuery: string = '';
  allBooks: BookAvailability[] = [];
  searchResults: BookAvailability[] = [];
  private gridApi!: GridApi<BookAvailability>;
  selectedBooks: BookAvailability[] = [];
  apiUrl: string = 'http://localhost:3000/fetch-books';
  private initialFetchAttempted = false;

  constructor(private dialog: MatDialog, private bookService: BookService,
    private bookQuery: BookQuery) { }

  defaultColDef = {
    sortable: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  };

  columnDefs: ColDef[] = [
    {
      field: 'selection',
      headerName: '',
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: 'left',
      flex: 0.5
    },
    { field: 'title', headerName: 'Book Title', flex: 2 },
    { field: 'author', headerName: 'Author', flex: 1.5 },
    { field: 'format', headerName: 'Format', flex: 1 },
    { field: 'location', headerName: 'Location/Platform', flex: 2, valueGetter: (params) => params.data.location.join(', ') },
    {
      field: 'availability',
      headerName: 'Status',
      flex: 1,
      valueFormatter: (params: any) => params.value ? 'Available' : 'Not Available'
    },
    {
      field: 'link',
      headerName: 'Action',
      flex: 1,
      cellRenderer: (params: any) => {
        const isOnline = params.data.format === 'Online';
        const url = isOnline ? params.data.link : `https://www.google.com/maps/search/${encodeURIComponent(params.data.location)}`;
        const linkText = isOnline ? 'Visit Site' : 'View in Store';

        return `<a href="${url}" target="_blank" style="color: #3f51b5; text-decoration: none;">${linkText}</a>`;
      }
    }
  ];

  // mockSearchResults: BookAvailability[] = [
  //   {
  //     id: 1,
  //     title: 'A Court of Thorns and Roses',
  //     author: 'Sarah J. Maas',
  //     format: 'Online',
  //     location: 'Project Gutenberg',
  //     availability: true,
  //     link: 'https://amzn.eu/d/iqvivOM'
  //   },
  //   {
  //     id: 2,
  //     title: 'The Great Gatsby',
  //     author: 'F. Scott Fitzgerald',
  //     format: 'Offline',
  //     location: 'Central Library - Fiction Section',
  //     availability: true,
  //     price: 15.99
  //   },
  //   {
  //     id: 3,
  //     title: 'The Great Gatsby',
  //     author: 'F. Scott Fitzgerald',
  //     format: 'Online',
  //     location: 'Amazon Kindle',
  //     availability: true,
  //     link: 'https://amzn.eu/d/d15PZds'
  //   }
  // ];

  ngOnInit() {
    this.allBooks = [];
    this.booksSubscription = this.bookQuery.select(state => state.books)
      .subscribe({
        next: (books) => {
          if (Array.isArray(books)) {
            console.log("Raw books data from store:", books);
            this.allBooks = books;
            this.updateSearchResults(books);
          } else {
            console.warn("Received non-array books data:", books);
            this.allBooks = [];
            this.updateSearchResults([]);
          }

          // Only fetch if we have no books and haven't tried fetching yet
          if ((!books || books.length === 0) && !this.initialFetchAttempted) {
            this.fetchBooks();
          }
        },
        error: (error) => {
          console.error("Error in books subscription:", error);
          this.allBooks = [];
          this.updateSearchResults([]);
        }
      });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.booksSubscription) {
      this.booksSubscription.unsubscribe();
    }
  }

  private updateSearchResults(books: BookAvailability[]) {
    if (!Array.isArray(books)) {
      console.warn("Attempting to update with non-array data:", books);
      books = [];
    }
    this.searchResults = books;

    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.searchResults);
    }
  }

  fetchBooks(query: string = '') {
    this.initialFetchAttempted = true;
    this.bookService.fetchBooks(query).subscribe({
      next: () => {
        console.log('Books fetched and stored successfully');
      },
      error: (error) => {
        console.error('Error fetching books:', error);
        // Ensure we have a valid array even after error
        if (!Array.isArray(this.allBooks)) {
          this.allBooks = [];
        }
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    if (this.searchResults.length) {
      this.gridApi.applyTransaction({ add: this.searchResults });
    }
  }

  onSelectionChanged() {
    try {
      this.selectedBooks = this.gridApi.getSelectedRows();
      console.log('Selected books:', this.selectedBooks);
    } catch (error) {
      console.error('Error while updating selected books:', error);
    }
  }

  onSearch() {
    const query = this.searchQuery?.trim() ?? '';
    this.fetchBooks(query);
    // if (!query) {
    //   // If search is empty, show all books
    //   this.updateSearchResults(Array.isArray(this.allBooks) ? this.allBooks : []);
    //   return;
    // }

    // // Fetch new data based on search query
    // this.fetchBooks(query);

    // // Safely filter current data
    // if (Array.isArray(this.allBooks)) {
    //   const filteredBooks = this.allBooks.filter(book =>
    //     book?.title?.toLowerCase().includes(query.toLowerCase()) ||
    //     book?.author?.toLowerCase().includes(query.toLowerCase())
    //   );
    //   this.updateSearchResults(filteredBooks);
    // } else {
    //   console.warn('allBooks is not an array during search');
    //   this.updateSearchResults([]);
    // }
  }

  openBookingDialog() {
    if (this.selectedBooks.length === 0) return;

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '500px',
      data: { selectedBooks: this.selectedBooks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Booking submitted:', result);
        this.gridApi.deselectAll();
      }
    });
  }

}