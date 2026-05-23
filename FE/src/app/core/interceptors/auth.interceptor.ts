import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

// --- Refresh-token coordination (module-level shared state) ---
// Una sola llamada a refresh por vez. Si N requests reciben 401 al mismo tiempo,
// solo una dispara el refresh; las otras esperan el resultado y reintentan con
// el access_token nuevo. Esto evita gastar el refresh_token rotado en la 2da call.
let isRefreshing = false;
let refreshResult$: ReplaySubject<string | null> | null = null;

function startOrJoinRefresh(authService: AuthService): Observable<string | null> {
  if (isRefreshing && refreshResult$) {
    return refreshResult$.pipe(take(1));
  }
  isRefreshing = true;
  refreshResult$ = new ReplaySubject<string | null>(1);

  authService.refreshAccessToken().subscribe({
    next: (response) => {
      const newToken = response?.success ? authService.getToken() : null;
      refreshResult$!.next(newToken);
      refreshResult$!.complete();
      isRefreshing = false;
    },
    error: () => {
      refreshResult$!.next(null);
      refreshResult$!.complete();
      isRefreshing = false;
    }
  });

  return refreshResult$.pipe(take(1));
}

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token de autenticación
  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated();


  // Solo agregar token a llamadas del backend (usando environment o URLs relativas)
  // Extraer el host y puerto de la URL base para detectar llamadas al backend
  const apiBaseHost = environment.apiBaseUrl.replace(/^https?:\/\//, '').split('/')[0];
  const isBackendCall = request.url.includes(apiBaseHost) ||
                       request.url.startsWith('/api') ||
                       request.url.startsWith(environment.apiBaseUrl);

  if (isBackendCall) {
    // Determinar si es una ruta de autenticación (no requiere token)
    const isAuthRoute = request.url.includes('/auth/login') || 
                       request.url.includes('/auth/refresh') || 
                       request.url.includes('/auth/register') ||
                       request.url.includes('/auth/forgot-password') ||
                       request.url.includes('/auth/update-email') ||
                       request.url.includes('/miniportal/');
    
    if (token && isAuthenticated) {
      // Clonar la request y agregar el header de autorización
      // No forzar Content-Type en FormData (subidas): el navegador debe setear multipart/form-data con boundary
      const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
      if (!(request.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      const authRequest = request.clone({ setHeaders: headers });

      return next(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Solo manejar 401 Unauthorized como error de autenticación
          if (error.status === 401 && !isAuthRoute) {
            // Token expirado o inválido, intentar renovar
            return handleTokenRefresh(request, next, authService, router).pipe(
              catchError((refreshError) => {
                // Si la renovación falla, redirigir al login inmediatamente
                redirectToLogin(router, authService);
                return throwError(() => refreshError);
              })
            );
          }
          // Para otros errores (500, timeout, etc.), simplemente propagar el error
          // No redirigir al login automáticamente
          return throwError(() => error);
        })
      );
    } else {
      // Si no hay token pero es una ruta de autenticación, permitir la petición
      if (isAuthRoute) {
        return next(request);
      }
      
      // Si no hay token y no es una ruta de autenticación, procesar la petición
      // pero agregar un listener para manejar el 401 del backend
      return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
          // Solo redirigir al login si el backend devuelve 401 Unauthorized
          // NO redirigir en errores de red, timeout, 500, etc.
          if (error.status === 401 && !isAuthRoute) {
            // Redirigir al login cuando se recibe 401 (sesión expirada)
            redirectToLogin(router, authService);
          }
          // Propagar el error para que el componente lo maneje
          return throwError(() => error);
        })
      );
    }
  } else if (request.url.startsWith('/api')) {

    // Convertir URL relativa a absoluta usando la configuración del backend
    const absoluteUrl = environment.apiBaseUrl + request.url;

    // Clonar la request con la URL absoluta
    const absoluteRequest = request.clone({
      url: absoluteUrl
    });

    // Procesar la request con la URL absoluta y manejar errores 401
    return next(absoluteRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es un error 401, redirigir al login
        if (error.status === 401) {
          redirectToLogin(router, authService);
        }
        return throwError(() => error);
      })
    );
  } else if (request.url.startsWith('http')) {
    // Manejar errores 401 también en llamadas HTTP externas (como NexFile)
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es un error 401 de cualquier API, redirigir al login
        // Solo si es una llamada que requiere autenticación
        if (error.status === 401 && !request.url.includes('/auth/')) {
          redirectToLogin(router, authService);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(request);
  }
};

/**
 * Función auxiliar para redirigir al login cuando la sesión expira
 */
function redirectToLogin(router: Router, authService: AuthService): void {
  // Evitar redirecciones múltiples
  if (router.url === '/login') {
    return;
  }

  // Limpiar datos de autenticación, agencias y compañías localmente
  authService.clearLocalSession();

  // Redirigir al login con la URL actual como returnUrl
  setTimeout(() => {
    router.navigate(['/login'], { 
      queryParams: { returnUrl: router.url },
      replaceUrl: true 
    });
  }, 100);
}

/**
 * Manejar renovación automática del token. Reutiliza la promesa compartida
 * cuando múltiples requests reciben 401 al mismo tiempo (race-safe).
 */
function handleTokenRefresh(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  return startOrJoinRefresh(authService).pipe(
    switchMap(newToken => {
      if (!newToken) {
        redirectToLogin(router, authService);
        return throwError(() => new Error('Token refresh failed'));
      }
      const headers: Record<string, string> = { 'Authorization': `Bearer ${newToken}` };
      if (!(request.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      return next(request.clone({ setHeaders: headers }));
    })
  );
}
