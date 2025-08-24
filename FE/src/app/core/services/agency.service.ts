import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Agency {
  Id: number;
  Name: string;
  SubFix?: string;
  IdAgency?: string;
  Enabled: number;
  RegistrationDate?: string;
  UpdateDate?: string;
  IdLastUserUpdate?: number;
}

export interface AgencyFilters {
  name?: string;
  region?: string;
  enabled?: number;
  date_from?: string;
  date_to?: string;
}

export interface AgencySearchParams {
  enabled?: boolean;
  search?: string;
  region?: string;
  limit?: number;
  offset?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface AgencyResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface AgencyListResponse extends AgencyResponse {
  data: {
    agencies: Agency[];
    total: number;
    limit?: number;
    offset?: number;
    count: number;
    sort_by?: string;
    sort_order?: string;
  };
}

export interface AgencyStatsResponse extends AgencyResponse {
  data: {
    total: number;
    enabled: number;
    disabled: number;
    regions: Array<{
      SubFix: string;
      count: number;
    }>;
  };
}

export interface PaginatedAgencyResponse {
  agencies: Agency[];
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private readonly API_URL = '/api/agency';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las agencias con filtros y paginación
   */
  getAgencies(params: AgencySearchParams = {}): Observable<AgencyListResponse> {
    let httpParams = new HttpParams();

    if (params.enabled !== undefined) {
      httpParams = httpParams.set('enabled', params.enabled.toString());
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.region) {
      httpParams = httpParams.set('region', params.region);
    }

    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    if (params.offset) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    if (params.sort_by) {
      httpParams = httpParams.set('sort_by', params.sort_by);
    }

    if (params.sort_order) {
      httpParams = httpParams.set('sort_order', params.sort_order);
    }

    return this.http.get<AgencyListResponse>(this.API_URL, { params: httpParams });
  }

  /**
   * Obtener agencias con paginación avanzada
   */
  getAgenciesPaginated(
    page: number = 1,
    perPage: number = 20,
    filters: AgencyFilters = {},
    sortBy: string = 'Name',
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Observable<PaginatedAgencyResponse> {
    const offset = (page - 1) * perPage;
    
    let httpParams = new HttpParams()
      .set('limit', perPage.toString())
      .set('offset', offset.toString())
      .set('sort_by', sortBy)
      .set('sort_order', sortOrder);

    // Aplicar filtros
    if (filters.name) {
      httpParams = httpParams.set('search', filters.name);
    }

    if (filters.region) {
      httpParams = httpParams.set('region', filters.region);
    }

    if (filters.enabled !== undefined) {
      httpParams = httpParams.set('enabled', filters.enabled.toString());
    }

    return this.http.get<AgencyListResponse>(this.API_URL, { params: httpParams })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            const totalPages = Math.ceil(response.data.total / perPage);
            return {
              agencies: response.data.agencies,
              total: response.data.total,
              per_page: perPage,
              current_page: page,
              total_pages: totalPages,
              has_next: page < totalPages,
              has_prev: page > 1
            };
          }
          throw new Error(response.message || 'Error al obtener agencias');
        })
      );
  }

  /**
   * Obtener agencia por ID
   */
  getAgencyById(id: number): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.API_URL}/${id}`);
  }

  /**
   * Crear nueva agencia
   */
  createAgency(agency: Partial<Agency>): Observable<AgencyResponse> {
    return this.http.post<AgencyResponse>(this.API_URL, agency);
  }

  /**
   * Actualizar agencia existente
   */
  updateAgency(id: number, agency: Partial<Agency>): Observable<AgencyResponse> {
    return this.http.put<AgencyResponse>(`${this.API_URL}/${id}`, agency);
  }

  /**
   * Eliminar agencia (soft delete por defecto)
   */
  deleteAgency(id: number, force: boolean = false): Observable<AgencyResponse> {
    const params = force ? new HttpParams().set('force', 'true') : new HttpParams();
    return this.http.delete<AgencyResponse>(`${this.API_URL}/${id}`, { params });
  }

  /**
   * Cambiar estado de habilitación de una agencia
   */
  toggleAgencyStatus(id: number): Observable<AgencyResponse> {
    return this.http.patch<AgencyResponse>(`${this.API_URL}/${id}/toggle-status`, {});
  }

  /**
   * Buscar agencias por nombre
   */
  searchAgencies(query: string): Observable<AgencyResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<AgencyResponse>(`${this.API_URL}/search`, { params });
  }

  /**
   * Obtener todas las regiones disponibles
   */
  getRegions(): Observable<AgencyResponse> {
    return this.http.get<AgencyResponse>(`${this.API_URL}/regions`);
  }

  /**
   * Obtener estadísticas de agencias
   */
  getAgencyStats(): Observable<AgencyStatsResponse> {
    return this.http.get<AgencyStatsResponse>(`${this.API_URL}/stats`);
  }

  /**
   * Obtener agencias habilitadas (para dropdowns, etc.)
   */
  getEnabledAgencies(): Observable<AgencyListResponse> {
    return this.getAgencies({ enabled: true, sort_by: 'Name', sort_order: 'ASC' });
  }

  /**
   * Obtener agencias por región
   */
  getAgenciesByRegion(region: string): Observable<AgencyListResponse> {
    return this.getAgencies({ region, enabled: true, sort_by: 'Name', sort_order: 'ASC' });
  }

  /**
   * Validar datos de agencia antes de enviar
   */
  validateAgencyData(agency: Partial<Agency>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!agency.Name || agency.Name.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (agency.Name && agency.Name.length > 600) {
      errors.push('El nombre no puede exceder 600 caracteres');
    }

    if (agency.SubFix && agency.SubFix.length > 50) {
      errors.push('El SubFix no puede exceder 50 caracteres');
    }

    if (agency.IdAgency && agency.IdAgency.length > 50) {
      errors.push('El IdAgency no puede exceder 50 caracteres');
    }

    if (agency.Enabled !== undefined && ![0, 1].includes(agency.Enabled)) {
      errors.push('El estado debe ser 0 o 1');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Preparar datos de agencia para envío
   */
  prepareAgencyData(agency: Partial<Agency>, isUpdate: boolean = false): Partial<Agency> {
    const preparedData: Partial<Agency> = {};

    if (agency.Name) {
      preparedData.Name = agency.Name.trim();
    }

    if (agency.SubFix !== undefined) {
      preparedData.SubFix = agency.SubFix || null;
    }

    if (agency.IdAgency !== undefined) {
      preparedData.IdAgency = agency.IdAgency || null;
    }

    if (agency.Enabled !== undefined) {
      preparedData.Enabled = agency.Enabled;
    }

    return preparedData;
  }

  /**
   * Mapear respuesta de agencia a interfaz local
   */
  mapAgencyResponse(response: any): Agency {
    return {
      Id: response.Id,
      Name: response.Name,
      SubFix: response.SubFix,
      IdAgency: response.IdAgency,
      Enabled: response.Enabled,
      RegistrationDate: response.RegistrationDate,
      UpdateDate: response.UpdateDate,
      IdLastUserUpdate: response.IdLastUserUpdate
    };
  }

  /**
   * Mapear múltiples respuestas de agencias
   */
  mapAgenciesResponse(response: any[]): Agency[] {
    return response.map(agency => this.mapAgencyResponse(agency));
  }
}

// Import necesario para el operador map
import { map } from 'rxjs/operators';
