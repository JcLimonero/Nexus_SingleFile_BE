import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { camelizeKeys } from '../utils/api-mappers';

export interface NexFileClientImportRequest {
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
}

export interface NexFileClientImportResponse {
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
    tipoCliente?: string;
    tipo_cliente?: string;
    asesor: string;
    agenciaOrigen: string;
    fechaRegistro: string;
    fechaActualizacion: string;
    headerClientId: number;
    relationId: number;
    idAgency?: number | string; // Opcional: puede venir como número o string
  };
}

@Injectable({
  providedIn: 'root'
})
export class NexFileClientImportService {

  constructor(private http: HttpClient) { }

  /**
   * Importar cliente de NexFile al sistema local
   * @param clientData Datos del cliente de NexFile
   * @returns Observable con el resultado de la importación
   */
  importClient(clientData: NexFileClientImportRequest): Observable<NexFileClientImportResponse> {
    return this.http.post<NexFileClientImportResponse>(
      `${environment.apiBaseUrl}/api/NexFile-client-import/import`,
      clientData
    ).pipe(
      map(r => camelizeKeys(r) as NexFileClientImportResponse)
    );
  }

  /**
   * Convertir datos de NexFile al formato requerido para importación
   * @param NexFileClient Datos del cliente de NexFile
   * @returns Datos en formato de importación
   */
  convertNexFileDataForImport(NexFileClient: any): NexFileClientImportRequest {
    const ndDMS = NexFileClient.ndDMS ?? NexFileClient.nd_cliente ?? '';
    const idAgency = NexFileClient.idAgency ?? NexFileClient.id_agency ?? '';
    return {
      idAgency: String(idAgency),
      ndDMS: String(ndDMS),
      bussines_name: NexFileClient.bussines_name || '',
      name: NexFileClient.name || '',
      paternal_surname: NexFileClient.paternal_surname || '',
      maternal_surname: NexFileClient.maternal_surname || '',
      rfc: NexFileClient.rfc || '',
      curp: NexFileClient.curp || '',
      phone: NexFileClient.phone || '',
      mobile_phone: NexFileClient.mobile_phone || '',
      mail: NexFileClient.mail || '',
      tipo_cliente: NexFileClient.tipo_cliente || ''
    };
  }
}
