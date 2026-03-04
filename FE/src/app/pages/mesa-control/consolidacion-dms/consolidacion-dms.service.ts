import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiConfigService } from '../../../core/services/api-config.service';

export interface PedidoDms {
  [key: string]: unknown;
}

export interface ConsolidacionDmsResponse {
  success?: boolean;
  status?: number;
  message?: string;
  data?: PedidoDms[] | { orders?: PedidoDms[]; data?: PedidoDms[]; results?: PedidoDms[] };
}

@Injectable({
  providedIn: 'root'
})
export class ConsolidacionDmsService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  private get apiUrl(): string {
    return this.apiConfig.getInvoicesApiUrl();
  }

  /**
   * Obtener lista de pedidos del DMS vía API NexFileinvoices.
   * @param id_agency ID de agencia externo (de Vanguardia)
   * @param delivery_month Mes de entrega (1-12)
   * @param delivery_year Año de entrega
   */
  getPedidosDms(
    id_agency: number | string,
    delivery_month: number,
    delivery_year: number
  ): Observable<{ data: PedidoDms[]; raw?: unknown }> {
    if (!id_agency || (typeof id_agency === 'number' && id_agency <= 0)) {
      return of({ data: [] });
    }

    let params = new HttpParams();
    params = params.set('id_agency', String(id_agency));
    params = params.set('delivery_month', String(delivery_month));
    params = params.set('delivery_year', String(delivery_year));
    params = params.set('perpage', '5000');

    return this.http.get<ConsolidacionDmsResponse | PedidoDms[]>(this.apiUrl, { params }).pipe(
      map(response => {
        let list: PedidoDms[] = [];
        if (Array.isArray(response)) {
          list = response;
        } else if (response && typeof response === 'object') {
          const r = response as ConsolidacionDmsResponse;
          if (r.data) {
            if (Array.isArray(r.data)) {
              list = r.data;
            } else if (Array.isArray((r.data as { orders?: PedidoDms[] }).orders)) {
              list = (r.data as { orders: PedidoDms[] }).orders;
            } else if (Array.isArray((r.data as { data?: PedidoDms[] }).data)) {
              list = (r.data as { data: PedidoDms[] }).data;
            } else if (Array.isArray((r.data as { results?: PedidoDms[] }).results)) {
              list = (r.data as { results: PedidoDms[] }).results;
            }
          }
        }
        return { data: list, raw: response };
      }),
      catchError(() => of({ data: [] }))
    );
  }

  /**
   * Obtener pedidos del DMS para múltiples agencias (un solo mes/año).
   * Cada fila incluye el campo agencyName para mostrar en la tabla.
   */
  getPedidosDmsMultiAgencias(
    agencies: { id_agency: number | string; name: string }[],
    delivery_month: number,
    delivery_year: number
  ): Observable<{ data: PedidoDms[] }> {
    if (!agencies || agencies.length === 0) {
      return of({ data: [] });
    }
    const requests = agencies.map(a =>
      this.getPedidosDms(a.id_agency, delivery_month, delivery_year).pipe(
        map(({ data }) =>
          data.map(row => ({ ...row, agencyName: a.name }))
        )
      )
    );
    return forkJoin(requests).pipe(
      map(results => ({
        data: results.reduce((acc, rows) => acc.concat(rows), [])
      })),
      catchError(() => of({ data: [] }))
    );
  }

  /**
   * Obtener pedidos del DMS para múltiples agencias y varios periodos (mes/año).
   * Combina los resultados de todos los periodos.
   */
  getPedidosDmsMultiAgenciasForPeriods(
    agencies: { id_agency: number | string; name: string }[],
    periods: { month: number; year: number }[]
  ): Observable<{ data: PedidoDms[] }> {
    if (!agencies || agencies.length === 0 || !periods || periods.length === 0) {
      return of({ data: [] });
    }
    const requests = periods.map(({ month, year }) =>
      this.getPedidosDmsMultiAgencias(agencies, month, year)
    );
    return forkJoin(requests).pipe(
      map(results => ({
        data: results.reduce((acc, r) => acc.concat(r.data), [] as PedidoDms[])
      })),
      catchError(() => of({ data: [] }))
    );
  }
}
