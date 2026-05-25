import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface CompanyClient {
  idAgency: string;
  ndDMS: string;
  bussines_name: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  rfc: string;
  curp: string;
  phone: string;
  mobile_phone: string;
  mail: string;
  client_type?: string;  // 'fisica' | 'moral'
  // Campos adicionales para compatibilidad
  idCliente?: number;
  ndCliente?: string;
  cliente?: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email?: string;
  telefono?: string;
  telefono2?: string;
  razonSocial?: string;
  asesor?: string;
  agenciaOrigen?: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
  isCompanyClient?: boolean;
  companyData?: any;
}

export interface CompanyResponse {
  status: number;
  message: string;
  data: {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: CompanyClient[];
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyClientService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Buscar clientes en el API del Grupo (Company)
   * @param connectionstring ConnectionString de la compañía (agency_connection)
   * @param ndDMS Número de cliente DMS (ej: "10004")
   * @returns Observable con los resultados
   */
  searchClients(connectionstring: string, ndDMS: string): Observable<CompanyResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('nd_cliente', ndDMS);

    return this.http.get<CompanyResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Obtener cliente por ID en el Grupo
   * @param id ID del cliente
   * @param connectionstring ConnectionString de la compañía (agency_connection)
   * @returns Observable con el cliente
   */
  getClientById(id: number, connectionstring: string): Observable<CompanyResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('id', id.toString());

    return this.http.get<CompanyResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Convertir respuesta del Grupo al formato estándar
   * @param companyData Datos del Grupo
   * @returns Cliente en formato estándar
   */
  convertCompanyClient(companyData: any): CompanyClient {
    return {
      idAgency: (companyData.id_agency ?? companyData.idAgency ?? '') as string,
      ndDMS: (companyData.nd_cliente ?? companyData.ndDMS ?? '') as string,
      bussines_name: companyData.bussines_name || '',
      name: companyData.name || '',
      paternal_surname: companyData.paternal_surname || '',
      maternal_surname: companyData.maternal_surname || '',
      rfc: companyData.rfc || '',
      curp: companyData.curp || '',
      phone: companyData.phone || '',
      mobile_phone: companyData.mobile_phone || '',
      mail: companyData.mail || '',
      idCliente: parseInt(companyData.nd_cliente ?? companyData.ndDMS ?? '') || 0,
      ndCliente: companyData.nd_cliente ?? companyData.ndDMS ?? '',
      cliente: `${companyData.name || ''} ${companyData.paternal_surname || ''} ${companyData.maternal_surname || ''}`.trim(),
      nombre: companyData.name || '',
      apellidoPaterno: companyData.paternal_surname || '',
      apellidoMaterno: companyData.maternal_surname || '',
      email: companyData.mail || '',
      telefono: companyData.phone || '',
      telefono2: companyData.mobile_phone || '',
      razonSocial: companyData.bussines_name || '',
      client_type: companyData.client_type || '',
      asesor: '',
      agenciaOrigen: '',
      fechaRegistro: '',
      fechaActualizacion: '',
      isCompanyClient: true,
      companyData: companyData
    };
  }
}
