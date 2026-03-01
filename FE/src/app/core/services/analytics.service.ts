import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  userId?: number;
  agencyId?: number;
  processId?: number;
  documentTypeId?: number;
  dateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  registrationDateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
  liberationDateRange?: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export interface UserActivityStats {
  totalLogs: number;
  uniqueUsers: number;
  topActions: Array<{ action: string; count: number }>;
  dailyActivity: Array<{ date: string; count: number }>;
  userActivity: Array<{ userId: number; username: string; count: number }>;
}

export interface DocumentStats {
  totalDocuments: number;
  documentsByType: Array<{ type: string; count: number }>;
  documentsByStatus: Array<{ status: string; count: number }>;
  documentsByAgency: Array<{ agency: string; count: number }>;
  monthlyTrend: Array<{ month: string; count: number }>;
}

export interface ProcessStats {
  totalProcesses: number;
  processesByStatus: Array<{ status: string; count: number }>;
  processesByAgency: Array<{ agency: string; count: number }>;
  averageProcessingTime: number;
  monthlyTrend: Array<{ month: string; count: number }>;
}

export interface AgencyStats {
  totalAgencies: number;
  activeAgencies: number;
  agenciesByRegion: Array<{ region: string; count: number }>;
  topPerformingAgencies: Array<{ agency: string; documents: number; processes: number }>;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalProcesses: number;
  totalAgencies: number;
  systemUptime: number;
  averageResponseTime: number;
}

export interface DistributionMetrics {
  entregados: {
    total: number;
    porcentaje: number;
  };
  canceladas: {
    total: number;
    porcentaje: number;
  };
  proceso: {
    total: number;
    porcentaje: number;
  };
  total: number;
  month: string;
  year: string;
  agency_id: number | null;
}

export interface AgencyMetrics {
  todayCases: number;
  monthlyCases: number;
  totalCases: number;
  totalUsers: number;
  monthlyAgencyCases: number;
  monthlyName: string;
}

export interface AdvisorDistributionData {
  advisorName: string;
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

export interface WeeklyData {
  day: string;
  dayName: string;
  count: number;
}

export interface AttentionPeriodData {
  range: string;
  label: string;
  count: number;
  color: string;
}

export interface CurrentMonthAttentionData {
  range: string;
  label: string;
  count: number;
  color: string;
}

export interface CurrentMonthLiberatedData {
  total: number;
  month: string;
  year: number;
}

export interface TotalLiberatedData {
  total: number;
}

export interface OrderByPeriod {
  idFile: number;
  ndCliente: number;
  ndPedido: number;
  cliente: string;
  proceso: string;
  operacion: string;
  fase: string;
  fechaAtencion: string;
  fechaCierre: string;
  diasAtencion: number;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api`;

  // Subjects para manejar estado reactivo
  private filtersSubject = new BehaviorSubject<AnalyticsFilters>({});
  public filters$ = this.filtersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Métodos para manejar filtros
  setFilters(filters: AnalyticsFilters): void {
    this.filtersSubject.next(filters);
  }

  getFilters(): AnalyticsFilters {
    return this.filtersSubject.value;
  }

  clearFilters(): void {
    this.filtersSubject.next({});
  }

  // Métodos para obtener estadísticas de actividad de usuarios
  getUserActivityStats(filters?: AnalyticsFilters): Observable<UserActivityStats> {
    // Si active_debug no está habilitado, retornar observable vacío
    if (!environment.active_debug) {
      return of({
        totalLogs: 0,
        uniqueUsers: 0,
        topActions: [],
        dailyActivity: [],
        userActivity: []
      } as UserActivityStats);
    }

    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/user-activity-logs/stats`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  getUserActivityLogs(filters?: AnalyticsFilters, limit = 100, offset = 0): Observable<any> {
    // Si active_debug no está habilitado, retornar observable vacío
    if (!environment.active_debug) {
      return of([]);
    }

    const params = this.buildParams(filters);
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());

