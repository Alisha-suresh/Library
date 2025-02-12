import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Routes = [];
export const appRoutes: Routes = [
    { path: '', component: BookListComponent },
    { path: 'book/:id', component: BookDetailComponent },
    { path: 'search', component: SearchComponent },
];