import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ClientSideRowModelModule, ModuleRegistry, ValidationModule, TextFilterModule, NumberFilterModule, DateFilterModule, RowSelectionModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowSelectionModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule, ValidationModule]);

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterModule, CommonModule, AgGridModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent {
  gridOptions = {
    theme: 'ag-theme-alpine',
  };
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true, width: 100 },
    { field: 'title', headerName: 'Title', sortable: true, filter: true },
    { field: 'author', headerName: 'Author', sortable: true, filter: true },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'rating',
      headerName: 'Rating & Reviews',
      width: 300,
      cellRenderer: (params: any) => {
        return this.getStarRating(params.value);
      }
    }
  ];

  books = [
    { id: 1, title: 'A Court of Thorns and Roses', author: ' Sarah J. Maas', description: 'Description of Book 1', rating: 5 },
    { id: 2, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'Description of Book 2', rating: 4 },
    { id: 3, title: 'The Last Girl to Die', author: 'Helen Fields ', description: 'Description of Book 3', rating: 2 },
    { id: 4, title: 'Her Last Walk Home', author: ' Patricia Gibney ', description: 'Description of Book 4', rating: 1 },
    { id: 5, title: 'Percy Jackson: The Complete Series (Books 1, 2, 3, 4, 5)', author: ' Rick Riordan', description: 'Description of Book 5', rating: 4 },
    { id: 6, title: 'Twilight', author: 'Stephenie Meyer ', description: 'Description of Book 6', rating: 4 }
  ];

  ngOnInit() {
    console.log('BookListComponent initialized');
  }

  getStarRating(rating: number): string {
    try {
      if (rating < 1 || rating > 5) {
        console.warn('Invalid rating:', rating);
        return 'Invalid Rating';
      }
      return '⭐'.repeat(rating);
    } catch (error) {
      console.error('Error generating star rating:', error);
      return 'Error';
    }
  }
  modules = [ClientSideRowModelModule];
}
