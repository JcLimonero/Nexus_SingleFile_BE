import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface NexFileClient {
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
  tipo_cliente?: string;  // 'fisica' | 'moral'
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
  isNexFileClient?: boolean;
  NexFileData?: any;
}

export interface NexFileResponse {
  status: number;
  message: string;
  data: {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: NexFileClient[];
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NexFileClientService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Buscar clientes en el API de NexFile
   * @param connectionstring ConnectionString de la agencia (AgencyConnection)
   * @param ndDMS Número de cliente DMS (ej: "10004")
   * @returns Observable con los resultados
   */
  searchClients(connectionstring: string, ndDMS: string): Observable<NexFileResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('nd_cliente', ndDMS);

    return this.http.get<NexFileResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Obtener cliente por ID en NexFile
   * @param id ID del cliente
   * @param connectionstring ConnectionString de la agencia (AgencyConnection)
   * @returns Observable con el cliente
   */
  getClientById(id: number, connectionstring: string): Observable<NexFileResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('id', id.toString());

    return this.http.get<NexFileResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Convertir respuesta de NexFile al formato estándar
   * @param NexFileData Datos de NexFile
   * @returns Cliente en formato estándar
   */
  convertNexFileClient(NexFileData: any): NexFileClient {
    return {
      idAgency: (NexFileData.id_agency ?? NexFileData.idAgency ?? '') as string,
      ndDMS: (NexFileData.nd_cliente ?? NexFileData.ndDMS ?? '') as string,
      bussines_name: NexFileData.bussines_name || '',
      name: NexFileData.name || '',
      paternal_surname: NexFileData.paternal_surname || '',
      maternal_surname: NexFileData.maternal_surname || '',
      rfc: NexFileData.rfc || '',
      curp: NexFileData.curp || '',
      phone: NexFileData.phone || '',
      mobile_phone: NexFileData.mobile_phone || '',
      mail: NexFileData.mail || '',
      // Campos adicionales para compatibilidad
      idCliente: parseInt(NexFileData.nd_cliente ?? NexFileData.ndDMS ?? '') || 0,
      ndCliente: NexFileData.nd_cliente ?? NexFileData.ndDMS ?? '',
      cliente: `${NexFileData.name || ''} ${NexFileData.paternal_surname || ''} ${NexFileData.maternal_surname || ''}`.trim(),
      nombre: NexFileData.name || '',
      apellidoPaterno: NexFileData.paternal_surname || '',
      apellidoMaterno: NexFileData.maternal_surname || '',
      email: NexFileData.mail || '',
      telefono: NexFileData.phone || '',
      telefono2: NexFileData.mobile_phone || '',
      razonSocial: NexFileData.bussines_name || '',
      tipo_cliente: NexFileData.tipo_cliente || '',
      asesor: '',
      agenciaOrigen: '',
      fechaRegistro: '',
      fechaActualizacion: '',
      isNexFileClient: true,
      NexFileData: NexFileData
    };
  }
}
