import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  
  // Debug completo de la petición
  console.log('🔍 Interceptor - URL completa:', request.url);
  console.log('🔍 Interceptor - Método:', request.method);
  console.log('🔍 Interceptor - URL incluye localhost:8080:', request.url.includes('localhost:8080'));
  console.log('🔍 Interceptor - URL empieza con /api:', request.url.startsWith('/api'));
  console.log('🔍 Interceptor - URL empieza con http:', request.url.startsWith('http'));
  
  // Obtener el token de autenticación
  const token = authService.getToken();
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('🔐 Interceptor - Token disponible:', !!token);
  console.log('🔐 Interceptor - Token valor:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('🔐 Interceptor - Usuario autenticado:', isAuthenticated);
  console.log('🔐 Interceptor - Usuario actual:', authService.getCurrentUser());
  
  // Solo agregar token a llamadas del backend (usando environment)
  if (request.url.includes(environment.apiBaseUrl.replace('http://', ''))) {
    console.log('🔗 Llamada a backend:', request.url);
    
    if (token && isAuthenticated) {
      console.log('🔐 Token encontrado y usuario autenticado, agregando a headers');
      console.log('🔐 Headers antes:', request.headers.keys());
      
      // Clonar la request y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔐 Headers después:', authRequest.headers.keys());
      console.log('🔐 Authorization header:', authRequest.headers.get('Authorization'));
      
      return next(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !request.url.includes('/auth/refresh')) {
            // Token expirado, intentar renovar
            console.log('🔄 Token expirado, intentando renovar...');
            return handleTokenRefresh(request, next, authService);
          }
          return throwError(() => error);
        })
      );
    } else {
      console.log('⚠️  No hay token disponible o usuario no autenticado para la llamada al backend');
      console.log('⚠️  Token:', !!token);
      console.log('⚠️  Autenticado:', isAuthenticated);
      
      // Si no hay token, redirigir al login o mostrar mensaje
      if (!isAuthenticated) {
        console.log('🚫 Usuario no autenticado, redirigiendo al login...');
        // Aquí podrías redirigir al login si es necesario
      }
      
      // IMPORTANTE: Siempre procesar la request, incluso sin token
      // El backend se encargará de devolver 401 si es necesario
      return next(request);
    }
  } else if (request.url.startsWith('/api')) {
    console.log('⚠️  Llamada local detectada:', request.url);
    
    // Para URLs locales que empiezan con /api, no hacer nada especial
    // Estas URLs serán procesadas por el navegador como relativas al puerto actual
    return next(request);
  } else if (request.url.startsWith('http')) {
    console.log('🌐 Llamada a URL externa:', request.url);
    return next(request);
  } else {
    console.log('❓ URL no reconocida:', request.url);
    return next(request);
  }
};

/**
 * Manejar renovación automática del token
 */
function handleTokenRefresh(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  
  // Crear un subject para manejar la renovación del token
  const tokenRefreshed$ = new BehaviorSubject<boolean>(false);
  
  // Intentar renovar el token
  authService.refreshAccessToken().subscribe({
    next: (response) => {
      if (response.success) {
        console.log('✅ Token renovado exitosamente');
        tokenRefreshed$.next(true);
      } else {
        console.log('❌ Error renovando token:', response.message);
        tokenRefreshed$.next(false);
      }
    },
    error: (error) => {
      console.log('❌ Error renovando token:', error);
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
          console.log('🔄 Reintentando request con nuevo token');
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
      console.log('🚫 No se pudo renovar el token, redirigiendo al login');
      // Aquí podrías redirigir al login
      return throwError(() => new Error('Token refresh failed'));
    })
  );
}
