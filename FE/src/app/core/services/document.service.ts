import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Document, 
  DocumentResponse, 
  DocumentCreateRequest, 
  DocumentUpdateRequest,
  DocumentStatsResponse,
  DocumentSearchResponse,
  DocumentByFileResponse,
  DocumentFilters,
  DocumentFileStatusResponse,
  DocumentFileErrorResponse,
  FileStatusResponse,
  FileSubStatusResponse
} from '../interfaces/document.interface';
import { ApiBaseService } from './api-base.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly API_URL = 'document';
  private readonly CATALOG_URL = '';

  constructor(
    private http: HttpClient,
    private apiBaseService: ApiBaseService
  ) { }

  /**
   * Obtener todos los documentos con filtros y paginación
   */
  getDocuments(filters?: DocumentFilters): Observable<DocumentResponse> {
    let httpParams = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<DocumentResponse>(this.apiBaseService.buildApiUrl(this.API_URL), { params: httpParams });
  }

  /**
   * Obtener un documento específico por ID
   */
  getDocument(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  /**
   * Crear un nuevo documento
   */
  createDocument(document: DocumentCreateRequest): Observable<any> {
    return this.http.post(this.apiBaseService.buildApiUrl(this.API_URL), document);
  }

  /**
   * Actualizar un documento existente
   */
  updateDocument(id: number, document: DocumentUpdateRequest): Observable<any> {
    return this.http.put(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`, document);
  }

  /**
   * Eliminar un documento
   */
  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}`);
  }

  /**
   * Cambiar estado (habilitado/deshabilitado) de un documento
   */
  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiBaseService.buildApiUrl(this.API_URL)}/${id}/toggle-status`, {});
  }

  /**
   * Obtener documentos por archivo específico
   */
  getDocumentsByFile(fileId: number): Observable<DocumentByFileResponse> {
    return this.http.get<DocumentByFileResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/by-file/${fileId}`);
  }

  /**
   * Buscar documentos
   */
  searchDocuments(query: string, limit?: number): Observable<DocumentSearchResponse> {
    let params = new HttpParams().set('q', query);
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    
    return this.http.get<DocumentSearchResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/search`, { params });
  }

  /**
   * Obtener estadísticas de los documentos
   */
  getStats(): Observable<DocumentStatsResponse> {
    return this.http.get<DocumentStatsResponse>(`${this.apiBaseService.buildApiUrl(this.API_URL)}/stats`);
  }

  /**
   * Obtener todos los documentos sin paginación
   */
  getAllDocuments(): Observable<DocumentResponse> {
    return this.getDocuments({ limit: 'all' });
  }

  /**
   * Obtener documentos habilitados
   */
  getEnabledDocuments(): Observable<DocumentResponse> {
    return this.getDocuments({ enabled: '1', limit: 'all' });
  }

  /**
   * Obtener documentos deshabilitados
   */
  getDisabledDocuments(): Observable<DocumentResponse> {
    return this.getDocuments({ enabled: '0', limit: 'all' });
  }

  /**
   * Obtener documentos por tipo específico
   */
  getDocumentsByType(documentTypeId: string): Observable<DocumentResponse> {
    return this.getDocuments({ document_type: documentTypeId, limit: 'all' });
  }

  /**
   * Obtener documentos por estado específico
   */
  getDocumentsByStatus(statusId: string): Observable<DocumentResponse> {
    return this.getDocuments({ current_status: statusId, limit: 'all' });
  }

  // Métodos para obtener catálogos relacionados

  /**
   * Obtener estados de archivo de documento
   */
  getDocumentFileStatuses(): Observable<DocumentFileStatusResponse> {
    return this.http.get<DocumentFileStatusResponse>(`${this.apiBaseService.buildApiUrl('document-file-status')}`);
  }

  /**
   * Obtener errores de archivo de documento
   */
  getDocumentFileErrors(): Observable<DocumentFileErrorResponse> {
    return this.http.get<DocumentFileErrorResponse>(`${this.apiBaseService.buildApiUrl('document-file-error')}`);
  }

  /**
   * Obtener estados de archivo
   */
  getFileStatuses(): Observable<FileStatusResponse> {
    return this.http.get<FileStatusResponse>(`${this.apiBaseService.buildApiUrl('file-status')}`);
  }

  /**
   * Obtener sub-estados de archivo
   */
  getFileSubStatuses(): Observable<FileSubStatusResponse> {
    return this.http.get<FileSubStatusResponse>(`${this.apiBaseService.buildApiUrl('file-substatus')}`);
  }

  // Métodos de utilidad

  /**
   * Validar si un documento tiene fecha de expiración vencida
   */
  isDocumentExpired(document: Document): boolean {
    if (!document.ExperationDate) {
      return false;
    }
    
    const expirationDate = new Date(document.ExperationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return expirationDate < today;
  }

  /**
   * Obtener documentos que expiran pronto (próximos 30 días)
   */
  getDocumentsExpiringSoon(days: number = 30): Observable<DocumentResponse> {
    // Este filtro se puede implementar en el backend si es necesario
    // Por ahora retornamos todos los documentos y filtraremos en el frontend
    return this.getEnabledDocuments();
  }

  /**
   * Formatear fecha para mostrar
   */
  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /**
   * Formatear fecha y hora para mostrar
   */
  formatDateTime(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  /**
   * Obtener el color del estado basado en el estado del documento
   */
  getStatusColor(enabled: number): string {
    return enabled === 1 ? 'green' : 'red';
  }

  /**
   * Obtener el texto del estado
   */
  getStatusText(enabled: number): string {
    return enabled === 1 ? 'Activo' : 'Inactivo';
  }
}
