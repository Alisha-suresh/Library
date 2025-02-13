import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
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
  searchQuery: string = '';
  searchResults: BookAvailability[] = [];
  private gridApi!: GridApi;
  selectedBooks: BookAvailability[] = [];

  constructor(private dialog: MatDialog) { }

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
    { field: 'location', headerName: 'Location/Platform', flex: 2 },
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

  mockSearchResults: BookAvailability[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      format: 'Online',
      location: 'Project Gutenberg',
      availability: true,
      link: 'https://www.gutenberg.org/ebooks/64317'
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      format: 'Offline',
      location: 'Central Library - Fiction Section',
      availability: true,
      price: 15.99
    },
    {
      id: 3,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      format: 'Online',
      location: 'Amazon Kindle',
      availability: true,
      link: 'https://amazon.com/kindle-store'
    }
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
    try {
      this.searchResults = this.mockSearchResults.filter(book =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Search results:', this.searchResults);
    } catch (error) {
      console.error('Error during search:', error);
    }
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

  ngOnInit() {
  }
}