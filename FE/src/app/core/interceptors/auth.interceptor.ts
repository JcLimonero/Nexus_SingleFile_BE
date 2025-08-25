import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Por ahora solo logueamos la petición para debuggear
  console.log('🌐 Interceptando petición:', {
    url: request.url,
    method: request.method,
    headers: request.headers.keys(),
    fullUrl: request.urlWithParams
  });
  
  return next(request);
};
