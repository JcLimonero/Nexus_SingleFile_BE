import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyClientImportRequest {
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

export interface CompanyClientImportResponse {
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
    idAgency?: number | string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompanyClientImportService {

  constructor(private http: HttpClient) { }

  /**
   * Importar cliente del Grupo al sistema local
   * @param clientData Datos del cliente del Grupo
   * @returns Observable con el resultado de la importación
   */
  importClient(clientData: CompanyClientImportRequest): Observable<CompanyClientImportResponse> {
    return this.http.post<CompanyClientImportResponse>(
      `${environment.apiBaseUrl}/api/company-client-import/import`,
      clientData
    );
  }

  /**
   * Convertir datos del Grupo al formato requerido para importación
   * @param companyClient Datos del cliente del Grupo
   * @returns Datos en formato de importación
   */
  convertCompanyDataForImport(companyClient: any): CompanyClientImportRequest {
    const ndDMS = companyClient.ndDMS ?? companyClient.nd_cliente ?? '';
    const idAgency = companyClient.idAgency ?? companyClient.id_agency ?? '';
    return {
      idAgency: String(idAgency),
      ndDMS: String(ndDMS),
      bussines_name: companyClient.bussines_name || '',
      name: companyClient.name || '',
      paternal_surname: companyClient.paternal_surname || '',
      maternal_surname: companyClient.maternal_surname || '',
      rfc: companyClient.rfc || '',
      curp: companyClient.curp || '',
      phone: companyClient.phone || '',
      mobile_phone: companyClient.mobile_phone || '',
      mail: companyClient.mail || '',
      tipo_cliente: companyClient.tipo_cliente || ''
    };
  }
}
