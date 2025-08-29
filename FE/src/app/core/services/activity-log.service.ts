import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface ActivityLog {
  id?: number;
  user_id: string;
  username: string;
  action: string;
  description?: string;
  change_details?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLogFilters {
  user_id?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  change_details?: string;
  limit?: number;
  offset?: number;
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLog[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface ActivityLogStats {
  total_logs: number;
  actions_count: Array<{action: string; count: number}>;
  users_count: Array<{user_id: string; username: string; count: number}>;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {
  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

  /**
   * Crear un nuevo log de actividad
   */
  createLog(log: ActivityLog): Observable<any> {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs');
    return this.http.post(url, log);
  }

  /**
   * Obtener todos los logs con filtros
   */
  getLogs(filters: ActivityLogFilters = {}): Observable<ActivityLogResponse> {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs');
    const params = this.buildQueryParams(filters);
    return this.http.get<ActivityLogResponse>(`${url}?${params}`);
  }

  /**
   * Obtener logs de un usuario específico
   */
  getUserLogs(userId: string, limit: number = 100, offset: number = 0): Observable<ActivityLogResponse> {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/user/${userId}`);
    const params = `limit=${limit}&offset=${offset}`;
    return this.http.get<ActivityLogResponse>(`${url}?${params}`);
  }

  /**
   * Obtener logs por acción específica
   */
  getActionLogs(action: string, limit: number = 100, offset: number = 0): Observable<ActivityLogResponse> {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/action/${action}`);
    const params = `limit=${limit}&offset=${offset}`;
    return this.http.get<ActivityLogResponse>(`${url}?${params}`);
  }

  /**
   * Obtener estadísticas de logs
   */
  getStats(userId?: string, startDate?: string, endDate?: string): Observable<{success: boolean; data: ActivityLogStats}> {
    const url = this.apiBaseService.buildApiUrl('user-activity-logs/stats');
    let params = '';
    
    if (userId) params += `user_id=${userId}`;
    if (startDate) params += `${params ? '&' : ''}start_date=${startDate}`;
    if (endDate) params += `${params ? '&' : ''}end_date=${endDate}`;
    
    const fullUrl = params ? `${url}?${params}` : url;
    return this.http.get<{success: boolean; data: ActivityLogStats}>(fullUrl);
  }

  /**
   * Limpiar logs antiguos
   */
  cleanOldLogs(days: number = 90): Observable<any> {
    const url = this.apiBaseService.buildApiUrl(`user-activity-logs/clean?days=${days}`);
    return this.http.delete(url);
  }

  /**
   * Log automático de acciones del usuario
   */
  logUserAction(action: string, description?: string, additionalData?: any): void {
    // Obtener información del usuario actual desde localStorage
    const currentUserStr = localStorage.getItem('current_user');
    if (!currentUserStr) return;

    try {
      const currentUser = JSON.parse(currentUserStr);
      const log: ActivityLog = {
        user_id: currentUser.id || 'unknown',
        username: currentUser.username || currentUser.name || 'unknown',
        action: action,
        description: description,
        change_details: additionalData?.change_details || undefined
      };

      // Enviar log de forma asíncrona (no bloquear la UI)
      this.createLog(log).subscribe({
        next: () => console.log('Activity log created:', action),
        error: (error) => console.error('Error creating activity log:', error)
      });
    } catch (error) {
      console.error('Error parsing current user for activity log:', error);
    }
  }

  /**
   * Log de navegación
   */
  logNavigation(url: string, method: string = 'GET'): void {
    this.logUserAction('NAVIGATION', `Navegó a ${url}`, { url, method });
  }

  /**
   * Log de login
   */
  logLogin(username: string): void {
    this.logUserAction('LOGIN', `Usuario ${username} inició sesión`, { username });
  }

  /**
   * Log de logout
   */
  logLogout(username: string): void {
    this.logUserAction('LOGOUT', `Usuario ${username} cerró sesión`, { username });
  }

  /**
   * Log de creación de registro
   */
  logCreate(entity: string, entityId: string, data?: any): void {
    this.logUserAction('CREATE', `Creó ${entity} con ID ${entityId}`, { entity, entityId, data });
  }

  /**
   * Log de actualización de registro
   */
  logUpdate(entity: string, entityId: string, data?: any): void {
    this.logUserAction('UPDATE', `Actualizó ${entity} con ID ${entityId}`, { entity, entityId, data });
  }

  /**
   * Log de eliminación de registro
   */
  logDelete(entity: string, entityId: string): void {
    this.logUserAction('DELETE', `Eliminó ${entity} con ID ${entityId}`, { entity, entityId });
  }

  /**
   * Log de búsqueda
   */
  logSearch(entity: string, query: string, results: number): void {
    this.logUserAction('SEARCH', `Buscó en ${entity}: "${query}" (${results} resultados)`, { entity, query, results });
  }

  /**
   * Log de exportación
   */
  logExport(entity: string, format: string, records: number): void {
    this.logUserAction('EXPORT', `Exportó ${records} registros de ${entity} en formato ${format}`, { entity, format, records });
  }

  /**
   * Construir parámetros de consulta
   */
  private buildQueryParams(filters: ActivityLogFilters): string {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  }
}
