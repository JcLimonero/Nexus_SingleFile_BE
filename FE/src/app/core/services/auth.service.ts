import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiBaseService } from './api-base.service';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role_id: string;
  role_name: string;
  enabled: boolean;
  profile_image?: string;
  image_type?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  access_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenExpirationSubject = new BehaviorSubject<number | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public accessToken$ = this.accessTokenSubject.asObservable();
  public refreshToken$ = this.refreshTokenSubject.asObservable();
  public tokenExpiration$ = this.tokenExpirationSubject.asObservable();

  private isRefreshing = false;
  private refreshTokenSubject$ = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {
    this.loadStoredAuth();
  }

  /**
   * Cargar autenticación almacenada
   */
  private loadStoredAuth(): void {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('current_user');
    const expirationStr = localStorage.getItem('token_expiration');

    if (accessToken && refreshToken && userStr && expirationStr) {
      const user = JSON.parse(userStr);
      const expiration = parseInt(expirationStr);
      
      // Verificar si el token no ha expirado
      if (Date.now() < expiration) {
        this.accessTokenSubject.next(accessToken);
        this.refreshTokenSubject.next(refreshToken);
        this.currentUserSubject.next(user);
        this.tokenExpirationSubject.next(expiration);
      } else {
        // Token expirado, intentar renovar
        this.refreshAccessToken();
      }
    }
  }

  /**
   * Login de usuario
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const url = this.apiBaseService.buildAuthUrl('/login');
    
    return this.http.post<AuthResponse>(url, { email, password }).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthData(response);
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Renovar access token
   */
  refreshAccessToken(): Observable<RefreshResponse> {
    if (this.isRefreshing) {
      // Si ya se está renovando, esperar
      return this.refreshTokenSubject$.pipe(
        switchMap(token => {
          if (token) {
            return this.http.post<RefreshResponse>(
              this.apiBaseService.buildAuthUrl('/refresh'),
              { refresh_token: token }
            );
          } else {
            return throwError(() => new Error('No refresh token available'));
          }
        })
      );
    }

    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshResponse>(
      this.apiBaseService.buildAuthUrl('/refresh'),
      { refresh_token: refreshToken }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.updateAccessToken(response.access_token, response.expires_in);
        }
        this.isRefreshing = false;
        this.refreshTokenSubject$.next(response.success ? response.access_token : null);
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.refreshTokenSubject$.next(null);
        this.logout(); // Si falla el refresh, hacer logout
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout de usuario
   */
  logout(): Observable<any> {
    const url = this.apiBaseService.buildAuthUrl('/logout');
    
    return this.http.post(url, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(error => {
        // Aunque falle el logout en el backend, limpiar datos locales
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Establecer datos de autenticación
   */
  private setAuthData(response: AuthResponse): void {
    const expiration = Date.now() + (response.expires_in * 1000);
    
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    localStorage.setItem('token_expiration', expiration.toString());
    
    this.accessTokenSubject.next(response.access_token);
    this.refreshTokenSubject.next(response.refresh_token);
    this.currentUserSubject.next(response.user);
    this.tokenExpirationSubject.next(expiration);
  }

  /**
   * Actualizar access token
   */
  private updateAccessToken(accessToken: string, expiresIn: number): void {
    const expiration = Date.now() + (expiresIn * 1000);
    
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('token_expiration', expiration.toString());
    
    this.accessTokenSubject.next(accessToken);
    this.tokenExpirationSubject.next(expiration);
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token_expiration');
    
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.tokenExpirationSubject.next(null);
  }

  /**
   * Obtener access token actual
   */
  getToken(): string | null {
    return this.accessTokenSubject.value;
  }

  /**
   * Obtener refresh token actual
   */
  getRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = this.tokenExpirationSubject.value;
    
    if (!token || !expiration) {
      return false;
    }
    
    // Verificar si el token expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    if (expiration < fiveMinutesFromNow) {
      // Token expira pronto, renovar automáticamente
      this.refreshAccessToken().subscribe();
    }
    
    return true;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si el usuario es administrador
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user ? user.role_id === '7' : false;
  }

  /**
   * Verificar si el token necesita renovación
   */
  needsTokenRefresh(): boolean {
    const expiration = this.tokenExpirationSubject.value;
    if (!expiration) return true;
    
    // Renovar si expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return expiration < fiveMinutesFromNow;
  }
}
