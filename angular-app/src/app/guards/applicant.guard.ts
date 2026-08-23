import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const applicantGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const currentUserStr = localStorage.getItem('currentUser');
  if (currentUserStr && currentUserStr !== 'undefined' && currentUserStr !== 'null') {
    try {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.roles && currentUser.roles.includes('Applicant')) {
        return true;
      }
      
      if (currentUser.roles && currentUser.roles.includes('Recruiter')) {
        router.navigate(['/recruiter/dashboard']);
        return false;
      }
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
      localStorage.removeItem('currentUser');
    }
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};