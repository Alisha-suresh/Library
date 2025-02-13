import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { SearchComponent } from './components/search/search.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider'
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookListComponent, SearchComponent, RouterModule, MatToolbarModule, CommonModule, MatButtonModule, MatIconModule,
    MatMenuModule, MatDividerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mini-library';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public authService: AuthService
  ) {
    this.authService.checkAuthStatus();
  }

  signOut() {
    this.authService.logout();
  }


  // deleteAccount() {
  //   console.log('Deleting account...');

  //   this.signOut();
  // }
}
