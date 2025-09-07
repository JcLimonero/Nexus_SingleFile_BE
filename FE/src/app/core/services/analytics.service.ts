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
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/user-activity-logs/stats`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('User Activity Stats:', data))
      );
  }

  getUserActivityLogs(filters?: AnalyticsFilters, limit = 100, offset = 0): Observable<any> {
    const params = this.buildParams(filters);
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());
    
    return this.http.get<any>(`${this.baseUrl}/user-activity-logs`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('User Activity Logs:', data))
      );
  }

  // Métodos para obtener estadísticas de documentos
  getDocumentStats(filters?: AnalyticsFilters): Observable<DocumentStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-document-statistics`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('Document Stats:', data))
      );
  }

  // Métodos para obtener estadísticas de procesos
  getProcessStats(filters?: AnalyticsFilters): Observable<ProcessStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-process-statistics`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('Process Stats:', data))
      );
  }

  // Métodos para obtener estadísticas de agencias
  getAgencyStats(filters?: AnalyticsFilters): Observable<AgencyStats> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-agency-statistics`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('Agency Stats:', data))
      );
  }

  // Métodos para obtener métricas específicas de agencia
  getAgencyMetrics(filters?: AnalyticsFilters): Observable<AgencyMetrics> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getAgencyMetrics called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-agency-specific-metrics?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-agency-specific-metrics`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Agency Metrics:', data))
      );
  }

  getDistributionMetrics(filters?: AnalyticsFilters): Observable<DistributionMetrics> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-file-distribution-metrics`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('Distribution Metrics:', data))
      );
  }

  getProcessDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getProcessDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-process-distribution?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-process-distribution`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Process Distribution:', data))
      );
  }

  getStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-status-distribution?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-status-distribution`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Status Distribution:', data))
      );
  }

  getCurrentMonthStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getCurrentMonthStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-current-month-status?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-current-month-status`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Current Month Status Distribution:', data))
      );
  }

  getPreviousMonthsData(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getPreviousMonthsData called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-previous-months?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-previous-months`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Previous Months Data:', data))
      );
  }

  getHistoricalStatusDistribution(filters?: any): Observable<any[]> {
    const params = this.buildParams(filters);
    console.log('🔧 AnalyticsService: getHistoricalStatusDistribution called with filters:', filters);
    console.log('🔧 AnalyticsService: Built params:', params.toString());
    console.log('🔧 AnalyticsService: Full URL:', `${this.baseUrl}/analytics/widget-historical-status?${params.toString()}`);
    
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-historical-status`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('🔧 AnalyticsService: Received Historical Status Distribution:', data))
      );
  }

  getTrendData(filters?: any): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.baseUrl}/analytics/widget-file-trend-chart`, { params })
      .pipe(
        map(response => response.data || response),
        tap(data => console.log('Trend Data:', data))
      );
  }

  // Métodos para obtener métricas del sistema
  getSystemMetrics(): Observable<SystemMetrics> {
    return combineLatest([
      this.http.get<any>(`${this.baseUrl}/analytics/widget-system-overview-metrics`),
      this.http.get<any>(`${this.baseUrl}/analytics/widget-document-statistics`),
      this.http.get<any>(`${this.baseUrl}/analytics/widget-process-statistics`),
      this.http.get<any>(`${this.baseUrl}/analytics/widget-agency-statistics`)
    ]).pipe(
      map(([userStats, docStats, processStats, agencyStats]) => {
        return {
          totalUsers: userStats.data?.totalUsers || 0,
          activeUsers: userStats.data?.activeUsers || 0,
          totalDocuments: docStats.data?.totalDocuments || 0,
          totalProcesses: processStats.data?.totalProcesses || 0,
          totalAgencies: agencyStats.data?.totalAgencies || 0,
          systemUptime: 99.9, // Esto debería venir del backend
          averageResponseTime: 150 // Esto debería venir del backend
        };
      }),
      tap(data => console.log('System Metrics:', data))
    );
  }

  // Método para obtener datos combinados del dashboard
  getDashboardData(filters?: AnalyticsFilters): Observable<{
    userActivity: UserActivityStats;
    documents: DocumentStats;
    processes: ProcessStats;
    agencies: AgencyStats;
    system: SystemMetrics;
  }> {
    return combineLatest([
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
          console.error('Error en getAdvisorDistribution:', error);
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
          console.error('Error en getWeeklyData:', error);
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
          console.error('Error en getAttentionPeriodData:', error);
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
          console.error('Error en getCurrentMonthAttentionData:', error);
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
        tap(data => console.log('Performance Metrics:', data))
      );
  }
}
