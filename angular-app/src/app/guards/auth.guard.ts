import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser && currentUser !== 'undefined' && currentUser !== 'null') {
    try {
      // Validate that it's valid JSON
      JSON.parse(currentUser);
      return true;
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
      localStorage.removeItem('currentUser');
    }
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};