import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VanguardiaClientImportRequest {
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
}

export interface VanguardiaClientImportResponse {
  success: boolean;
  message: string;
  data: {
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
    headerClientId: number;
    relationId: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VanguardiaClientImportService {

  constructor(private http: HttpClient) { }

  /**
   * Importar cliente de Vanguardia al sistema local
   * @param clientData Datos del cliente de Vanguardia
   * @returns Observable con el resultado de la importación
   */
  importClient(clientData: VanguardiaClientImportRequest): Observable<VanguardiaClientImportResponse> {
    return this.http.post<VanguardiaClientImportResponse>(
      `${environment.apiBaseUrl}/api/vanguardia-client-import/import`,
      clientData
    );
  }

  /**
   * Convertir datos de Vanguardia al formato requerido para importación
   * @param vanguardiaClient Datos del cliente de Vanguardia
   * @returns Datos en formato de importación
   */
  convertVanguardiaDataForImport(vanguardiaClient: any): VanguardiaClientImportRequest {
    return {
      idAgency: vanguardiaClient.idAgency || '',
      ndDMS: vanguardiaClient.ndDMS || '',
      bussines_name: vanguardiaClient.bussines_name || '',
      name: vanguardiaClient.name || '',
      paternal_surname: vanguardiaClient.paternal_surname || '',
      maternal_surname: vanguardiaClient.maternal_surname || '',
      rfc: vanguardiaClient.rfc || '',
      curp: vanguardiaClient.curp || '',
      phone: vanguardiaClient.phone || '',
      mobile_phone: vanguardiaClient.mobile_phone || '',
      mail: vanguardiaClient.mail || ''
    };
  }
}
