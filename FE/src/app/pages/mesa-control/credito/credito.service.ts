import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ClienteCredito {
  idCliente: number;
  ndCliente: string;
  cliente: string;
  rfc: string;
  razonSocial: string;
  email: string;
  telefono: string;
  telefono2: string;
  relaciones: number;
}

export interface RelacionCredito {
  id: number;
  idCliente: number;
  idAgencyRelacionado: number;
  agencia: string;
  ndCliente: string;
  cliente: string;
  razonSocial: string;
  rfc: string;
  email: string;
  telefono: string;
  telefono2: string;
  fechaRegistro: string;
}

interface CreditoResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CreditoService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/credito`;

  constructor(private http: HttpClient) {}

  listarClientes(idAgency: number, search: string, limit: number, offset: number): Observable<CreditoResponse<{
    clientes: ClienteCredito[];
    total: number;
    limit: number;
    offset: number;
  }>> {
    let params = new HttpParams()
      .set('idAgency', String(idAgency))
      .set('limit', String(limit))
      .set('offset', String(offset));
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<CreditoResponse<{
      clientes: ClienteCredito[];
      total: number;
      limit: number;
      offset: number;
    }>>(`${this.baseUrl}/clientes`, { params });
  }

  listarRelaciones(idAgency: number, idCliente: number): Observable<CreditoResponse<{ relaciones: RelacionCredito[] }>> {
    const params = new HttpParams()
      .set('idAgency', String(idAgency))
      .set('idCliente', String(idCliente));
    return this.http.get<CreditoResponse<{ relaciones: RelacionCredito[] }>>(`${this.baseUrl}/relaciones`, { params });
  }

  crearRelacion(
    idAgency: number,
    idClientePrincipal: number,
    idAgencyRelacionado: number,
    idClienteRelacionado: number
  ): Observable<CreditoResponse<{ id: number }>> {
    return this.http.post<CreditoResponse<{ id: number }>>(`${this.baseUrl}/relaciones`, {
      idAgency,
      idClientePrincipal,
      idAgencyRelacionado,
      idClienteRelacionado
    });
  }

  eliminarRelacion(id: number): Observable<CreditoResponse<null>> {
    return this.http.delete<CreditoResponse<null>>(`${this.baseUrl}/relaciones/${id}`);
  }
}
