import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface ClienteMesa {
  idCliente: number;
  ndCliente: string;
  cliente: string;
  idHeaderClient: number;
  /** true si el cliente supera el umbral AML (operaciones por compañía en el año) */
  excedeUmbralAML?: boolean;
}

export interface ExpedienteCliente {
  idFile: number;
  ndPedido: string;
  registro: string;
  estatus: string;
  proceso: string;
  operacion: string;
  tipoCliente: string;
  agencia: string;
  idAgency: number;
  compania: string | null;
  idCliente: number;
  cliente: string;
  ndCliente: string;
  monto?: number | null;
}

export interface ClientesListResponse {
  success: boolean;
  message: string;
  data: {
    clientes: ClienteMesa[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ExpedientesResponse {
  success: boolean;
  message: string;
  data: {
    expedientes: ExpedienteCliente[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientesMesaService {
  private readonly API = 'client';

  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  list(params: { search?: string; idAgency?: number; onlyAmlUmbral?: boolean; limit?: number; offset?: number }): Observable<ClientesListResponse> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.idAgency != null) httpParams = httpParams.set('idAgency', params.idAgency.toString());
    if (params.onlyAmlUmbral) httpParams = httpParams.set('onlyAmlUmbral', '1');
    if (params.limit != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offset != null) httpParams = httpParams.set('offset', params.offset.toString());

    const url = this.apiBase.buildApiUrl(`${this.API}/list`);
    return this.http.get<ClientesListResponse>(url, { params: httpParams });
  }

  getExpedientes(idHeaderClient: number): Observable<ExpedientesResponse> {
    const url = this.apiBase.buildApiUrl(`${this.API}/${idHeaderClient}/expedientes`);
    return this.http.get<ExpedientesResponse>(url);
  }
}
