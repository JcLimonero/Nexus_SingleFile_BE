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
  const isBackendCall = request.url.includes(environment.apiBaseUrl.replace('http://', '')) ||
                       request.url.startsWith('/api') ||
                       request.url.includes('192.168.190.140:401');

  if (isBackendCall) {
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
          if (error.status === 401 && !request.url.includes('/auth/refresh')) {
            // Token expirado, intentar renovar
            return handleTokenRefresh(request, next, authService, router);
          }
          return throwError(() => error);
        })
      );
    } else {
      // Si no hay token y no es una ruta de autenticación, redirigir al login
      if (!isAuthenticated && !request.url.includes('/auth/login') && !request.url.includes('/auth/refresh')) {
        // Limpiar datos de autenticación antes de redirigir
        authService.logout().subscribe({
          next: () => {
            router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          },
          error: () => {
            // Si falla el logout, redirigir de todas formas
            router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          }
        });
      }

      // IMPORTANTE: Siempre procesar la request, incluso sin token
      // El backend se encargará de devolver 401 si es necesario
      return next(request);
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
