import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  DocumentType, 
  DocumentTypeResponse, 
  DocumentTypeCreateRequest, 
  DocumentTypeUpdateRequest,
  DocumentTypeStatsResponse,
  DocumentTypeSearchResponse,
  DocumentTypeActiveResponse
} from '../interfaces/document-type.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {
  private readonly API_URL = 'document-type';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  /**
   * Obtener todos los tipos de documento con filtros y paginación
   */
  getDocumentTypes(params?: {
    page?: number;
    limit?: number | string;
    enabled?: string;
    search?: string;
    sort_by?: string;
    sort_order?: string;
  }): Observable<DocumentTypeResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<DocumentTypeResponse>(this.apiBaseService.buildApiUrl(this.API_URL), { params: httpParams });
  }

  /**
   * Obtener un tipo de documento específico por ID
   */
  getDocumentType(id: string): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  /**
   * Crear un nuevo tipo de documento
   */
  createDocumentType(documentType: DocumentTypeCreateRequest): Observable<any> {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), documentType);
  }

  /**
   * Actualizar un tipo de documento existente
   */
  updateDocumentType(id: string, documentType: DocumentTypeUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, documentType);
  }

  /**
   * Eliminar un tipo de documento
   */
  deleteDocumentType(id: string): Observable<any> {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  /**
   * Cambiar estado (habilitado/deshabilitado) de un tipo de documento
   */
  toggleStatus(id: string): Observable<any> {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }

  /**
   * Obtener solo los tipos de documento activos
   */
  getActiveDocumentTypes(): Observable<DocumentTypeActiveResponse> {
    return this.http.get<DocumentTypeActiveResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/active`);
  }

  /**
   * Buscar tipos de documento por nombre
   */
  searchDocumentTypes(query: string, limit?: string): Observable<DocumentTypeSearchResponse> {
    let params = new HttpParams().set('q', query);
    if (limit) {
      params = params.set('limit', limit);
    }
    
    return this.http.get<DocumentTypeSearchResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search`, { params });
  }

  /**
   * Obtener estadísticas de los tipos de documento
   */
  getStats(): Observable<DocumentTypeStatsResponse> {
    return this.http.get<DocumentTypeStatsResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }

  /**
   * Obtener todos los tipos de documento sin paginación
   */
  getAllDocumentTypes(): Observable<DocumentTypeResponse> {
    return this.getDocumentTypes({ limit: 'all' });
  }

  /**
   * Obtener tipos de documento habilitados
   */
  getEnabledDocumentTypes(): Observable<DocumentTypeResponse> {
    return this.getDocumentTypes({ enabled: '1', limit: 'all' });
  }

  /**
   * Obtener tipos de documento deshabilitados
   */
  getDisabledDocumentTypes(): Observable<DocumentTypeResponse> {
    return this.getDocumentTypes({ enabled: '0', limit: 'all' });
  }

  /**
   * Obtener estados de archivo activos (File_Status)
   */
  getActiveFileStatuses(): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl('file-status/active')}`);
  }

  /**
   * Obtener subestados de archivo activos (File_SubStatus)
   */
  getActiveSubProcesses(): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl('file-sub-status/active')}`);
  }
}
