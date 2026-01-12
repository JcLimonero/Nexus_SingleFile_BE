import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

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
                       request.url.includes('/auth/update-email');
    
    if (token && isAuthenticated) {
      // Clonar la request y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return next(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // Solo manejar 401 Unauthorized como error de autenticación
          if (error.status === 401 && !isAuthRoute) {
            // Token expirado o inválido, intentar renovar
            return handleTokenRefresh(request, next, authService, router);
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
            // Verificar si realmente no estamos autenticados (evitar loops)
            const currentToken = authService.getToken();
            const currentlyAuthenticated = authService.isAuthenticated();
            
            if (!currentToken && !currentlyAuthenticated) {
              // Solo hacer logout si realmente no hay autenticación
              // Usar setTimeout para evitar conflictos con navegación actual
              setTimeout(() => {
                // Limpiar datos localmente sin hacer logout al backend (evitar llamada HTTP)
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('current_user');
                localStorage.removeItem('token_expiration');
                
                if (router.url !== '/login') {
                  router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
                }
              }, 100);
            }
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

    // Procesar la request con la URL absoluta
    return next(absoluteRequest);
  } else if (request.url.startsWith('http')) {
    return next(request);
  } else {
    return next(request);
  }
};

/**
 * Manejar renovación automática del token
 */
function handleTokenRefresh(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {

  // Crear un subject para manejar la renovación del token
  const tokenRefreshed$ = new BehaviorSubject<boolean>(false);

  // Intentar renovar el token
  authService.refreshAccessToken().subscribe({
    next: (response) => {
      if (response.success) {
        tokenRefreshed$.next(true);
      } else {
        tokenRefreshed$.next(false);
      }
    },
    error: (error) => {
      tokenRefreshed$.next(false);
    }
  });

  // Esperar a que se complete la renovación del token
  return tokenRefreshed$.pipe(
    filter(refreshed => refreshed !== null),
    take(1),
    switchMap(refreshed => {
      if (refreshed) {
        // Token renovado, clonar la request con el nuevo token
        const newToken = authService.getToken();
        if (newToken) {
          const newRequest = request.clone({
            setHeaders: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json'
            }
          });
          return next(newRequest);
        }
      }

      // Si no se pudo renovar el token, redirigir al login
      authService.logout().subscribe({
        next: () => {
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        },
        error: () => {
          // Si falla el logout, redirigir de todas formas
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        }
      });

      return throwError(() => new Error('Token refresh failed'));
    })
  );
}
