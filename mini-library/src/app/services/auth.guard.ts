import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    if (authService.checkAuthStatus()) {
      return true;
    }
    console.warn('authGuard: User is not authenticated, redirecting to login...');
    router.navigate(['/login']);
    return false;
  } catch (error) {
    console.error('authGuard: Error occurred during authentication check:', error);
    router.navigate(['/login']);
    return false;
  }
};