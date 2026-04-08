import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PanelSoporteService {
  private readonly base = `${environment.apiBaseUrl}/api/support`;

  constructor(private http: HttpClient) {}

  malRelacionados(options: {
    idAgencia?: number | null;
    excluirCancelados?: boolean;
    limite?: number;
  }): Observable<unknown> {
    let params = new HttpParams();
    if (options.idAgencia != null) {
      params = params.set('idAgencia', String(options.idAgencia));
    }
    if (options.excluirCancelados === false) {
      params = params.set('excluirCancelados', '0');
    } else {
      params = params.set('excluirCancelados', '1');
    }
    const lim = options.limite ?? 2000;
    params = params.set('limite', String(lim));
    return this.http.get(`${this.base}/mal-relacionados`, { params });
  }

  duplicadosPedido(options: { idAgencia?: number | null; limite?: number }): Observable<unknown> {
    let params = new HttpParams();
    if (options.idAgencia != null) {
      params = params.set('idAgencia', String(options.idAgencia));
    }
    params = params.set('limite', String(options.limite ?? 500));
    return this.http.get(`${this.base}/duplicados-pedido`, { params });
  }

  /**
   * GET /api/support/diagnostico-expediente — idFile o idPedido (con idAgencia opcional para una sola agencia).
   */
  diagnosticoExpediente(options: {
    idFile?: number | null;
    idPedido?: string | null;
    idAgencia?: number | null;
  }): Observable<unknown> {
    let params = new HttpParams();
    if (options.idFile != null && options.idFile > 0) {
      params = params.set('idFile', String(options.idFile));
    } else {
      const ped = (options.idPedido ?? '').trim();
      if (ped !== '') {
        params = params.set('idPedido', ped);
      }
      if (options.idAgencia != null) {
        params = params.set('idAgencia', String(options.idAgencia));
      }
    }
    return this.http.get(`${this.base}/diagnostico-expediente`, { params });
  }

  /**
   * GET /api/support/analisis-cliente-dms — ndCliente = IdTotalDealer (DMS), idAgencia opcional.
   */
  analisisClienteDms(ndCliente: string, idAgencia?: number | null): Observable<unknown> {
    let params = new HttpParams().set('ndCliente', ndCliente.trim());
    if (idAgencia != null) {
      params = params.set('idAgencia', String(idAgencia));
    }
    return this.http.get(`${this.base}/analisis-cliente-dms`, { params });
  }

  /**
   * POST /api/files/repair-client-relation — enlaza File.IdClient según view_client_relations (nd + agencia).
   */
  repairClientRelation(body: {
    ndDMS: string;
    idAgency: number;
    idExpediente: number;
  }): Observable<unknown> {
    const url = `${environment.apiBaseUrl}/api/files/repair-client-relation`;
    return this.http.post(url, {
      ndDMS: body.ndDMS.trim(),
      idAgency: body.idAgency,
      idExpediente: body.idExpediente
    });
  }
}
