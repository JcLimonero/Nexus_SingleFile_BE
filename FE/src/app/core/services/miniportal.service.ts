import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';
import { camelizeKeys } from '../utils/api-mappers';

export interface ExpedienteMiniportal {
  idFile: number;
  ndPedido: string;
  fechaRegistro: string;
  estatus: string;
  cliente: string;
  agencia: string;
  vin?: string | null;
  modelo?: string | null;
  year?: number | string | null;
  version?: string | null;
}

export interface MiniportalExpedienteResponse {
  success: boolean;
  message?: string;
  data?: {
    expediente: ExpedienteMiniportal;
    avisoAceptado: boolean;
    token: string;
  };
}

export interface MiniportalAcceptResponse {
  success: boolean;
  message?: string;
}

export interface DocumentoMiniportal {
  idDocumentByFile: number;
  idEstatus?: number;
  comentarioRechazo?: string | null;
  proceso: string;
  fase: string;
  documento: string;
  tipoDocumento: string;
  estatus: string;
  fecha: string;
  documentContainer: string;
  DisponibleCliente?: number;
  aprobadoCliente?: number;
  /** 0 = opcional, 1 = obligatorio (default) */
  requerido?: number;
}

export interface MiniportalDocumentsResponse {
  success: boolean;
  message?: string;
  data?: DocumentoMiniportal[];
}

export interface MiniportalDocumentUrlResponse {
  success: boolean;
  message?: string;
  data?: { url: string };
}

@Injectable({
  providedIn: 'root'
})
export class MiniportalService {
  constructor(
    private http: HttpClient,
    private apiBase: ApiBaseService
  ) {}

  getExpediente(token: string): Observable<MiniportalExpedienteResponse> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}`);
    return this.http.get<MiniportalExpedienteResponse>(url).pipe(
      map(r => camelizeKeys(r) as MiniportalExpedienteResponse)
    );
  }

  acceptAviso(token: string, payload: {
    signatureData?: string;
    latitud?: number;
    longitud?: number;
  }): Observable<MiniportalAcceptResponse> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/accept`);
    return this.http.post<MiniportalAcceptResponse>(url, payload);
  }

  logGeolocation(token: string, payload: {
    latitud: number;
    longitud: number;
    accion?: string;
  }): Observable<MiniportalAcceptResponse> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/geolocation`);
    return this.http.post<MiniportalAcceptResponse>(url, payload);
  }

  getDocumentos(token: string): Observable<MiniportalDocumentsResponse> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/documents`);
    return this.http.get<MiniportalDocumentsResponse>(url).pipe(
      map(r => camelizeKeys(r) as MiniportalDocumentsResponse)
    );
  }

  getDocumentUrl(token: string, documentContainer: string): Observable<MiniportalDocumentUrlResponse> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/document-url`);
    return this.http.get<MiniportalDocumentUrlResponse>(url, {
      params: { file: documentContainer, duration: '3600' }
    }).pipe(
      map(r => camelizeKeys(r) as MiniportalDocumentUrlResponse)
    );
  }

  uploadDocument(token: string, idDocumentByFile: number, file: File): Observable<{ success: boolean; message?: string }> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/upload`);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idDocumentByFile', idDocumentByFile.toString());
    return this.http.post<{ success: boolean; message?: string }>(url, formData);
  }

  approveDocument(token: string, idDocumentByFile: number): Observable<{ success: boolean; message?: string }> {
    const url = this.apiBase.buildApiUrl(`miniportal/${token}/approve-document`);
    return this.http.post<{ success: boolean; message?: string }>(url, { idDocumentByFile });
  }
}
