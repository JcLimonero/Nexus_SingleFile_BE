import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { mapClientesMesaResponse } from '../utils/api-mappers';

export interface ClienteMesa {
  idCliente: number;
  ndCliente: string;
  cliente: string;
  /** id del header del cliente (backend puede enviar idClientHeader o idHeaderClient) */
  idHeaderClient: number;
  idClientHeader?: number;
  /** true si el cliente supera el umbral PLD (operaciones por razón social en el año) */
  excedeUmbralAML?: boolean;
}

export interface DocumentoLiquidacion {
  idFileDocument: number;
  documento: string;
  monto: number;
  idPaymentMethod?: number | null;
  tipoPago: string;
  documentContainer: string | null;
  fechaPago?: string | null;
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
  documentosLiquidacion?: DocumentoLiquidacion[];
}

export interface ClientesListResponse {
  success: boolean;
  message: string;
  data: {
    clientes: ClienteMesa[];
    total: number;
    limit: number;
    offset: number;
    /** Umbral PLD configurado (MXN) - operaciones que superan este monto activan la alerta */
    amlUmbral?: number;
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

  list(params: { search?: string; idAgency?: number; idCompany?: number; onlyAmlUmbral?: boolean; limit?: number; offset?: number }): Observable<ClientesListResponse> {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.idAgency != null) httpParams = httpParams.set('idAgency', params.idAgency.toString());
    if (params.idCompany != null) httpParams = httpParams.set('idCompany', params.idCompany.toString());
    if (params.onlyAmlUmbral) httpParams = httpParams.set('onlyAmlUmbral', '1');
    if (params.limit != null) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.offset != null) httpParams = httpParams.set('offset', params.offset.toString());

    const url = this.apiBase.buildApiUrl(`${this.API}/list`);
    return this.http.get<ClientesListResponse>(url, { params: httpParams }).pipe(
      // BE devuelve snake_case (id_cliente, nd_cliente, aml_umbral, ...).
      // El mapper crea aliases camelCase para que el componente no se reescriba.
      map(r => mapClientesMesaResponse(r) as ClientesListResponse)
    );
  }

  getExpedientes(idHeaderClient: number): Observable<ExpedientesResponse> {
    const url = this.apiBase.buildApiUrl(`${this.API}/${idHeaderClient}/expedientes`);
    return this.http.get<ExpedientesResponse>(url);
  }
}
