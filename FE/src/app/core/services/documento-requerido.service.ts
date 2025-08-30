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
      if (filters.IdProcess) httpParams = httpParams.set('IdProcess', filters.IdProcess);
      if (filters.IdAgency) httpParams = httpParams.set('IdAgency', filters.IdAgency);
      if (filters.IdCostumerType) httpParams = httpParams.set('IdCostumerType', filters.IdCostumerType);
      if (filters.IdOperationType) httpParams = httpParams.set('IdOperationType', filters.IdOperationType);
      if (filters.IdDocumentType) httpParams = httpParams.set('IdDocumentType', filters.IdDocumentType);
      if (filters.Required !== undefined) httpParams = httpParams.set('Required', filters.Required.toString());
      if (filters.Enabled !== undefined) httpParams = httpParams.set('Enabled', filters.Enabled.toString());
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
      IdProcess: idProcess,
      IdAgency: idAgency,
      IdCostumerType: idCostumerType,
      IdOperationType: idOperationType,
      Enabled: true
    };
    
    return this.getDocumentosRequeridos(filters);
  }

  /**
   * Reordenar documentos requeridos
   */
  reorderDocumentosRequeridos(documentos: { Id: string; Orden: number }[]): Observable<DocumentoRequeridoResponse> {
    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/reorder`);
    return this.http.put<DocumentoRequeridoResponse>(url, { documentos });
  }

  /**
   * Duplicar configuración de documentos requeridos
   */
  duplicateConfiguracion(
    sourceConfig: { IdProcess: string; IdAgency: string; IdCostumerType: string; IdOperationType: string },
    targetConfig: { IdProcess: string; IdAgency: string; IdCostumerType: string; IdOperationType: string }
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
      if (filters.IdProcess) httpParams = httpParams.set('IdProcess', filters.IdProcess);
      if (filters.IdAgency) httpParams = httpParams.set('IdAgency', filters.IdAgency);
      if (filters.IdCostumerType) httpParams = httpParams.set('IdCostumerType', filters.IdCostumerType);
      if (filters.IdOperationType) httpParams = httpParams.set('IdOperationType', filters.IdOperationType);
    }

    const url = this.apiBaseService.buildApiUrl(`${this.API_URL}/export`);
    return this.http.get(url, { 
      params: httpParams, 
      responseType: 'blob' 
    });
  }
}
