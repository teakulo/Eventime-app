import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public username: string | null = null;

  constructor(private http: HttpClient, public tokenService: TokenService) {
    console.log("AuthService initialized.");
    this.checkAuth();
  }

  login(email: string, password: string): Observable<User> {
    console.log("AuthService: Attempting login with:", email);
    return this.http.post<User>(`${this.apiUrl}/authenticate`, { email, password }).pipe(
      tap((res: any) => {
        console.log("AuthService: Login successful:", res);
        this.tokenService.saveToken(res.token);
        this.tokenService.saveRefreshToken(res.refreshToken);
        this.setUsername(res.user?.nickname);
        this.isLoggedInSubject.next(true);
      }),
      catchError(error => {
        console.error("AuthService: Login failed:", error);
        return throwError(() => new Error(error.error.message || 'Login failed'));
      })
    );
  }

  createUser(email: string, nickname: string, password: string): Observable<User> {
    console.log("AuthService: Attempting to create user:", email);
    return this.http.post<User>(`${this.apiUrl}/register`, { email, nickname, password }).pipe(
      tap(() => console.log("AuthService: User creation successful")),
      catchError((error: HttpErrorResponse) => {
        console.error("AuthService: Registration failed:", error);
        return throwError(() => new Error(error.error.message || 'Registration failed'));
      })
    );
  }

  logout(): void {
    console.log("AuthService: Logging out user.");
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    this.isLoggedInSubject.next(false);
    this.username = null;
  }

  checkAuth(): void {
    const token = this.tokenService.getToken();
    const isAuthenticated = !!token && !this.tokenService.isTokenExpired(token);
    console.log("AuthService: CheckAuth called. Is authenticated?", isAuthenticated);
    this.isLoggedInSubject.next(isAuthenticated);
    if (!isAuthenticated) {
      this.username = null;
    }
  }

  setUsername(name: string | null): void {
    console.log("AuthService: Setting username:", name);
    this.username = name;
  }

  getUsername(): string | null {
    return this.username;
  }

  getCurrentUserId(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      const decoded: any = this.decodeToken(token);
      console.log('Decoded token:', decoded); // Add this line for debugging
      return decoded.userId; // Use userId instead of sub
    }
    return null;
  }

  getCurrentUserEmail(): string | null {
    const token = this.tokenService.getToken();
    if (token) {
      const decoded: any = this.decodeToken(token);
      console.log('Decoded token email:', decoded.email); // Add this line for debugging
      return decoded.email;
    }
    return null;
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    console.log("AuthService: Refreshing token.");
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).pipe(
      tap(response => {
        console.log("AuthService: Token refreshed:", response);
        this.tokenService.saveToken(response.token);
      }),
      catchError(error => {
        console.error("AuthService: Token refresh failed:", error);
        this.logout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      console.log('Decoded token payload:', decoded); // Add this line for debugging
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
