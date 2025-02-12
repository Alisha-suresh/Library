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
    { field: 'description', headerName: 'Description', width: 300 }
  ];

  books = [
    { id: 1, title: 'Book 1', author: 'Author 1', description: 'Description of Book 1' },
    { id: 2, title: 'Book 2', author: 'Author 2', description: 'Description of Book 2' },
    { id: 3, title: 'Book 3', author: 'Author 3', description: 'Description of Book 3' }
  ];
  modules = [ClientSideRowModelModule];
}
