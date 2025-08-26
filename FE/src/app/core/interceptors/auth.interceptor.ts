import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

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
  
  // Solo agregar token a llamadas del backend (puerto 8080)
  if (request.url.includes('localhost:8080')) {
    console.log('🔗 Llamada a backend:', request.url);
    
    if (token && isAuthenticated) {
      console.log('🔐 Token encontrado y usuario autenticado, agregando a headers');
      
      // Clonar la request y agregar el header de autorización
      const authRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return next(authRequest);
    } else {
      console.log('⚠️  No hay token disponible o usuario no autenticado para la llamada al backend');
      
      // Si no hay token, redirigir al login o mostrar mensaje
      if (!isAuthenticated) {
        console.log('🚫 Usuario no autenticado, redirigiendo al login...');
        // Aquí podrías redirigir al login si es necesario
      }
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
  
  // Solo llegar aquí si no se procesó la request
  return next(request);
};
