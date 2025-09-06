import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Cliente {
  idFile: number;
  ndCliente: number;
  ndPedido: number;
  cliente: string;
  proceso: string;
  operacion: string;
  fase: string;
  registro: string;
  IdCurrentState: number;
  tieneDocumentosPendientes: number;
}

export interface Documento {
  proceso: string;
  fase: string;
  documento: string;
  estatus: string;
  ver: boolean;
  validado: boolean;
  eliminar: boolean;
  requerido: boolean;
  fecha: string;
  comentario: string;
  asignado: string;
  idEstatus: number;
}

export interface FiltrosValidacion {
  agencia?: number | null;
  proceso?: number | null;
  fase?: string;
  estado?: string;
  showCancelled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ValidacionService {
  private apiUrl = environment.apiBaseUrl;
  
  // BehaviorSubjects para mantener el estado de los datos
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private documentosSubject = new BehaviorSubject<Documento[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public clientes$ = this.clientesSubject.asObservable();
  public documentos$ = this.documentosSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Cargar agencias disponibles (solo activas y con permisos del usuario)
   */
  cargarAgencias(): Observable<any[]> {
    const url = `${this.apiUrl}/api/agency`;
    
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response && response.success && response.data && response.data.agencies) {
          return response.data.agencies;
        } else if (response && Array.isArray(response)) {
          return response;
        } else if (response && response.agencies) {
          return response.agencies;
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Obtener agencia predeterminada del usuario
   */
  obtenerAgenciaUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user/profile`).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data.DefaultAgency;
        }
        return null;
      })
    );
  }

  /**
   * Cargar clientes/procesos con filtros
   */
  cargarClientes(filtros: FiltrosValidacion = {}): Observable<Cliente[]> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    if (filtros.agencia) params = params.set('id', filtros.agencia);
    if (filtros.proceso) params = params.set('idProcess', filtros.proceso);
    if (filtros.showCancelled !== undefined) params = params.set('showCancelled', filtros.showCancelled.toString());
    params = params.set('page', '1');
    params = params.set('limit', '10000'); // Obtener más registros para paginación local

    return this.http.get<any>(`${this.apiUrl}/api/clients-validation/clientes`, { params }).pipe(
      map(response => {
        console.log('🔍 ValidacionService - Respuesta completa del API:', response);
        console.log('🔍 ValidacionService - URL llamada:', `${this.apiUrl}/api/clients-validation/clientes`);
        console.log('🔍 ValidacionService - Parámetros:', params.toString());
        
        if (response && response.success && response.data && response.data.clientes) {
          console.log('✅ ValidacionService - Clientes extraídos:', response.data.clientes);
          console.log('🔍 ValidacionService - Primer cliente:', response.data.clientes.length > 0 ? response.data.clientes[0] : 'No hay clientes');
          return response.data.clientes;
        }
        console.log('⚠️ ValidacionService - No se encontraron clientes en la respuesta');
        return [];
      })
    );
  }

  /**
   * Cargar documentos de un archivo específico
   */
  cargarDocumentos(idFile: number): Observable<Documento[]> {
    this.loadingSubject.next(true);
    
    let params = new HttpParams();
    params = params.set('idFile', idFile.toString());
    
    return this.http.get<any>(`${this.apiUrl}/api/clients-validation/documentos`, { params }).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }


  /**
   * Cargar procesos disponibles
   */
  cargarProcesos(): Observable<any[]> {
    const url = `${this.apiUrl}/api/process`;
    
    return this.http.get<any>(url).pipe(
      map((response: any) => {
        if (response && response.success && response.data && response.data.processes) {
          return response.data.processes;
        } else if (response && Array.isArray(response)) {
          return response;
        } else if (response && response.processes) {
          return response.processes;
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Cargar fases disponibles
   */
  cargarFases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/validacion/fases`);
  }

  /**
   * Validar un documento - cambiar estatus de "2" a "3"
   */
  validarDocumento(idDocumentByFile: number): Observable<any> {
    const data = {
      idDocumentByFile: idDocumentByFile
    };
    
    return this.http.post<any>(`${this.apiUrl}/api/clients-validation/validar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al validar el documento');
      }),
      catchError(error => {
        console.error('Error en validarDocumento:', error);
        throw error;
      })
    );
  }

  /**
   * Preparar documento para validación - cambiar estatus de "2" a "3"
   */
  prepararDocumento(idDocumentByFile: number): Observable<any> {
    const data = {
      idDocumentByFile: idDocumentByFile
    };
    
    return this.http.post<any>(`${this.apiUrl}/api/clients-validation/preparar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al preparar el documento');
      }),
      catchError(error => {
        console.error('Error en prepararDocumento:', error);
        throw error;
      })
    );
  }

  /**
   * Aprobar/Rechazar documento - cambiar estatus a "4" (aprobado) o "5" (rechazado)
   */
  aprobarDocumento(idDocumentByFile: number, nuevoEstatus: number, comentario?: string, fechaExpiracion?: Date): Observable<any> {
    const data: any = {
      idDocumentByFile: idDocumentByFile,
      nuevoEstatus: nuevoEstatus,
      comentario: comentario
    };

    // Si hay fecha de expiración, agregarla al payload
    if (fechaExpiracion) {
      data.fechaExpiracion = fechaExpiracion.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    }
    
    return this.http.post<any>(`${this.apiUrl}/api/clients-validation/aprobar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al procesar el documento');
      }),
      catchError(error => {
        console.error('Error en aprobarDocumento:', error);
        throw error;
      })
    );
  }

  /**
   * Rechazar un documento
   */
  rechazarDocumento(documentoId: string, motivo: string, comentario?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/validacion/rechazar`, {
      documentoId,
      motivo,
      comentario
    });
  }

  /**
   * Descargar archivo
   */
  descargarArchivo(documentoId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/validacion/descargar/${documentoId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Cancelar proceso
   */
  cancelarProceso(clienteId: string, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/validacion/cancelar`, {
      clienteId,
      motivo
    });
  }

  /**
   * Cancelar pedido
   */
  cancelarPedido(clienteId: number, motivoId: number, comentario: string): Observable<any> {
    const data = {
      clienteId: clienteId,
      motivoId: motivoId,
      comentario: comentario
    };

    return this.http.post<any>(`${this.apiUrl}/api/clients-validation/cancelar-pedido`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al cancelar el pedido');
        }
      }),
      catchError(error => {
        console.error('Error cancelando pedido:', error);
        throw error;
      })
    );
  }

  /**
   * Crear excepción en pedido
   */
  excepcionPedido(clienteId: number, motivoId: number, comentario: string): Observable<any> {
    const data = {
      clienteId: clienteId,
      motivoId: motivoId,
      comentario: comentario
    };

    return this.http.post<any>(`${this.apiUrl}/api/clients-validation/excepcion-pedido`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear la excepción');
        }
      }),
      catchError(error => {
        console.error('Error creando excepción:', error);
        throw error;
      })
    );
  }

  /**
   * Eliminar pedido y sus relaciones
   */
  eliminarPedido(clienteId: number): Observable<any> {
    const data = {
      clienteId: clienteId
    };

    return this.http.delete<any>(`${this.apiUrl}/api/clients-validation/eliminar-pedido`, { body: data }).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al eliminar el pedido');
        }
      }),
      catchError(error => {
        console.error('Error eliminando pedido:', error);
        throw error;
      })
    );
  }

  /**
   * Cambiar estatus del pedido
   */
  cambiarEstatus(clienteId: number, nuevoIdCurrentState: number): Observable<any> {
    const data = {
      clienteId: clienteId,
      nuevoIdCurrentState: nuevoIdCurrentState
    };

    return this.http.put<any>(`${this.apiUrl}/api/clients-validation/cambiar-estatus`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al cambiar el estatus');
        }
      }),
      catchError(error => {
        console.error('Error cambiando estatus:', error);
        throw error;
      })
    );
  }

  /**
   * Crear excepción (método legacy)
   */
  crearExcepcion(clienteId: string, datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/validacion/excepcion`, {
      clienteId,
      ...datos
    });
  }

  /**
   * Actualizar datos locales
   */
  actualizarClientes(clientes: Cliente[]): void {
    this.clientesSubject.next(clientes);
  }

  actualizarDocumentos(documentos: Documento[]): void {
    this.documentosSubject.next(documentos);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Obtener estadísticas
   */
  obtenerEstadisticas(filtros: FiltrosValidacion = {}): Observable<any> {
    let params = new HttpParams();
    if (filtros.agencia) params = params.set('id', filtros.agencia);
    if (filtros.proceso) params = params.set('idProcess', filtros.proceso);

    return this.http.get<any>(`${this.apiUrl}/api/clients-validation/estadisticas`, { params }).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }
}
