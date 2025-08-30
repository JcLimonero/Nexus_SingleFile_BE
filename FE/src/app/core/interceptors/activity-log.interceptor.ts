import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ActivityLogService } from '../services/activity-log.service';

/**
 * Interceptor para registrar actividades del usuario
 * SOLO registra las siguientes acciones:
 * - LOGIN: Inicio de sesión
 * - LOGOUT: Cierre de sesión  
 * - CREATE: Creación de registros
 * - UPDATE: Actualización de registros
 * - DELETE: Eliminación de registros
 * - EXPORT: Exportación de datos
 * 
 * NO registra: búsquedas, visualizaciones, estadísticas, etc.
 */
export const ActivityLogInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const activityLogService = inject(ActivityLogService);
  const startTime = Date.now();
  
  // No loggear peticiones de logs para evitar recursión
  if (request.url.includes('user-activity-logs')) {
    return next(request);
  }

  return next(request).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const executionTime = Date.now() - startTime;
        
        // Determinar la acción basada en la URL y método
        const action = determineAction(request.url, request.method);
        
        if (action) {
          // Capturar detalles del cambio basado en el tipo de acción
          const changeDetails = getChangeDetails(request, event, action);
          
          activityLogService.logUserAction(
            action.type,
            action.description,
            {
              change_details: changeDetails
            }
          );
        }
      }
    })
  );
};

/**
 * Determinar la acción basada en la URL y método HTTP
 */
function determineAction(url: string, method: string): { type: string; description: string } | null {
  // Login
  if (url.includes('/auth/login') && method === 'POST') {
    return { type: 'LOGIN', description: 'Inicio de sesión' };
  }

  // Logout
  if (url.includes('/auth/logout') && method === 'POST') {
    return { type: 'LOGOUT', description: 'Cierre de sesión' };
  }

  // Crear registros
  if (method === 'POST' && !url.includes('/auth/')) {
    const entity = extractEntityFromUrl(url);
    return { type: 'CREATE', description: `Creación de ${entity}` };
  }

  // Actualizar registros
  if (method === 'PUT' || method === 'PATCH') {
    const entity = extractEntityFromUrl(url);
    return { type: 'UPDATE', description: `Actualización de ${entity}` };
  }

  // Eliminar registros
  if (method === 'DELETE') {
    const entity = extractEntityFromUrl(url);
    return { type: 'DELETE', description: `Eliminación de ${entity}` };
  }

  // Exportar datos
  if (url.includes('/export') || url.includes('/download') || url.includes('/excel')) {
    const entity = extractEntityFromUrl(url);
    return { type: 'EXPORT', description: `Exportación de ${entity}` };
  }

  // Solo registrar las acciones especificadas: LOGIN, LOGOUT, CREATE, UPDATE, DELETE, EXPORT
  // No registrar: SEARCH, VIEW, VIEW_STATS, etc.
  return null;
}

/**
 * Obtener detalles específicos del cambio realizado
 */
