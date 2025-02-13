import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  // Hardcoded credentials
  private readonly VALID_EMAIL = 'alishasureshuk@gmail.com';
  private readonly VALID_PASSWORD = 'password123';

  constructor(private router: Router) {
    console.log('AuthService initialized. Checking authentication status...');
    this.checkAuthStatus();
  }

  login(email: string, password: string): boolean {
    const isValid = email === this.VALID_EMAIL && password === this.VALID_PASSWORD;
    if (isValid) {
      console.log('Login successful for email:', email);
      this.isAuthenticated.next(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      this.router.navigate(['/home']);
    } else {
      console.error('Login failed: Invalid credentials');
      this.isAuthenticated.next(false);
    }

    return isValid;
  }

  logout() {
    try {
      this.isAuthenticated.next(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      console.log('Logged out successfully');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  checkAuthStatus(): boolean {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      this.isAuthenticated.next(isLoggedIn);

      console.log('Authentication status:', isLoggedIn ? 'Authenticated' : 'Not Authenticated');

      if (!isLoggedIn) {
        console.log('User is not logged in. Redirecting to login...');
        this.router.navigate(['/login']);
      }

      return isLoggedIn;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}