    return this.http.get<any>(`${this.baseUrl}/user-activity-logs`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  // Métodos para obtener estadísticas de documentos
  getDocumentStats(filters?: AnalyticsFilters): Observable<DocumentStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-document-statistics`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  // Métodos para obtener estadísticas de procesos
  getProcessStats(filters?: AnalyticsFilters): Observable<ProcessStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-process-statistics`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  // Métodos para obtener estadísticas de agencias
  getAgencyStats(filters?: AnalyticsFilters): Observable<AgencyStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-agency-statistics`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  // Métodos para obtener métricas específicas de agencia
  getAgencyMetrics(filters?: AnalyticsFilters): Observable<AgencyMetrics> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-agency-specific-metrics`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getDistributionMetrics(filters?: AnalyticsFilters): Observable<DistributionMetrics> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-file-distribution-metrics`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  getProcessDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-process-distribution`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-status-distribution`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getCurrentMonthStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-current-month-status`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getPreviousMonthsData(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-previous-months`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getHistoricalStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);

    return this.http.get<any>(`${this.baseUrl}/analytics/widget-historical-status`, { params })
      .pipe(
        map(response => response.data || response)
      );
  }

  getTrendData(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-file-trend-chart`, { params })
      .pipe(
        map(response => response.data || response),
      );
  }

  // Métodos para obtener métricas del sistema (una sola llamada al backend)
  getSystemMetrics(): Observable<SystemMetrics> {
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-system-overview-metrics`).pipe(
      map((res) => ({
        totalUsers: res.data?.totalUsers || 0,
        activeUsers: res.data?.activeUsers || 0,
        totalDocuments: res.data?.totalDocuments || 0,
        totalProcesses: res.data?.totalProcesses || 0,
        totalAgencies: res.data?.totalAgencies || 0,
        systemUptime: res.data?.systemUptime ?? 99.9,
        averageResponseTime: res.data?.averageResponseTime ?? 150
      }))
    );
  }

  /**
   * Obtener datos combinados del dashboard - UNA SOLA llamada API (más rápido)
   */
  getDashboardData(filters?: AnalyticsFilters): Observable<{
    userActivity: UserActivityStats;
    documents: DocumentStats;
    processes: ProcessStats;
    agencies: AgencyStats;
    system: SystemMetrics;
  }> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/dashboard`, { params }).pipe(
      map((res) => {
        if (res?.success && res?.data) {
          return res.data;
        }
        throw new Error('Respuesta inválida del dashboard');
      }),
      catchError(() =>
        combineLatest([
          this.getUserActivityStats(filters),
          this.getDocumentStats(filters),
          this.getProcessStats(filters),
          this.getAgencyStats(filters),
          this.getSystemMetrics()
        ]).pipe(
          map(([userActivity, documents, processes, agencies, system]) => ({
            userActivity,
            documents,
            processes,
            agencies,
            system
          }))
        )
      )
    );
  }

  // Método para exportar datos
  exportAnalytics(format: 'pdf' | 'excel', filters?: AnalyticsFilters): Observable<Blob> {
    const params = this.buildParams(filters);
    params.set('format', format);

    return this.http.get(`${this.baseUrl}/analytics/export`, {
      params,
      responseType: 'blob'
    });
  }

  // Método auxiliar para construir parámetros de consulta
  private buildParams(filters?: any): HttpParams {
    let params = new HttpParams();

    if (filters) {
      // Manejar filtros de fecha (prioridad: dateRange > startDate/endDate individuales)
      if (filters.dateRange && filters.dateRange.startDate && filters.dateRange.endDate) {
        params = params.set('start_date', filters.dateRange.startDate.toISOString().split('T')[0]);
        params = params.set('end_date', filters.dateRange.endDate.toISOString().split('T')[0]);
      } else {
        if (filters.startDate) params = params.set('start_date', filters.startDate);
        if (filters.endDate) params = params.set('end_date', filters.endDate);
      }

      // Filtro de fecha de registro
      if (filters.registrationDateRange && filters.registrationDateRange.startDate && filters.registrationDateRange.endDate) {
        params = params.set('registration_start_date', filters.registrationDateRange.startDate.toISOString().split('T')[0]);
        params = params.set('registration_end_date', filters.registrationDateRange.endDate.toISOString().split('T')[0]);
      }

      // Filtro de fecha de liberación
      if (filters.liberationDateRange && filters.liberationDateRange.startDate && filters.liberationDateRange.endDate) {
        params = params.set('liberation_start_date', filters.liberationDateRange.startDate.toISOString().split('T')[0]);
        params = params.set('liberation_end_date', filters.liberationDateRange.endDate.toISOString().split('T')[0]);
      }

      if (filters.userId) params = params.set('user_id', filters.userId.toString());
      if (filters.agencyId) params = params.set('agency_id', filters.agencyId.toString());
      if (filters.agency_id) params = params.set('agency_id', filters.agency_id.toString()); // Agregado para compatibilidad
      if (filters.idSeller) params = params.set('idSeller', filters.idSeller.toString()); // Agregado para trend chart
      if (filters.year) params = params.set('year', filters.year.toString()); // Agregado para trend chart
      if (filters.processId) params = params.set('process_id', filters.processId.toString());
      if (filters.documentTypeId) params = params.set('document_type_id', filters.documentTypeId.toString());
    }

    return params;
  }

