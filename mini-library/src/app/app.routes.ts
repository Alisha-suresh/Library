import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { OrdersComponent } from './components/account/orders/orders.component';
import { SettingsComponent } from './components/account/settings/settings.component';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'books', component: BookListComponent },
    { path: 'search', component: SearchComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: '' }
];