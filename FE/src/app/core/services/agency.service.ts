import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';

/** Interfaz en snake_case (igual que BD) */
export interface Agency {
  id: number | string;
  name: string;
  id_agency_dms?: string;
  id_company?: number;
  company_name?: string;
  enabled: number | string;
  registration_date?: string;
  update_date?: string;
  id_last_user_update?: number;
  last_user_update_name?: string;
  agency_connection?: string;
}

export interface AgencyFilters {
  name?: string;
  enabled?: number;
  date_from?: string;
  date_to?: string;
}

export interface AgencySearchParams {
  enabled?: boolean;
  search?: string;
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
  private readonly API_URL = 'agency';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) {}

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

    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    
    return this.http.get<AgencyListResponse>(url, { params: httpParams });
  }

  /**
   * Obtener agencias con paginación avanzada
   */
  getAgenciesPaginated(
    page: number = 1,
    perPage: number = 20,
    filters: AgencyFilters = {},
    sortBy: string = 'name',
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

    if (filters.enabled !== undefined) {
      httpParams = httpParams.set('enabled', filters.enabled.toString());
    }

    return this.http.get<AgencyListResponse>(this.apiBaseService.buildApiUrl(this.API_URL), { params: httpParams })
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
    return this.http.get<AgencyResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  /**
   * Crear nueva agencia
   */
  createAgency(agency: Partial<Agency>): Observable<AgencyResponse> {
    const payload = this.prepareAgencyData(agency);
    return this.http.post<AgencyResponse>(this.apiBaseService.buildApiUrl(this.API_URL), payload);
  }

  /**
   * Actualizar agencia existente
   */
  updateAgency(id: number, agency: Partial<Agency>): Observable<AgencyResponse> {
    const payload = this.prepareAgencyData(agency);
    return this.http.put<AgencyResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, payload);
  }

  /**
   * Eliminar agencia (soft delete por defecto)
   */
  deleteAgency(id: number, force: boolean = false): Observable<AgencyResponse> {
    const params = force ? new HttpParams().set('force', 'true') : new HttpParams();
    return this.http.delete<AgencyResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, { params });
  }

  /**
   * Cambiar estado de habilitación de una agencia
   */
  toggleAgencyStatus(id: number): Observable<AgencyResponse> {
    return this.http.patch<AgencyResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }

  /**
   * Buscar agencias por nombre
   */
  searchAgencies(query: string): Observable<AgencyResponse> {
    const params = new HttpParams().set('q', query);
    return this.http.get<AgencyResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search`, { params });
  }



  /**
   * Obtener estadísticas de agencias
   */
  getAgencyStats(): Observable<AgencyStatsResponse> {
    return this.http.get<AgencyStatsResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }

  /**
   * Obtener agencias habilitadas (para dropdowns, etc.)
   */
  getEnabledAgencies(): Observable<AgencyListResponse> {
    return this.getAgencies({ enabled: true, sort_by: 'name', sort_order: 'ASC' });
  }

  /**
   * Validar datos de agencia antes de enviar
   */
  validateAgencyData(agency: Partial<Agency>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const name = agency.name ?? (agency as any).Name;

    if (!name || String(name).trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (name && String(name).length > 600) {
      errors.push('El nombre no puede exceder 600 caracteres');
    }

    const idAgency = agency.id_agency_dms ?? (agency as any).IdAgency;
    if (idAgency && String(idAgency).length > 50) {
      errors.push('El id_agency_dms no puede exceder 50 caracteres');
    }

    const en = agency.enabled ?? (agency as any).Enabled;
    if (en !== undefined && ![0, 1].includes(Number(en))) {
      errors.push('El estado debe ser 0 o 1');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Preparar datos de agencia para envío (snake_case)
   */
  prepareAgencyData(agency: Partial<Agency>, isUpdate: boolean = false): Record<string, any> {
    const data: Record<string, any> = {};
    const name = (agency as Record<string, unknown>)['name'] ?? (agency as any).Name;
    const idAgency = (agency as Record<string, unknown>)['id_agency_dms'] ?? (agency as any).IdAgency;
    const en = (agency as Record<string, unknown>)['enabled'] ?? (agency as any).Enabled;

    if (name) data['name'] = String(name).trim();
    if (idAgency !== undefined) data['id_agency_dms'] = idAgency || undefined;
    if (en !== undefined) data['enabled'] = en;

    return data;
  }

  /**
   * Normalizar respuesta de API a interfaz Agency (acepta snake_case o PascalCase)
   */
  mapAgencyResponse(response: any): Agency {
    return {
      id: response.id ?? response.Id,
      name: response['name'] ?? response['Name'] ?? '',
      id_agency_dms: response['id_agency_dms'] ?? response['IdAgency'],
      id_company: response['id_company'] ?? response['IdCompany'],
      company_name: response['company_name'] ?? response['CompanyName'],
      enabled: String(response['enabled'] ?? response['Enabled'] ?? '0'),
      registration_date: response['registration_date'] ?? response['RegistrationDate'],
      update_date: response['update_date'] ?? response['UpdateDate'],
      id_last_user_update: response['id_last_user_update'] ?? response['IdLastUserUpdate'],
      last_user_update_name: response['last_user_update_name'] ?? response['LastUserUpdateName']
    };
  }

  mapAgenciesResponse(response: any[]): Agency[] {
    return response.map(agency => this.mapAgencyResponse(agency));
  }
}
