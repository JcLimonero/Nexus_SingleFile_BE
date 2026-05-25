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
import { ApiConfigService } from './api-config.service';

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
  /**
   * @deprecated El backend ya no devuelve refresh_token en el body desde el refactor
   * a cookie httpOnly. La propiedad queda solo para retrocompatibilidad de tipos.
   */
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

// Constantes de persistencia. access_token vive en sessionStorage (más corto que
// localStorage frente a XSS persistente). refresh_token NO se guarda — vive en cookie httpOnly.
const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_EXPIRATION_KEY = 'token_expiration';
const CURRENT_USER_KEY = 'current_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenExpirationSubject = new BehaviorSubject<number | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public accessToken$ = this.accessTokenSubject.asObservable();
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
    private userAccessService: UserAccessService,
    private apiConfigService: ApiConfigService
  ) {
    this.loadStoredAuth();
  }

  /**
   * Cargar autenticación almacenada al bootstrap.
   *
   * access_token vive en sessionStorage (se pierde al cerrar tab/browser).
   * refresh_token vive en cookie httpOnly — inaccesible desde JS pero el browser
   * la manda automáticamente en /api/auth/refresh.
   *
   * Estrategia:
   *   - Si hay access_token válido en sessionStorage → usar.
   *   - Si está expirado → intentar refresh (browser envía la cookie).
   *   - Si no hay nada en sessionStorage tampoco intentamos refresh
   *     (current_user que necesitamos persistir aparte si quisiéramos auto-login
   *     en tab nueva — por ahora forzamos login en F5 sin access_token).
   */
  private loadStoredAuth(): void {
    const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
    const userStr = sessionStorage.getItem(CURRENT_USER_KEY);
    const expirationStr = sessionStorage.getItem(TOKEN_EXPIRATION_KEY);

    if (accessToken && userStr && expirationStr) {
      const user = JSON.parse(userStr);
      const expiration = parseInt(expirationStr);

      if (Date.now() < expiration) {
        this.accessTokenSubject.next(accessToken);
        this.currentUserSubject.next(user);
        this.tokenExpirationSubject.next(expiration);
        this.apiConfigService.load();
      } else {
        this.refreshAccessToken().subscribe({ error: () => this.clearLocalSession() });
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

    return this.http.post<AuthResponse>(url, payload, { withCredentials: true }).pipe(
      switchMap(response => {
        if (!response.success || !response.user || !response.access_token) {
          return of(response);
        }
        // Establecer auth primero para que getUserAgencies tenga el token
        this.setAuthData(response as AuthResponse & { user: User; access_token: string; refresh_token: string; expires_in: number });
        const userId = String(response.user.id);
        // Administrador (role_id=7) puede entrar sin agencias asignadas — necesita
        // poder loguear para configurar agencias/usuarios desde el panel admin.
        const isAdmin = String(response.user.role_id ?? '') === '7';
        return this.userAccessService.getUserAgencies(userId).pipe(
          switchMap((agenciesRes: any) => {
            const agencies = agenciesRes?.data?.agencies ?? agenciesRes?.agencies ?? [];
            const count = Array.isArray(agencies) ? agencies.length : 0;
            if (count === 0 && !isAdmin) {
              this.clearLocalSession();
              return throwError(() => ({
                error: { message: 'No tiene agencias configuradas. Contacte al administrador para que le asigne al menos una agencia.' }
              }));
            }
            this.activityLogService.logLogin(response.user!.username || response.user!.email);
            this.apiConfigService.load();
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
   * Renovar access token usando el refresh cookie httpOnly.
   * El body va vacío; el browser adjunta la cookie automáticamente vía withCredentials.
   * El interceptor (auth.interceptor.ts) ya serializa llamadas concurrentes con su
   * propio ReplaySubject, por lo que aquí dejamos solo la lógica básica.
   */
  refreshAccessToken(): Observable<RefreshResponse> {
    this.isRefreshing = true;

    return this.http.post<RefreshResponse>(
      this.apiBaseService.buildAuthUrl('/refresh'),
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.updateAccessToken(response.access_token, response.expires_in);
        }
        this.isRefreshing = false;
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.clearLocalSession();
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout de usuario
   */
  logout(): Observable<any> {
    const url = this.apiBaseService.buildAuthUrl('/logout');

    return this.http.post(url, {}, { withCredentials: true }).pipe(
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
   * Persiste datos de autenticación en sessionStorage (más restringido que localStorage).
   * El refresh_token NO se persiste — vive solo en cookie httpOnly que el browser maneja.
   */
  private setAuthData(response: AuthResponse & { user: User; access_token: string; expires_in: number }): void {
    const expiration = Date.now() + (response.expires_in * 1000);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(response.user));
    sessionStorage.setItem(TOKEN_EXPIRATION_KEY, expiration.toString());

    this.accessTokenSubject.next(response.access_token);
    this.currentUserSubject.next(response.user);
    this.tokenExpirationSubject.next(expiration);
  }

  /**
   * Refresh exitoso: actualiza access_token sin tocar user/refresh.
   */
  private updateAccessToken(accessToken: string, expiresIn: number): void {
    const expiration = Date.now() + (expiresIn * 1000);

    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(TOKEN_EXPIRATION_KEY, expiration.toString());

    this.accessTokenSubject.next(accessToken);
    this.tokenExpirationSubject.next(expiration);
  }

  private clearAuthData(): void {
    this.clearLocalSession();
  }

  /**
   * Limpia sesión local (auth, agencias, compañías). Usado en logout y por el
   * interceptor cuando el refresh con cookie falla.
   * La cookie httpOnly del refresh_token se limpia BE-side en /auth/logout y
   * /auth/refresh (cuando fallan); el browser no la expone para borrarla desde JS.
   */
  clearLocalSession(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRATION_KEY);
    // Migración: limpiamos también las claves viejas en localStorage para evitar
    // que residuos confundan la sesión nueva.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('token_expiration');

    this.defaultAgencyService.limpiarTodoEnLogout();
    this.companyService.limpiarCacheEnLogout();
    this.apiConfigService.clearCache();

    this.accessTokenSubject.next(null);
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
   * @deprecated El refresh_token vive en cookie httpOnly, inaccesible desde JS.
   * Mantenemos el método para no romper callers viejos, pero retorna null.
   */
  getRefreshToken(): string | null {
    return null;
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

  /** Columnas de tipo ID que se ocultan para el rol Demo (presentaciones a clientes). */
  static readonly DEMO_HIDDEN_ID_COLUMNS = [
    'id', 'idExpediente', 'idFile', 'id_agency_dms', 'id_user_rol', 'idTypeReason'
  ];

  /**
   * Verificar si el usuario es administrador (incluye Demo para acceso a rutas).
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roleId = String(user.role_id || '');
    return roleId === '7' || roleId === '8' || roleId === '15';
  }

  /**
   * Verificar si el usuario tiene rol Demo (admin sin mostrar IDs).
   */
  isDemoRole(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roleId = String(user.role_id || '');
    return roleId === '15';
  }

  /**
   * Verificar si el usuario es supervisor o soporte (solo estos roles ven la columna ID en tablas).
   * Demo (15) NO se considera: no debe ver IDs.
   */
  isSupervisorOrSoporte(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    const roleId = String(user.role_id || '');
    return roleId === '8' || roleId === '7';
  }

  /**
   * Devuelve las columnas a mostrar, incluyendo la columna id solo si el usuario es supervisor o soporte.
   * Para rol Demo: no se muestran columnas de tipo ID en ninguna tabla.
   * @param columns Columnas base
   * @param idColumnName Nombre de la columna id (por defecto 'id', puede ser 'idExpediente', etc.)
   */
  getDisplayedColumnsWithOptionalId(columns: string[], idColumnName: string = 'id'): string[] {
    if (this.isDemoRole()) {
      return columns.filter(c => !AuthService.DEMO_HIDDEN_ID_COLUMNS.includes(c));
    }
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
