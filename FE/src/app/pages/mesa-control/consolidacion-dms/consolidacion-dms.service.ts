import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

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
  private get apiUrl(): string {
    return environment.vanguardia.invoicesApiUrl;
  }

  private readonly vanguardiaToken = 'b26e88c4-ddbe-4adb-a214-4667f454824a';

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista de pedidos del DMS vía API singlefileinvoices.
   * @param idAgency IdAgency externo de la agencia seleccionada (de Vanguardia)
   * @param deliveryMonth Mes de entrega (1-12)
   * @param deliveryYear Año de entrega
   */
  getPedidosDms(
    idAgency: number | string,
    deliveryMonth: number,
    deliveryYear: number
  ): Observable<{ data: PedidoDms[]; raw?: unknown }> {
    if (!idAgency || (typeof idAgency === 'number' && idAgency <= 0)) {
      return of({ data: [] });
    }

    let params = new HttpParams();
    params = params.set('idAgency', String(idAgency));
    params = params.set('delivery_month', String(deliveryMonth));
    params = params.set('delivery_year', String(deliveryYear));
    params = params.set('perpage', '5000');

    const headers = {
      'X-Provider-Token': this.vanguardiaToken
    };

    return this.http.get<ConsolidacionDmsResponse | PedidoDms[]>(this.apiUrl, { params, headers }).pipe(
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
   * Cada fila incluye el campo `agencyName` para mostrar en la tabla.
   */
  getPedidosDmsMultiAgencias(
    agencies: { idAgency: number | string; name: string }[],
    deliveryMonth: number,
    deliveryYear: number
  ): Observable<{ data: PedidoDms[] }> {
    if (!agencies || agencies.length === 0) {
      return of({ data: [] });
    }
    const requests = agencies.map(a =>
      this.getPedidosDms(a.idAgency, deliveryMonth, deliveryYear).pipe(
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
    agencies: { idAgency: number | string; name: string }[],
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
