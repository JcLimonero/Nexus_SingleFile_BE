import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileReason {
  Id: number;
  Name: string;
  IdTypeReason: number;
  Enabled: number;
  RegistrationDate: string;
  UpdateDate: string;
  IdLastUserUpdate: number;
}

export interface FileReasonFilters {
  search?: string;
  id_type_reason?: number;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  offset?: number;
}

export interface FileReasonResponse {
  success: boolean;
  message: string;
  data: {
    file_reasons: FileReason[];
    total: number;
    limit: number | string;
    offset: number;
    count: number;
    sort_by: string;
    sort_order: string;
  };
}

export interface FileReasonStats {
  total_reasons: number;
  type_reason_stats: Array<{
    IdTypeReason: number;
    count: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FileReasonService {
  private apiUrl = `${environment.apiBaseUrl}/api/file-reason`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los motivos de rechazo con filtros y paginación
   */
  getFileReasons(filters: FileReasonFilters = {}): Observable<FileReasonResponse> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.id_type_reason !== undefined) {
      params = params.set('id_type_reason', filters.id_type_reason.toString());
    }

    if (filters.sort_by) {
      params = params.set('sort_by', filters.sort_by);
    }

    if (filters.sort_order) {
      params = params.set('sort_order', filters.sort_order);
    }

    if (filters.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    if (filters.offset) {
      params = params.set('offset', filters.offset.toString());
    }

    return this.http.get<FileReasonResponse>(this.apiUrl, { params });
  }

  /**
   * Obtener un motivo de rechazo específico por ID
   */
  getFileReason(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo motivo de rechazo
   */
  createFileReason(fileReason: Partial<FileReason>): Observable<any> {
    return this.http.post(this.apiUrl, fileReason);
  }

  /**
   * Actualizar un motivo de rechazo existente
   */
  updateFileReason(id: number, fileReason: Partial<FileReason>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fileReason);
  }

  /**
   * Eliminar un motivo de rechazo
   */
  deleteFileReason(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar motivos de rechazo
   */
  searchFileReasons(query: string, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  /**
   * Obtener estadísticas de motivos de rechazo
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  /**
   * Obtener motivos activos
   */
  getActiveFileReasons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active`);
  }



  /**
   * Cambiar estado del motivo
   */
  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
