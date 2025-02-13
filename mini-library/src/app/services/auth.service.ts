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
    // Check authentication status when service is initialized
    this.checkAuthStatus();
  }

  login(email: string, password: string): boolean {
    const isValid = email === this.VALID_EMAIL && password === this.VALID_PASSWORD;
    this.isAuthenticated.next(isValid);

    if (isValid) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      this.router.navigate(['/home']);
    }

    return isValid;
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticated.next(isLoggedIn);

    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }

    return isLoggedIn;
  }

  getCurrentUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }
}