import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FileExtraordinaryReason {
  Id: number;
  Name: string;
  IdTypeReason: number;
  Enabled: number;
  RegistrationDate: string;
  UpdateDate: string;
  IdLastUserUpdate: number;
}

export interface FileExtraordinaryReasonFilters {
  search?: string;
  id_type_reason?: number;
  sort_by?: string;
  sort_order?: string;
  limit?: number;
  offset?: number;
}

export interface FileExtraordinaryReasonResponse {
  success: boolean;
  message: string;
  data: {
    file_extraordinary_reasons: FileExtraordinaryReason[];
    total: number;
  };
}

export interface FileExtraordinaryReasonStats {
  total_reasons: number;
  type_reason_stats: Array<{
    IdTypeReason: number;
    count: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class FileExtraordinaryReasonService {
  private apiUrl = `${environment.apiBaseUrl}/api/file-extraordinary-reason`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todos los motivos extraordinarios con filtros y paginación
   */
  getFileExtraordinaryReasons(filters: FileExtraordinaryReasonFilters = {}): Observable<FileExtraordinaryReasonResponse> {
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

    return this.http.get<FileExtraordinaryReasonResponse>(this.apiUrl, { params });
  }

  /**
   * Obtener un motivo extraordinario específico por ID
   */
  getFileExtraordinaryReason(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo motivo extraordinario
   */
  createFileExtraordinaryReason(fileExtraordinaryReason: Partial<FileExtraordinaryReason>): Observable<any> {
    console.log('🔍 Datos a enviar al backend:', fileExtraordinaryReason);
    return this.http.post(this.apiUrl, fileExtraordinaryReason);
  }

  /**
   * Actualizar un motivo extraordinario existente
   */
  updateFileExtraordinaryReason(id: number, fileExtraordinaryReason: Partial<FileExtraordinaryReason>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fileExtraordinaryReason);
  }

  /**
   * Eliminar un motivo extraordinario
   */
  deleteFileExtraordinaryReason(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Buscar motivos extraordinarios
   */
  searchFileExtraordinaryReasons(query: string, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  /**
   * Obtener estadísticas de motivos extraordinarios
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  /**
   * Obtener motivos extraordinarios activos
   */
  getActiveFileExtraordinaryReasons(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active`);
  }

  /**
   * Cambiar estado del motivo extraordinario
   */
  toggleStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-status`, {});
  }
}
