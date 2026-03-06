import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiConfigService } from '../../../core/services/api-config.service';

export interface PedidoDms {
  [key: string]: unknown;
}

export interface ConsolidacionDmsApiResponse {
  success?: boolean;
  data?: PedidoDms[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Una sola llamada al backend con múltiples agencias y periodos.
 * Paginación en servidor.
 */
@Injectable({
  providedIn: 'root'
})
export class ConsolidacionDmsService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Obtener pedidos del DMS en una sola llamada.
   * Filtro por release_date (fecha de liberación).
   * @param idAgencies IDs de agencia DMS (ej: ['88888','99999'])
   * @param releaseDateFrom Fecha inicio (YYYY-MM-DD)
   * @param releaseDateTo Fecha fin (YYYY-MM-DD)
   * @param page Página (1-based)
   * @param limit Registros por página
   * @param agencyNames Mapa opcional id_agency -> nombre para mostrar
   */
  getPedidosPaginados(
    idAgencies: string[],
    releaseDateFrom: string,
    releaseDateTo: string,
    page: number = 1,
    limit: number = 50,
    agencyNames?: Record<string, string>,
    filterEstatus: number = -1
  ): Observable<{ data: PedidoDms[]; total: number; page: number; limit: number }> {
    if (!idAgencies?.length || !releaseDateFrom || !releaseDateTo) {
      return of({ data: [], total: 0, page: 1, limit });
    }

    let params = new HttpParams()
      .set('id_agencies', idAgencies.join(','))
      .set('release_date_from', releaseDateFrom)
      .set('release_date_to', releaseDateTo)
      .set('page', String(page))
      .set('limit', String(limit))
      .set('filter_estatus', String(filterEstatus));

    if (agencyNames && Object.keys(agencyNames).length > 0) {
      const pairs = Object.entries(agencyNames).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join(';');
      params = params.set('agency_names', pairs);
    }

    const url = this.apiConfig.getConsolidacionDmsUrl();
    return this.http.get<ConsolidacionDmsApiResponse>(url, { params }).pipe(
      map(res => ({
        data: res?.data ?? [],
        total: res?.total ?? 0,
        page: res?.page ?? page,
        limit: res?.limit ?? limit,
      })),
      catchError(() => of({ data: [], total: 0, page: 1, limit }))
    );
  }
}
