import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Cliente {
  ndCliente: number;
  ndPedido: number;
  cliente: string;
  proceso: string;
  operacion: string;
  integracion: boolean;
  liquidacion: boolean;
  liberacion: boolean;
  excepcion: boolean;
  liberado: boolean;
  registro: string;
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
}

export interface FiltrosValidacion {
  agencia?: string;
  proceso?: string;
  fase?: string;
  estado?: string;
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
    console.log('🔄 ValidacionService - Iniciando carga de agencias...');
    const url = `${this.apiUrl}/api/agency`;
    console.log('🔄 ValidacionService - URL:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('🔄 ValidacionService - Respuesta completa recibida:', response);
        
        // Verificar si la respuesta tiene la estructura esperada
        if (response && response.success && response.data && response.data.agencies) {
          console.log('✅ ValidacionService - Estructura correcta encontrada, agencias:', response.data.agencies);
          return response.data.agencies;
        }
        
        // Si no tiene la estructura esperada, devolver la respuesta tal como viene
        if (Array.isArray(response)) {
          console.log('✅ ValidacionService - Respuesta es array directo:', response);
          return response;
        }
        
        // Si es un objeto simple, intentar extraer las agencias
        if (response && response.agencies && Array.isArray(response.agencies)) {
          console.log('✅ ValidacionService - Agencias extraídas del objeto:', response.agencies);
          return response.agencies;
        }
        
        // Si nada funciona, devolver array vacío
        console.warn('⚠️ ValidacionService - Respuesta de API inesperada:', response);
        return [];
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
    params = params.set('page', '1');
    params = params.set('limit', '50');

    return this.http.get<any>(`${this.apiUrl}/api/clients-validation/clientes`, { params }).pipe(
      map(response => {
        if (response && response.success && response.data && response.data.clientes) {
          return response.data.clientes;
        }
        return [];
      })
    );
  }

  /**
   * Cargar documentos de un cliente específico
   */
  cargarDocumentos(clienteId: number): Observable<Documento[]> {
    this.loadingSubject.next(true);
    
    return this.http.get<any>(`${this.apiUrl}/api/clients-validation/documentos/${clienteId}`).pipe(
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
    console.log('🔄 ValidacionService - Iniciando carga de procesos...');
    const url = `${this.apiUrl}/api/process`;
    console.log('🔄 ValidacionService - URL procesos:', url);
    
    return this.http.get<any>(url).pipe(
      map(response => {
        console.log('🔄 ValidacionService - Respuesta procesos recibida:', response);
        
        // Verificar si la respuesta tiene la estructura esperada
        if (response && response.success && response.data && response.data.processes) {
          console.log('✅ ValidacionService - Estructura correcta encontrada, procesos:', response.data.processes);
          return response.data.processes;
        }
        
        // Si no tiene la estructura esperada, devolver la respuesta tal como viene
        if (Array.isArray(response)) {
          console.log('✅ ValidacionService - Respuesta es array directo:', response);
          return response;
        }
        
        // Si es un objeto simple, intentar extraer los procesos
        if (response && response.processes && Array.isArray(response.processes)) {
          console.log('✅ ValidacionService - Procesos extraídos del objeto:', response.processes);
          return response.processes;
        }
        
        // Si nada funciona, devolver array vacío
        console.warn('⚠️ ValidacionService - Respuesta de API inesperada para procesos:', response);
        return [];
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
   * Validar un documento
   */
  validarDocumento(documentoId: string, comentario?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/validacion/validar`, {
      documentoId,
      comentario
    });
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
   * Crear excepción
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
