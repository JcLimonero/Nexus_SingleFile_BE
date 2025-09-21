import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) { }

  /**
   * Buscar clientes en el API de Vanguardia
   * @param idAgency IdAgency de la agencia (ej: "10017")
   * @param ndDMS Número de cliente DMS (ej: "10004")
   * @returns Observable con los resultados
   */
  searchClients(idAgency: string, ndDMS: string): Observable<VanguardiaResponse> {
    let params = new HttpParams();
    params = params.set('idAgency', idAgency);
    params = params.set('ndDMS', ndDMS);

    const headers = {
      'Content-Type': 'application/json'
    };

    return this.http.get<VanguardiaResponse>(environment.vanguardia.apiUrl, { 
      params,
      headers 
    });
  }

  /**
   * Obtener cliente por ID en Vanguardia
   * @param id ID del cliente
   * @param idAgency IdAgency de la agencia
   * @returns Observable con el cliente
   */
  getClientById(id: number, idAgency: string): Observable<VanguardiaResponse> {
    let params = new HttpParams();
    params = params.set('idAgency', idAgency);
    params = params.set('id', id.toString());

    const headers = {
      'Content-Type': 'application/json'
    };

    return this.http.get<VanguardiaResponse>(environment.vanguardia.apiUrl, { 
      params,
      headers 
    });
  }

  /**
   * Convertir respuesta de Vanguardia al formato estándar
   * @param vanguardiaData Datos de Vanguardia
   * @returns Cliente en formato estándar
   */
  convertVanguardiaClient(vanguardiaData: any): VanguardiaClient {
    return {
      // Campos originales de Vanguardia
      idAgency: vanguardiaData.idAgency || '',
      ndDMS: vanguardiaData.ndDMS || '',
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
      idCliente: parseInt(vanguardiaData.ndDMS) || 0,
      ndCliente: vanguardiaData.ndDMS || '',
      cliente: `${vanguardiaData.name || ''} ${vanguardiaData.paternal_surname || ''} ${vanguardiaData.maternal_surname || ''}`.trim(),
      nombre: vanguardiaData.name || '',
      apellidoPaterno: vanguardiaData.paternal_surname || '',
      apellidoMaterno: vanguardiaData.maternal_surname || '',
      email: vanguardiaData.mail || '',
      telefono: vanguardiaData.phone || '',
      telefono2: vanguardiaData.mobile_phone || '',
      razonSocial: vanguardiaData.bussines_name || '',
      asesor: '',
      agenciaOrigen: '',
      fechaRegistro: '',
      fechaActualizacion: '',
      isVanguardiaClient: true,
      vanguardiaData: vanguardiaData
    };
  }
}
