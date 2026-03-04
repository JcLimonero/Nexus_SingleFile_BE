import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

export interface VanguardiaClient {
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
  isVanguardiaClient?: boolean;
  vanguardiaData?: any;
}

export interface VanguardiaResponse {
  status: number;
  message: string;
  data: {
    total_rows: number;
    per_page: number;
    page: number;
    total_pages: number;
    data: VanguardiaClient[];
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VanguardiaClientService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {}

  /**
   * Buscar clientes en el API de Vanguardia
   * @param connectionstring ConnectionString de la agencia (AgencyConnection)
   * @param ndDMS Número de cliente DMS (ej: "10004")
   * @returns Observable con los resultados
   */
  searchClients(connectionstring: string, ndDMS: string): Observable<VanguardiaResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('nd_cliente', ndDMS);

    return this.http.get<VanguardiaResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Obtener cliente por ID en Vanguardia
   * @param id ID del cliente
   * @param connectionstring ConnectionString de la agencia (AgencyConnection)
   * @returns Observable con el cliente
   */
  getClientById(id: number, connectionstring: string): Observable<VanguardiaResponse> {
    let params = new HttpParams();
    params = params.set('connection_string', connectionstring);
    params = params.set('id', id.toString());

    return this.http.get<VanguardiaResponse>(this.apiConfig.getApiUrl(), { params });
  }

  /**
   * Convertir respuesta de Vanguardia al formato estándar
   * @param vanguardiaData Datos de Vanguardia
   * @returns Cliente en formato estándar
   */
  convertVanguardiaClient(vanguardiaData: any): VanguardiaClient {
    return {
      idAgency: (vanguardiaData.id_agency ?? vanguardiaData.idAgency ?? '') as string,
      ndDMS: (vanguardiaData.nd_cliente ?? vanguardiaData.ndDMS ?? '') as string,
      bussines_name: vanguardiaData.bussines_name || '',
      name: vanguardiaData.name || '',
      paternal_surname: vanguardiaData.paternal_surname || '',
      maternal_surname: vanguardiaData.maternal_surname || '',
      rfc: vanguardiaData.rfc || '',
      curp: vanguardiaData.curp || '',
      phone: vanguardiaData.phone || '',
      mobile_phone: vanguardiaData.mobile_phone || '',
      mail: vanguardiaData.mail || '',
      // Campos adicionales para compatibilidad
      idCliente: parseInt(vanguardiaData.nd_cliente ?? vanguardiaData.ndDMS ?? '') || 0,
      ndCliente: vanguardiaData.nd_cliente ?? vanguardiaData.ndDMS ?? '',
      cliente: `${vanguardiaData.name || ''} ${vanguardiaData.paternal_surname || ''} ${vanguardiaData.maternal_surname || ''}`.trim(),
      nombre: vanguardiaData.name || '',
      apellidoPaterno: vanguardiaData.paternal_surname || '',
      apellidoMaterno: vanguardiaData.maternal_surname || '',
      email: vanguardiaData.mail || '',
      telefono: vanguardiaData.phone || '',
      telefono2: vanguardiaData.mobile_phone || '',
      razonSocial: vanguardiaData.bussines_name || '',
      tipo_cliente: vanguardiaData.tipo_cliente || '',
      asesor: '',
      agenciaOrigen: '',
      fechaRegistro: '',
      fechaActualizacion: '',
      isVanguardiaClient: true,
      vanguardiaData: vanguardiaData
    };
  }
}
