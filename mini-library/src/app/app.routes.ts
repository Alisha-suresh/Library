import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { OrdersComponent } from './components/account/orders/orders.component';
import { SettingsComponent } from './components/account/settings/settings.component';
import { authGuard } from './auth/services/auth.guard';
import { LoginComponent } from './components/account/login/login.component';


export const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'books', component: BookListComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home' }
];