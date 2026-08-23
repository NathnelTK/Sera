import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  roles: string[];
  isEmailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined' && user !== 'null') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  register(email: string, password: string, role: 'Applicant' | 'Recruiter'): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, { email, password, role });
  }

  login(email: string, password: string): Observable<User> {
    // Clear any existing auth state before new login
    this.clearAuth();
    
    return this.http.post<AuthTokens>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(tokens => {
          // Store tokens immediately
          this.setTokens(tokens);
        }),
        switchMap(() => {
          // Then fetch user info using the newly stored token
          return this.getCurrentUser().pipe(
            tap(user => {
              this.setCurrentUser(user);
            })
          );
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`);
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearAuth();
        })
      );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ accessToken: string }>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('accessToken', response.accessToken);
        })
      );
  }

  private setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private setTokens(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('tokenExpiresAt', tokens.expiresAt);
  }

  private clearAuth() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get accessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  get isApplicant(): boolean {
    return this.currentUser?.roles?.includes('Applicant') || false;
  }

  get isRecruiter(): boolean {
    return this.currentUser?.roles?.includes('Recruiter') || false;
  }
}