  // Método para obtener distribución de expedientes por asesor
  getAdvisorDistribution(agencyId?: string | null, userId?: string | null): Observable<AdvisorDistributionData[]> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/advisor-distribution`, { params })
      .pipe(
        map(response => {
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          return of([]);
        })
      );
  }

  getWeeklyData(agencyId?: string | null, userId?: string | null): Observable<WeeklyData[]> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/weekly-data`, { params })
      .pipe(
        map(response => {
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          return of([]);
        })
      );
  }

  getAttentionPeriodData(agencyId?: string | null, userId?: string | null): Observable<AttentionPeriodData[]> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/attention-period`, { params })
      .pipe(
        map(response => {
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          return of([]);
        })
      );
  }

  getCurrentMonthAttentionData(agencyId?: string | null, userId?: string | null): Observable<CurrentMonthAttentionData[]> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/current-month-attention`, { params })
      .pipe(
        map(response => {
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          return of([]);
        })
      );
  }

  /**
   * Obtener datos de expedientes liberados del mes actual
   */
  getCurrentMonthLiberated(agencyId?: string | null, userId?: string | null): Observable<CurrentMonthLiberatedData> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/current-month-liberated`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          return { total: 0, month: '', year: new Date().getFullYear() };
        }),
        catchError(error => {
          return of({ total: 0, month: '', year: new Date().getFullYear() });
        })
      );
  }

  /**
   * Obtener datos de expedientes liberados totales (toda la historia)
   */
  getTotalLiberated(agencyId?: string | null, userId?: string | null): Observable<TotalLiberatedData> {
    let params = new HttpParams();

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/total-liberated`, { params })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data;
          }
          return { total: 0 };
        }),
        catchError(error => {
          return of({ total: 0 });
        })
      );
  }

  getOrdersByAttentionPeriod(range: string, agencyId?: string | null, userId?: string | null, currentMonth?: boolean, liberatedOnly?: boolean): Observable<OrderByPeriod[]> {
    let params = new HttpParams();

    params = params.set('range', range);

    if (agencyId) {
      params = params.set('agency_id', agencyId);
    }

    if (userId) {
      params = params.set('user_id', userId);
    }

    if (currentMonth) {
      params = params.set('current_month', 'true');
    }

    if (liberatedOnly) {
      params = params.set('liberated_only', 'true');
    }

    return this.http.get<any>(`${this.baseUrl}/analytics/orders-by-attention-period`, { params })
      .pipe(
        map(response => {
          if (response && response.success && Array.isArray(response.data)) {
            return response.data;
          }
          return [];
        }),
        catchError(error => {
          return of([]);
        })
      );
  }

  // Métodos para obtener datos en tiempo real (para futuras implementaciones con WebSockets)
  getRealTimeMetrics(): Observable<any> {
    // Esto se implementará cuando agreguemos WebSockets
    return new Observable(observer => {
      // Placeholder para implementación futura
      observer.next({});
    });
  }

  // Método para obtener métricas de rendimiento
  getPerformanceMetrics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/analytics/performance`)
      .pipe(
        map(response => response.data || response),
      );
  }
}
