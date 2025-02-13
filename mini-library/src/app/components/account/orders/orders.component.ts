import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AgGridModule } from 'ag-grid-angular';
import { Order } from '../../../interfaces/user.interface';
import { ColDef } from 'ag-grid-community';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, AgGridModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
  orders: Order[] = [];
  columnDefs: ColDef<Order>[] = [
    { field: 'id', headerName: 'Order ID', sortable: true },
    { field: 'bookTitle', headerName: 'Book Title', sortable: true },
    {
      field: 'orderDate',
      headerName: 'Order Date',
      sortable: true,
      valueFormatter: (params: any) => new Date(params.value).toLocaleDateString()
    },
    { field: 'status', headerName: 'Status', sortable: true }
  ];

  ngOnInit() {
    // Simulate loading orders
    this.orders = [
      {
        id: '1',
        bookTitle: 'Angular Development',
        orderDate: new Date(),
        returnDate: null,
        status: 'current'
      },
      {
        id: '2',
        bookTitle: 'TypeScript Basics',
        orderDate: new Date('2024-01-15'),
        returnDate: new Date('2024-02-15'),
        status: 'past'
      }
    ];
  }
}
