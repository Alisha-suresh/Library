import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'books', component: BookListComponent },
    { path: 'search', component: SearchComponent },
    { path: '**', redirectTo: '' }
];