import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { UserAccessService } from './user-access.service';
import { ApiBaseService } from './api-base.service';
import { ActivityLogService } from './activity-log.service';
import { DefaultAgencyService } from './default-agency.service';
import { CompanyService } from './company.service';

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
  image_size?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  requires_email?: boolean;
  user_id?: number;
  username?: string;
  name?: string;
  login_method?: 'email' | 'username';
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
    private apiBaseService: ApiBaseService,
    private router: Router,
    private activityLogService: ActivityLogService,
    private defaultAgencyService: DefaultAgencyService,
    private companyService: CompanyService,
    private userAccessService: UserAccessService
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
   * Soporta login por email o username (para migración gradual)
   */
  login(identifier: string, password: string): Observable<AuthResponse> {
    const url = this.apiBaseService.buildAuthUrl('/login');

    // Enviar como email o username según corresponda
    const payload = { email: identifier, password };

    return this.http.post<AuthResponse>(url, payload).pipe(
      switchMap(response => {
        if (!response.success || !response.user || !response.access_token) {
          return of(response);
        }
        // Establecer auth primero para que getUserAgencies tenga el token
        this.setAuthData(response as AuthResponse & { user: User; access_token: string; refresh_token: string; expires_in: number });
        const userId = String(response.user.id);
        return this.userAccessService.getUserAgencies(userId).pipe(
          switchMap((agenciesRes: any) => {
            const agencies = agenciesRes?.data?.agencies ?? agenciesRes?.agencies ?? [];
            const count = Array.isArray(agencies) ? agencies.length : 0;
            if (count === 0) {
              this.clearLocalSession();
              return throwError(() => ({
                error: { message: 'No tiene agencias configuradas. Contacte al administrador para que le asigne al menos una agencia.' }
              }));
            }
            this.activityLogService.logLogin(response.user!.username || response.user!.email);
            this.defaultAgencyService.obtenerAgencias(true).subscribe();
            this.companyService.getCompanies(true).subscribe();
            return of(response);
          }),
          catchError(err => {
            this.clearLocalSession();
            return throwError(() => err?.error?.message
              ? { error: { message: err.error.message } }
              : err);
          })
        );
      }),
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Actualizar email de usuario durante la migración
   */
  updateEmail(userId: number, email: string, password: string): Observable<{ success: boolean; message: string }> {
    const url = this.apiBaseService.buildAuthUrl('/update-email');

    return this.http.post<{ success: boolean; message: string }>(url, {
      user_id: userId,
      email: email,
      password: password
    }).pipe(
      catchError(error => {
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
        // Log de logout antes de limpiar datos
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          this.activityLogService.logLogout(currentUser.username || currentUser.email);
        }
        this.clearAuthData();
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        // Aunque falle el logout en el backend, limpiar datos locales
        this.clearAuthData();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Establecer datos de autenticación
   */
  private setAuthData(response: AuthResponse & { user: User; access_token: string; refresh_token: string; expires_in: number }): void {
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
    this.clearLocalSession();
  }

  /**
   * Limpiar sesión local (auth, agencias, compañías). Usado en logout y cuando el interceptor redirige al login (401).
   */
  clearLocalSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token_expiration');

    // Limpiar agencias y compañías del localStorage en logout
    this.defaultAgencyService.limpiarTodoEnLogout();
    this.companyService.limpiarCacheEnLogout();

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

    // Verificar si el token ya expiró
    if (Date.now() >= expiration) {
      // Token expirado, no está autenticado
      return false;
    }

    // Token válido (no hacer refresh automático aquí para evitar problemas de timing)
    // El refresh se manejará en el AuthGuard cuando sea necesario
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
    return user ? (user.role_id === '7' || user.role_id === '8') : false;
  }

  /**
   * Verificar si el usuario es supervisor o soporte (solo estos roles ven la columna ID en tablas).
   * Soporte = role_id 8, Supervisor = role_name contiene "Supervisor"
   */
  isSupervisorOrSoporte(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roleId = String(user.role_id || '');
    const roleName = (user.role_name || '').toLowerCase();
    return roleId === '8' || roleId === '7';
  }

  /**
   * Devuelve las columnas a mostrar, incluyendo la columna id solo si el usuario es supervisor o soporte.
   * @param columns Columnas base
   * @param idColumnName Nombre de la columna id (por defecto 'id', puede ser 'idExpediente', etc.)
   */
  getDisplayedColumnsWithOptionalId(columns: string[], idColumnName: string = 'id'): string[] {
    if (this.isSupervisorOrSoporte()) {
      return columns.includes(idColumnName) ? columns : [idColumnName, ...columns];
    }
    return columns.filter(c => c !== idColumnName);
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
