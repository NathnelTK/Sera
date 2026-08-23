import { Injectable, signal, computed, inject } from '@angular/core';
import { AuthService, User } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authService = inject(AuthService);
  
  // State
  isLoading = signal(false);
  error = signal<string | null>(null);
  currentUser = signal<User | null>(null);
  
  // Computed
  isAuthenticated = computed(() => this.currentUser() !== null);
  isApplicant = computed(() => this.currentUser()?.roles?.includes('Applicant') ?? false);
  isRecruiter = computed(() => this.currentUser()?.roles?.includes('Recruiter') ?? false);
  
  constructor() {
    this.loadUserFromStorage();
  }
  
  private loadUserFromStorage() {
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined' && user !== 'null') {
      try {
        this.currentUser.set(JSON.parse(user));
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  async login(email: string, password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.authService.login(email, password).toPromise();
      this.currentUser.set(this.authService.currentUser);
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Login failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async register(email: string, password: string, role: 'Applicant' | 'Recruiter') {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.authService.register(email, password, role).toPromise();
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Registration failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  async logout() {
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.authService.logout().toPromise();
      this.currentUser.set(null);
      return true;
    } catch (err: any) {
      this.error.set(err.message || 'Logout failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }
  
  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  
  clearAuth() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
  }
}