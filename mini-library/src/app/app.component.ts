import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { SearchComponent } from './components/search/search.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookListComponent, BookDetailComponent, SearchComponent, RouterModule, MatToolbarModule, CommonModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mini-library';

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  signOut() {
    // Implement your sign out logic here
    console.log('Signing out...');
    // Clear user session/local storage
    localStorage.clear();
    // Redirect to login page
    this.router.navigate(['/login']);
  }


  deleteAccount() {
    // Implement your delete account logic here
    console.log('Deleting account...');
    // Make API call to delete account
    // After successful deletion
    this.signOut();
  }
}
