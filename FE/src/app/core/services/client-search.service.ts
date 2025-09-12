import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClientSearchResult {
  idCliente: number;
  ndCliente: string;
  cliente: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rfc: string;
  email: string;
  telefono: string;
  telefono2: string;
  razonSocial: string;
  curp: string;
  asesor: string;
  agenciaOrigen: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  idAgency: number;
}

export interface ClientSearchResponse {
  success: boolean;
  message: string;
  data: {
    clientes: ClientSearchResult[];
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClientSearchService {

  constructor(private http: HttpClient) { }

  /**
   * Buscar clientes usando la vista view_client
   * @param idAgency ID de la agencia
   * @param searchTerm Término de búsqueda
   * @param limit Límite de resultados
   * @returns Observable con los resultados
   */
  searchClients(idAgency: number, searchTerm: string, limit: number = 50): Observable<ClientSearchResponse> {
    let params = new HttpParams();
    params = params.set('idAgency', idAgency.toString());
    params = params.set('search', searchTerm);
    params = params.set('limit', limit.toString());

    return this.http.get<ClientSearchResponse>(`${environment.apiBaseUrl}/api/client-search/search`, { params });
  }

  /**
   * Obtener cliente por ID usando la vista
   * @param id ID del cliente
   * @param idAgency ID de la agencia
   * @returns Observable con el cliente
   */
  getClientById(id: number, idAgency: number): Observable<ClientSearchResponse> {
    let params = new HttpParams();
    params = params.set('idAgency', idAgency.toString());
    
    return this.http.get<ClientSearchResponse>(`${environment.apiBaseUrl}/api/client-search/${id}`, { params });
  }

  /**
   * Obtener todos los clientes de una agencia usando la vista
   * @param idAgency ID de la agencia
   * @param limit Límite de resultados
   * @param offset Offset para paginación
   * @returns Observable con los clientes
   */
  getClientsByAgency(idAgency: number, limit: number = 100, offset: number = 0): Observable<ClientSearchResponse> {
    let params = new HttpParams();
    params = params.set('limit', limit.toString());
    params = params.set('offset', offset.toString());

    return this.http.get<ClientSearchResponse>(`${environment.apiBaseUrl}/api/client-search/by-agency/${idAgency}`, { params });
  }

  /**
   * Buscar clientes por número de cliente específico
   * @param idAgency ID de la agencia
   * @param clientNumber Número de cliente
   * @returns Observable con los resultados
   */
  searchByClientNumber(idAgency: number, clientNumber: string): Observable<ClientSearchResponse> {
    return this.searchClients(idAgency, clientNumber, 10);
  }

  /**
   * Buscar clientes por nombre
   * @param idAgency ID de la agencia
   * @param name Nombre del cliente
   * @returns Observable con los resultados
   */
  searchByName(idAgency: number, name: string): Observable<ClientSearchResponse> {
    return this.searchClients(idAgency, name, 50);
  }
}