function getChangeDetails(request: HttpRequest<unknown>, response: HttpResponse<unknown>, action: { type: string; description: string }): string {
  try {
    const url = request.url;
    const method = request.method;
    const body = request.body;
    
    // Construir objeto con toda la información de la request
    const requestInfo: any = {
      method: method,
      url: url,
      timestamp: new Date().toISOString()
    };
    
    // Agregar body si existe
    if (body && typeof body === 'object') {
      requestInfo.requestBody = body;
    }
    
    // Agregar parámetros de query si existen
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    if (urlParams.toString()) {
      const queryParams: any = {};
      urlParams.forEach((value, key) => {
        // Sanitizar parámetros de query
        if (isSensitiveField(key)) {
          queryParams[key] = '[CAMPO SENSIBLE OCULTO]';
        } else {
          queryParams[key] = value;
        }
      });
      requestInfo.queryParams = queryParams;
    }
    
    // Detalles específicos según el tipo de acción
    switch (action.type) {
      case 'LOGIN':
        // Para login, mostrar información básica sin datos sensibles
        const loginInfo = {
          action: 'LOGIN',
          timestamp: new Date().toISOString(),
          url: url,
          method: method,
          note: 'Datos de autenticación ocultos por seguridad'
        };
        return `Usuario inició sesión en el sistema - ${JSON.stringify(loginInfo)}`;
        
      case 'LOGOUT':
        // Para logout, mostrar información básica
        const logoutInfo = {
          action: 'LOGOUT',
          timestamp: new Date().toISOString(),
          url: url,
          method: method
        };
        return `Usuario cerró sesión del sistema - ${JSON.stringify(logoutInfo)}`;
        
      case 'CREATE':
        const entity = extractEntityFromUrl(url);
        return `Creación de ${entity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
        
      case 'UPDATE':
        const updateEntity = extractEntityFromUrl(url);
        return `Actualización de ${updateEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
        
      case 'DELETE':
        const deleteEntity = extractEntityFromUrl(url);
        return `Eliminación de ${deleteEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
        
      case 'EXPORT':
        const exportEntity = extractEntityFromUrl(url);
        return `Exportación de ${exportEntity} - ${JSON.stringify(sanitizeRequestData(requestInfo))}`;
        
      default:
        // Solo registrar las acciones especificadas
        return `Acción: ${action.description}`;
    }
  } catch (error) {
    return `Acción: ${action.description}`;
  }
}

/**
 * Extraer el nombre de la entidad de la URL
 */
function extractEntityFromUrl(url: string): string {
  // Remover parámetros de query
  const cleanUrl = url.split('?')[0];
  
  // Extraer el último segmento de la URL
  const segments = cleanUrl.split('/').filter(segment => segment.length > 0);
  
  if (segments.length === 0) return 'recurso';
  
  // Mapear URLs a nombres más legibles
  const entityMap: { [key: string]: string } = {
    'agency': 'agencia',
    'process': 'proceso',
    'operation-type': 'tipo de operación',
    'costumer-type': 'tipo de cliente',
    'document-type': 'tipo de documento',
    'file-status': 'estado de archivo',
    'user': 'usuario',
    'user-role': 'rol de usuario',
    'user-access': 'acceso de usuario',
    'user-agency': 'agencia de usuario'
  };
  
  const lastSegment = segments[segments.length - 1];
  return entityMap[lastSegment] || lastSegment;
}

/**
 * Verificar si la URL es de un recurso específico
 */
function isResourceUrl(url: string): boolean {
  // URLs que representan recursos específicos (no listas)
  const resourcePatterns = [
    /\/(\d+)$/, // URLs que terminan en ID numérico
    /\/[a-f0-9-]{36}$/, // URLs que terminan en UUID
    /\/[a-zA-Z0-9]{24}$/ // URLs que terminan en ObjectId de MongoDB
  ];
  
  return resourcePatterns.some(pattern => pattern.test(url));
}

/**
 * Sanitizar datos de request para el log
 */
function sanitizeRequestData(data: any): string | null {
  if (!data) return null;
  
  try {
    // Crear una copia profunda del objeto para no modificar el original
    const sanitized = JSON.parse(JSON.stringify(data));
    
    // Lista de campos sensibles que deben ser removidos
    const sensitiveFields = [
      'password', 'pass', 'Pass', 'Password',
      'confirmPassword', 'confirm_password', 'ConfirmPassword',
      'oldPassword', 'old_password', 'OldPassword',
      'newPassword', 'new_password', 'NewPassword',
      'token', 'Token', 'access_token', 'accessToken', 'AccessToken',
      'refresh_token', 'refreshToken', 'RefreshToken',
      'secret', 'Secret', 'api_key', 'apiKey', 'ApiKey',
      'private_key', 'privateKey', 'PrivateKey',
      'authorization', 'Authorization', 'auth', 'Auth',
      'session', 'Session', 'cookie', 'Cookie',
      'credit_card', 'creditCard', 'CreditCard',
      'ssn', 'SSN', 'social_security', 'socialSecurity',
      'phone', 'Phone', 'telephone', 'Telephone',
      'email', 'Email', 'mail', 'Mail'
    ];
    
    // Función recursiva para remover campos sensibles
    function removeSensitiveFields(obj: any): void {
      if (obj && typeof obj === 'object') {
        // Manejar arrays
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
              removeSensitiveFields(item);
            }
          });
          return;
        }
        
        // Manejar objetos
        Object.keys(obj).forEach(key => {
          if (sensitiveFields.includes(key)) {
            obj[key] = '[CAMPO SENSIBLE OCULTO]';
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            removeSensitiveFields(obj[key]);
          }
        });
      }
    }
    
    // Aplicar sanitización
    removeSensitiveFields(sanitized);
    
    // Limitar el tamaño del JSON para evitar logs muy largos
    const jsonString = JSON.stringify(sanitized, null, 2);
    const maxLength = 2000; // Máximo 2000 caracteres
    
    if (jsonString.length > maxLength) {
      return jsonString.substring(0, maxLength) + '... [TRUNCADO]';
    }
    
    return jsonString;
    
  } catch (error) {
    console.warn('Error al sanitizar datos de request:', error);
    return '[Datos no serializables]';
  }
}

/**
 * Verificar si un campo es sensible
 */
function isSensitiveField(fieldName: string): boolean {
  const sensitiveFields = [
    'password', 'pass', 'Pass', 'Password',
    'confirmPassword', 'confirm_password', 'ConfirmPassword',
    'oldPassword', 'old_password', 'OldPassword',
    'newPassword', 'new_password', 'NewPassword',
    'token', 'Token', 'access_token', 'accessToken', 'AccessToken',
    'refresh_token', 'refreshToken', 'RefreshToken',
    'secret', 'Secret', 'api_key', 'apiKey', 'ApiKey',
    'private_key', 'privateKey', 'PrivateKey',
    'authorization', 'Authorization', 'auth', 'Auth',
    'session', 'Session', 'cookie', 'Cookie',
    'credit_card', 'creditCard', 'CreditCard',
    'ssn', 'SSN', 'social_security', 'socialSecurity',
    'phone', 'Phone', 'telephone', 'Telephone',
    'email', 'Email', 'mail', 'Mail'
  ];
  
  return sensitiveFields.some(field => 
    fieldName.toLowerCase().includes(field.toLowerCase())
  );
}

/**
 * Obtener el tamaño de la respuesta
 */
function getResponseSize(response: HttpResponse<any>): number {
  try {
    const responseText = JSON.stringify(response.body);
    return new Blob([responseText]).size;
  } catch (error) {
    return 0;
  }
}
