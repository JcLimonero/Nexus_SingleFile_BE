import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { snakeClienteToCliente, snakeDocumentoToDocumento } from '../../../core/utils/api-mappers';

export interface Cliente {
  idFile: number;
  ndCliente: number;
  ndPedido: number;
  /** ID de la agencia del expediente (para validar que el cliente pertenece a la agencia seleccionada) */
  idAgency?: number;
  id_agency?: number;
  tipoCliente?: string | null;
  /** id_customer_type: 2 = Persona Moral (requiere beneficiarios), 1 = Persona Física */
  idCostumerType?: number | null;
  cliente: string;
  proceso: string;
  operacion: string;
  fase: string;
  registro: string;
  IdCurrentState?: number;
  /** id_current_state (snake_case) - valor devuelto por el backend */
  id_current_state?: number;
  tieneDocumentosPendientes: number;
  documentosNoAprobados?: number;
  fechaLiberacion?: string;
  /** VIN de la unidad (OrderByCar) */
  vin?: string | null;
  /** Modelo de la unidad (OrderByCar) */
  modelo?: string | null;
  /** Año de la unidad (OrderByCar.Year) */
  year?: number | string | null;
  /** Versión de la unidad (OrderByCar.CarType) */
  version?: string | null;
  /** Monto de la unidad (Order.amount) */
  montoUnidad?: number | null;
  /** 1 si aviso de confidencialidad aprobado, 0 si no */
  avisoConfidencialidadAceptado?: number | null;
  /** Porcentaje total de beneficiarios (0-100) */
  porcentajeBeneficiarios?: number | null;
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
  idDocumentType?: number; // ID del tipo de documento (para excluir liquidación)
  documentContainer?: string; // ID del archivo en Backblaze
  idDocumentByFile?: number;
  ReqExpiration?: number;
  fechaExpiracion?: string;
  DisponibleCliente?: number;
}

export interface FiltrosValidacion {
  agencia?: number | string | null;
  proceso?: number | string | null;
  fase?: string;
  estado?: string;
  showCancelled?: boolean;
}

