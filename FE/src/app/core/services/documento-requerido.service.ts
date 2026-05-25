import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  DocumentoRequerido, 
  DocumentoRequeridoResponse, 
  DocumentoRequeridoCreateRequest, 
  DocumentoRequeridoUpdateRequest,
  DocumentoRequeridoFilters,
  DocumentoRequeridoStats
} from '../interfaces/documento-requerido.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentoRequeridoService {
  private readonly API_URL = 'documento-requerido';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  /**
   * Obtener todos los documentos requeridos con filtros y paginación
   */
  getDocumentosRequeridos(filters?: DocumentoRequeridoFilters): Observable<DocumentoRequeridoResponse> {
    let httpParams = new HttpParams();
    
    if (filters) {
      if (filters.id_sale_type) httpParams = httpParams.set('id_sale_type', filters.id_sale_type);
      if (filters.id_agency) httpParams = httpParams.set('id_agency', filters.id_agency);
      if (filters.id_company != null) httpParams = httpParams.set('id_company', String(filters.id_company));
      if (filters.id_customer_type) httpParams = httpParams.set('id_customer_type', filters.id_customer_type);
      if (filters.id_operation_type) httpParams = httpParams.set('id_operation_type', filters.id_operation_type);
      if (filters.id_document_type) httpParams = httpParams.set('id_document_type', filters.id_document_type);
      if (filters.required !== undefined) httpParams = httpParams.set('required', filters.required.toString());
      if (filters.enabled !== undefined) httpParams = httpParams.set('enabled', filters.enabled.toString());
      if (filters.limit) httpParams = httpParams.set('limit', filters.limit.toString());
      if (filters.offset) httpParams = httpParams.set('offset', filters.offset.toString());
      if (filters.sort_by) httpParams = httpParams.set('sort_by', filters.sort_by);
      if (filters.sort_order) httpParams = httpParams.set('sort_order', filters.sort_order);
    }

    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    return this.http.get<DocumentoRequeridoResponse>(url, { params: httpParams });
  }

  /**
   * Obtener un documento requerido por ID
   */
  getDocumentoRequeridoById(id: string): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.get<DocumentoRequeridoResponse>(url);
  }

  /**
   * Crear un nuevo documento requerido
   */
  createDocumentoRequerido(data: DocumentoRequeridoCreateRequest): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(this.API_URL);
    return this.http.post<DocumentoRequeridoResponse>(url, data);
  }

  /**
   * Actualizar un documento requerido existente
   */
  updateDocumentoRequerido(id: string, data: DocumentoRequeridoUpdateRequest): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.put<DocumentoRequeridoResponse>(url, data);
  }

  /**
   * Eliminar un documento requerido
   */
  deleteDocumentoRequerido(id: string): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/${id}`);
    return this.http.delete<DocumentoRequeridoResponse>(url);
  }

  /**
   * Obtener estadísticas de documentos requeridos
   */
  getDocumentosRequeridosStats(): Observable<{ success: boolean; data: DocumentoRequeridoStats }> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/stats`);
    return this.http.get<{ success: boolean; data: DocumentoRequeridoStats }>(url);
  }

  /**
   * Obtener documentos requeridos por configuración específica
   */
  getDocumentosByConfiguracion(
    idProcess: string, 
    idAgency: string, 
    idCostumerType: string, 
    idOperationType: string
  ): Observable<DocumentoRequeridoResponse> {
    const filters: DocumentoRequeridoFilters = {
      id_sale_type: idProcess,
      id_agency: idAgency,
      id_customer_type: idCostumerType,
      id_operation_type: idOperationType,
      enabled: true
    };
    
    return this.getDocumentosRequeridos(filters);
  }

  /**
   * Reordenar documentos requeridos
   */
  reorderDocumentosRequeridos(documentos: { id: string; orden: number }[]): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/reorder`);
    return this.http.put<DocumentoRequeridoResponse>(url, { documentos });
  }

  /**
   * Duplicar configuración de documentos requeridos
   */
  duplicateConfiguracion(
    sourceConfig: { id_sale_type: string; id_agency: string; id_customer_type: string; id_operation_type: string },
    targetConfig: { id_sale_type: string; id_agency: string; id_customer_type: string; id_operation_type: string }
  ): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/duplicate`);
    return this.http.post<DocumentoRequeridoResponse>(url, {
      source: sourceConfig,
      target: targetConfig
    });
  }

  /**
   * Exportar configuración de documentos requeridos
   */
  exportConfiguracion(filters: DocumentoRequeridoFilters): Observable<Blob> {
    let httpParams = new HttpParams();
    
    if (filters) {
      if (filters.id_sale_type) httpParams = httpParams.set('id_sale_type', filters.id_sale_type);
      if (filters.id_agency) httpParams = httpParams.set('id_agency', filters.id_agency);
      if (filters.id_customer_type) httpParams = httpParams.set('id_customer_type', filters.id_customer_type);
      if (filters.id_operation_type) httpParams = httpParams.set('id_operation_type', filters.id_operation_type);
    }

    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/export`);
    return this.http.get(url, { 
      params: httpParams, 
      responseType: 'blob' 
    });
  }
}