export interface DatosIdentificacion {
  idClient?: number;
  idCustomerType?: number;
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  razon_social?: string;
  rfc?: string;
  curp?: string;
  email?: string;
  telefono?: string;
  telefono2?: string;
  calle?: string;
  numero_exterior?: string;
  numero_interior?: string;
  colonia?: string;
  codigo_postal?: string;
  ciudad?: string;
  municipio?: string;
  pais?: string;
  fecha_nacimiento?: string;
  pais_nacimiento?: string;
  pais_nacionalidad?: string;
  autoridad_emite?: string;
  fecha_constituccion?: string;
  actividad_giro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidacionService {
  // BehaviorSubjects para mantener el estado de los datos
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  private documentosSubject = new BehaviorSubject<Documento[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  public clientes$ = this.clientesSubject.asObservable();
  public documentos$ = this.documentosSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private defaultAgencyService: DefaultAgencyService
  ) {}

  /**
   * Cargar agencias disponibles usando el servicio con caché
   * Usa DefaultAgencyService que maneja caché en localStorage
   */
  cargarAgencias(): Observable<any[]> {
    return this.defaultAgencyService.obtenerAgencias().pipe(
      map((agencias: any[]) => {
        // Filtrar solo agencias habilitadas si es necesario
        return agencias.filter(ag => this.defaultAgencyService.esAgenciaHabilitada(ag));
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  /**
   * Obtener agencia predeterminada del usuario usando el servicio con caché
   * Usa DefaultAgencyService que maneja caché en cookies
   */
  obtenerAgenciaUsuario(): Observable<number | null> {
    return this.defaultAgencyService.obtenerAgenciaUsuario();
  }

  /**
   * Cargar clientes/procesos con filtros
   */
  cargarClientes(filtros: FiltrosValidacion = {}): Observable<Cliente[]> {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    // Solo enviar id cuando hay agencia concreta; "Todas las agencias" no envía id
    if (filtros.agencia != null && filtros.agencia !== undefined && filtros.agencia !== '') {
      params = params.set('id', String(filtros.agencia));
    }
    // Solo enviar idProcess cuando hay proceso concreto; "Todos los procesos" no envía idProcess
    if (filtros.proceso != null && filtros.proceso !== undefined && filtros.proceso !== '') {
      params = params.set('idProcess', filtros.proceso.toString());
    }
    if (filtros.showCancelled !== undefined) params = params.set('showCancelled', filtros.showCancelled.toString());
    params = params.set('page', '1');
    params = params.set('limit', '10000'); // Obtener más registros para paginación local

    const url = `${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/clientes`;
    return this.http.get<any>(url, { params }).pipe(
      map(response => {

        

        if (response && response.success && response.data && response.data.clientes) {
          // BE devuelve snake_case desde la migración. Mapper agrega aliases
          // camelCase para no reescribir todo el componente.
          return (response.data.clientes as any[]).map(snakeClienteToCliente);
        }

        return [];
      })
    );
  }

  /**
   * Cargar documentos de un archivo específico.
   * Retorna documentos, idDocumentTypeLiquidacion, expedientAmount y totalReceiptAmount (para validación de avance a liberación).
   */
  cargarDocumentos(idFile: number): Observable<{
    documentos: Documento[];
    idDocumentTypeLiquidacion: number | null;
    expedientAmount?: number;
    totalReceiptAmount?: number;
  }> {
    this.loadingSubject.next(true);

    let params = new HttpParams();
    params = params.set('idFile', idFile.toString());

    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/documentos`, { params }).pipe(
      map(response => {
        if (response && response.success && response.data) {
          // BE serializa el top-level como snake (id_document_type_liquidacion,
          // expedient_amount, total_receipt_amount); acepto ambos por seguridad.
          const idLiq = (response.id_document_type_liquidacion ?? response.idDocumentTypeLiquidacion) != null
            ? Number(response.id_document_type_liquidacion ?? response.idDocumentTypeLiquidacion)
            : null;
          const expedientAmount = Number(response.expedient_amount ?? response.expedientAmount ?? 0);
          const totalReceiptAmount = Number(response.total_receipt_amount ?? response.totalReceiptAmount ?? 0);
          return {
            documentos: (response.data as any[]).map(snakeDocumentoToDocumento),
            idDocumentTypeLiquidacion: idLiq,
            expedientAmount,
            totalReceiptAmount
          };
        }
        return { documentos: [], idDocumentTypeLiquidacion: null, expedientAmount: 0, totalReceiptAmount: 0 };
      })
    );
  }

  /**
   * Cargar procesos disponibles
   */
  cargarProcesos(): Observable<any[]> {
    const url = `${environment.apiBaseUrl.replace(/\/$/, '')}/api/process`;

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
    return this.http.get<any[]>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/validacion/fases`);
  }

  /**
   * Diagnosticar por qué un pedido no aparece en validación
   */
  diagnosticarPedido(idFile: number, idAgency?: number, idProcess?: number): Observable<any> {
    let params = new HttpParams();
    params = params.set('idFile', idFile.toString());
    if (idAgency) {
      params = params.set('idAgency', idAgency.toString());
    }
    if (idProcess) {
      params = params.set('idProcess', idProcess.toString());
    }

    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/diagnostico`, { params });
  }

  /**
   * Obtener expedientes que requieren corrección (sin Client_Total_Relation), agrupados por agencia.
   * Solo administrador.
   */
  getExpedientesCorregir(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/expedientes-corregir`);
  }

  /**
   * Reparar los siguientes 10 expedientes pendientes.
   * Solo administrador.
   */
  autoRepararSiguientes10(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/expedientes-corregir/auto-reparar`);
  }

  /**
   * Reparar todos los expedientes pendientes.
   * Solo administrador.
   */
  autoRepararTodos(): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/expedientes-corregir/auto-reparar`, {
      params: { todos: 1 }
    });
  }

  /**
   * Reparar relación Client_Total_Relation faltante para un File
   */
  repararRelacion(idFile: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/reparar-relacion`, {
      idFile: idFile
    });
  }

  /**
   * Reparar File.IdClient incorrecto (usa view_client_relations).
   * Para expedientes con tipoReparacion = 'repairClientRelation'
   */
  repairClientRelation(ndDMS: string, idAgency: number, idExpediente: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/files/repair-client-relation`, {
      ndDMS,
      idAgency,
      idExpediente
    });
  }

  /**
   * Validar un documento - cambiar estatus de "2" a "3"
   */
  validarDocumento(idDocumentByFile: number): Observable<any> {
    const data = {
      idDocumentByFile: idDocumentByFile
    };

    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/validar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al validar el documento');
      }),
      catchError(error => {

        throw error;
      })
    );
  }

  /**
   * Obtener datos del cliente del expediente (para copiar como beneficiario)
   */
  getClienteDetalle(idFile: number): Observable<{ cliente: string; rfc: string | null; curp: string | null }> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/cliente-detalle`, {
      params: { idFile }
    }).pipe(
      map(response => {
        if (response?.success && response?.data) return response.data;
        throw new Error(response?.message || 'Error al obtener datos del cliente');
      })
    );
  }

  /**
   * Obtener beneficiarios finales de un expediente
   */
  getBeneficiarios(idFile: number): Observable<any[]> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/beneficiarios`, {
      params: { idFile }
    }).pipe(
      map(response => response?.success && response?.data ? response.data : []),
      catchError(() => of([]))
    );
  }

  /**
   * Agregar beneficiario final
   */
  addBeneficiario(idFile: number, data: { nombre: string; rfc?: string; curp?: string; porcentajeParticipacion?: number }): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/beneficiarios`, {
      idFile,
      nombre: data.nombre,
      rfc: data.rfc || null,
      curp: data.curp || null,
      porcentajeParticipacion: data.porcentajeParticipacion ?? null
    }).pipe(
      map(response => {
        if (response?.success) return response.data;
        throw new Error(response?.message || 'Error al agregar beneficiario');
      })
    );
  }

  /**
   * Eliminar beneficiario final
   */
  deleteBeneficiario(id: number): Observable<void> {
    return this.http.delete<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/beneficiarios/${id}`).pipe(
      map(response => {
        if (!response?.success) throw new Error(response?.message || 'Error al eliminar');
      })
    );
  }

  /**
   * Generar token y URL para Miniportal (compartir por WhatsApp)
   */
  generarTokenMiniportal(idFile: number): Observable<{ token: string; url: string; idFile: number }> {
    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/generar-token-miniportal`, { idFile }).pipe(
      map(response => {
        if (response?.success && response?.data) {
          return response.data;
        }
        throw new Error(response?.message || 'Error al generar enlace');
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

    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/preparar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al preparar el documento');
      }),
      catchError(error => {

        throw error;
      })
    );
  }

  /**
   * Aprobar/Rechazar documento - cambiar estatus a "4" (aprobado) o "5" (rechazado)
   * Para documentos de liquidación: monto, idPaymentMethod y fechaPago son requeridos al aprobar
   */
  aprobarDocumento(
    idDocumentByFile: number,
    nuevoEstatus: number,
    comentario?: string,
    fechaExpiracion?: Date,
    monto?: number,
    idPaymentMethod?: number,
    fechaPago?: string
  ): Observable<any> {
    const data: any = {
      idDocumentByFile: idDocumentByFile,
      nuevoEstatus: nuevoEstatus,
      comentario: comentario
    };

    if (fechaExpiracion) {
      data.fechaExpiracion = fechaExpiracion.toISOString().split('T')[0];
    }
    if (monto != null && monto > 0) {
      data.monto = monto;
    }
    if (idPaymentMethod != null && idPaymentMethod > 0) {
      data.id_payment_method = idPaymentMethod;
    }
    if (fechaPago) {
      data.fecha_pago = fechaPago;
    }

    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/aprobar-documento`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Error al procesar el documento');
      }),
      catchError(error => {

        throw error;
      })
    );
  }

  /**
   * Rechazar un documento
   */
  rechazarDocumento(documentoId: string, motivo: string, comentario?: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/validacion/rechazar`, {
      documentoId,
      motivo,
      comentario
    });
  }

  /**
   * Descargar archivo individual (por ID de documento)
   */
  descargarArchivo(documentoId: string): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/validacion/descargar/${documentoId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Descargar todos los archivos del expediente en un ZIP
   */
  descargarExpedienteZip(idFile: number): Observable<Blob> {
    return this.http.get(
      `${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/descargar-expediente-zip/${idFile}`,
      { responseType: 'blob' }
    );
  }

  /**
   * Cancelar proceso
   */
  cancelarProceso(clienteId: string, motivo: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/validacion/cancelar`, {
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

    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/cancelar-pedido`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al cancelar el pedido');
        }
      }),
      catchError(error => {

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

    return this.http.post<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/excepcion-pedido`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al crear la excepción');
        }
      }),
      catchError(error => {

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

    return this.http.delete<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/eliminar-pedido`, { body: data }).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al eliminar el pedido');
        }
      }),
      catchError(error => {

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

    return this.http.put<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/cambiar-estatus`, data).pipe(
      map(response => {
        if (response && response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al cambiar el estatus');
        }
      }),
      catchError(error => {

        throw error;
      })
    );
  }

  /**
   * Crear excepción (método legacy)
   */
  crearExcepcion(clienteId: string, datos: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/validacion/excepcion`, {
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
   * Obtener datos de identificación para edición (merge client_identification_data + client)
   */
  getDatosIdentificacion(idFile: number): Observable<DatosIdentificacion> {
    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/datos-identificacion`, {
      params: { idFile: idFile.toString() }
    }).pipe(
      map(response => {
        if (response?.success && response?.data) return response.data;
        throw new Error(response?.message || 'Error al obtener datos de identificación');
      })
    );
  }

  /**
   * Guardar datos de identificación en client_identification_data
   */
  saveDatosIdentificacion(idClient: number, data: Partial<DatosIdentificacion>, idFile?: number): Observable<{ idClient: number }> {
    const body: Record<string, unknown> = { idClient, ...data };
    if (idFile) body['idFile'] = idFile;
    return this.http.put<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/datos-identificacion`, body).pipe(
      map(response => {
        if (response?.success && response?.data) return response.data;
        throw new Error(response?.message || 'Error al guardar datos de identificación');
      })
    );
  }

  /**
   * Imprimir identificación de cliente - genera y descarga PDF vía PDF Generator API
   */
  imprimirIdentificacionCliente(idFile: number): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/imprimir-identificacion`, {
      params: { idFile: idFile.toString() },
      responseType: 'blob'
    });
  }

  /**
   * Obtener estadísticas
   */
  obtenerEstadisticas(filtros: FiltrosValidacion = {}): Observable<any> {
    let params = new HttpParams();
    if (filtros.agencia) params = params.set('id', filtros.agencia);
    if (filtros.proceso) params = params.set('idProcess', filtros.proceso);

    return this.http.get<any>(`${environment.apiBaseUrl.replace(/\/$/, '')}/api/clients-validation/estadisticas`, { params }).pipe(
      map(response => {
        if (response && response.success && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }
}
