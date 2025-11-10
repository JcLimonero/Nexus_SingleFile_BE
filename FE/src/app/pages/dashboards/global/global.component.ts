import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Subject, of, takeUntil } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Cliente, Documento, FiltrosValidacion, ValidacionService } from '../../mesa-control/validacion/validacion.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { FASES_CATALOG, CatalogItem } from '../../../core/constants/catalogs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-global',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatTableModule
  ],
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit, OnDestroy {
  agencias: any[] = [];
  procesos: any[] = [];
  fases: CatalogItem[] = FASES_CATALOG;

  selectedAgency: number | null = null;
  selectedProcess: number | null = null;
  selectedFase: string = '';
  searchTerm = '';
  showCancelledOrders = false;

  loadingAgencias = false;
  loadingProcesos = false;
  loadingClientes = false;
  refreshing = false;
  agenciasCargadas = false;
  procesosCargados = false;

  clientesOriginales: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];

  clientesDisplayedColumns: string[] = [];

  documentosDisplayedColumns: string[] = [
    'documento',
    'disponibleCliente',
    'estatus',
    'ver',
    'cargar',
    'requerido',
    'requiereExpiracion',
    'fecha',
    'fechaExpiracion',
    'comentario',
    'asignado'
  ];

  expandedPedidoId: number | null = null;
  documentosPorPedido: Record<number, Documento[]> = {};
  documentosLoading: Record<number, boolean> = {};
  documentosError: Record<number, string | null> = {};
  selectedFiles: Record<string, File> = {};
  pedidoSeleccionado: Cliente | null = null;
  private isAdminUser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.inicializarUsuario();
    this.cargarAgencias();
    this.cargarProcesos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAgenciaChange(): void {
    if (this.selectedAgency !== null && this.selectedAgency !== undefined) {
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
    } else {
      this.defaultAgencyService.limpiarSeleccion();
    }

    this.intentarCargarClientes();
  }

  onProcesoChange(): void {
    this.intentarCargarClientes();
  }

  onFaseChange(): void {
    this.aplicarFiltros();
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  onToggleCancelledOrders(): void {
    this.aplicarFiltros();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.aplicarFiltros();
  }

  recargarFiltros(): void {
    this.refreshing = true;
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.searchTerm = '';
    this.showCancelledOrders = false;

    this.cargarAgencias(true);
    this.cargarProcesos(true);

    setTimeout(() => {
      this.refreshing = false;
      this.clientesOriginales = [];
      this.clientesFiltrados = [];
      this.expandedPedidoId = null;
      this.pedidoSeleccionado = null;
      this.documentosPorPedido = {};
      this.documentosLoading = {};
      this.documentosError = {};
    }, 300);
  }

  private cargarAgencias(showMessage: boolean = false): void {
    this.loadingAgencias = true;

    this.defaultAgencyService
      .obtenerAgencias()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {
          console.error('Error cargando agencias en Global:', error);
          this.snackBar.open('Error al cargar agencias', 'Cerrar', { duration: 3000 });
          this.agencias = [];
          this.loadingAgencias = false;
          return of([]);
        })
      )
      .subscribe((agencias) => {
        this.agencias = Array.isArray(agencias) ? agencias : [];
        this.loadingAgencias = false;
        this.agenciasCargadas = true;

        if (showMessage) {
          this.snackBar.open('Agencias actualizadas', 'Cerrar', { duration: 2000 });
        }

        if (!showMessage && this.agencias.length > 0) {
          this.defaultAgencyService
            .establecerAgenciaPredeterminada(true)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (agenciaId) => {
                if (agenciaId) {
                  this.selectedAgency = agenciaId;
                  this.onAgenciaChange();
                }
              },
              error: () => {
                if (this.agencias.length > 0) {
                  this.selectedAgency = this.agencias[0].Id;
                  this.onAgenciaChange();
                }
              }
            });
        }
      });
  }

  private inicializarUsuario(): void {
    const user = this.authService.getCurrentUser();
    const roleId = user?.role_id;
    const roleIdStr = roleId !== undefined && roleId !== null ? String(roleId) : '';
    this.isAdminUser = roleIdStr === '7';
    this.configurarColumnas();
  }

  private configurarColumnas(): void {
    const columnasBase = [
      'ndCliente',
      'ndPedido',
      'cliente',
      'proceso',
      'fase',
      'operacion',
      'registro',
      'fechaLiberacion',
      'documentosNoAprobados',
      'documentos'
    ];

    if (this.isAdminUser) {
      this.clientesDisplayedColumns = [
        'ndCliente',
        'ndPedido',
        'idFile',
        'cliente',
        'proceso',
        'fase',
        'operacion',
        'registro',
        'fechaLiberacion',
        'documentosNoAprobados',
        'documentos'
      ];
    } else {
      this.clientesDisplayedColumns = columnasBase;
    }
  }

  private cargarProcesos(showMessage: boolean = false): void {
    this.loadingProcesos = true;

    this.validacionService
      .cargarProcesos()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {
          console.error('Error cargando procesos en Global:', error);
          this.snackBar.open('Error al cargar procesos', 'Cerrar', { duration: 3000 });
          this.procesos = [];
          this.loadingProcesos = false;
          return of([]);
        })
      )
      .subscribe((procesos) => {
        this.procesos = Array.isArray(procesos) ? procesos.filter((proceso) => proceso) : [];
        this.loadingProcesos = false;
        this.procesosCargados = true;

        if (showMessage) {
          this.snackBar.open('Procesos actualizados', 'Cerrar', { duration: 2000 });
        } else if (this.procesos.length > 0 && this.selectedProcess === null) {
          this.selectedProcess = this.procesos[0].Id;
          this.onProcesoChange();
        }
      });
  }

  private intentarCargarClientes(): void {
    if (
      this.selectedAgency === null ||
      this.selectedProcess === null ||
      !this.agenciasCargadas ||
      !this.procesosCargados
    ) {
      return;
    }

    this.cargarClientes();
  }

  private cargarClientes(): void {
    const filtros: FiltrosValidacion = {
      agencia: this.selectedAgency ?? undefined,
      proceso: this.selectedProcess ?? undefined,
      showCancelled: this.showCancelledOrders
    };

    this.loadingClientes = true;
    this.validacionService
      .cargarClientes(filtros)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {
          console.error('Error cargando pedidos para Global:', error);
          this.snackBar.open('Error al cargar pedidos', 'Cerrar', { duration: 3000 });
          this.loadingClientes = false;
          this.clientesOriginales = [];
          this.clientesFiltrados = [];
          return of([]);
        })
      )
      .subscribe((clientes) => {
        this.loadingClientes = false;
        this.expandedPedidoId = null;
        this.pedidoSeleccionado = null;
        this.documentosPorPedido = {};
        this.documentosLoading = {};
        this.documentosError = {};
        this.selectedFiles = {};

        this.clientesOriginales = Array.isArray(clientes)
          ? clientes.map((cliente) => ({
              ...cliente,
              documentosNoAprobados: Number(cliente.documentosNoAprobados ?? 0)
            }))
          : [];

        this.aplicarFiltros();

        if (this.clientesOriginales.length === 0) {
          this.snackBar.open('No se encontraron pedidos con los filtros seleccionados', 'Cerrar', {
            duration: 2500
          });
        }
      });
  }

  private aplicarFiltros(): void {
    let data = [...this.clientesOriginales];

    if (!this.showCancelledOrders) {
      data = data.filter((cliente) => String(cliente.IdCurrentState) !== '5');
    } else {
      data = data.filter((cliente) => String(cliente.IdCurrentState) === '5');
    }

    if (this.selectedFase) {
      const faseNormalizada = this.selectedFase.toLowerCase();
      data = data.filter((cliente) => (cliente.fase || '').toLowerCase() === faseNormalizada);
    }

    if (this.searchTerm) {
      const termino = this.searchTerm.toLowerCase();
      data = data.filter((cliente) => {
        const clienteNombre = cliente.cliente?.toLowerCase() ?? '';
        const ndCliente = String(cliente.ndCliente ?? '');
        const ndPedido = String(cliente.ndPedido ?? '');
        return (
          clienteNombre.includes(termino) ||
          ndCliente.includes(termino) ||
          ndPedido.includes(termino)
        );
      });
    }

    this.clientesFiltrados = data;

    if (this.expandedPedidoId !== null) {
      const encontrado = this.clientesFiltrados.find(
        (cliente) => cliente.idFile === this.expandedPedidoId
      );
      if (encontrado) {
        this.pedidoSeleccionado = encontrado;
      } else {
        this.expandedPedidoId = null;
        this.pedidoSeleccionado = null;
      }
    }
  }

  isExpanded(cliente: Cliente): boolean {
    return this.expandedPedidoId === cliente.idFile;
  }

  toggleDocumentos(cliente: Cliente): void {
    if (this.isExpanded(cliente)) {
      this.expandedPedidoId = null;
      this.pedidoSeleccionado = null;
      return;
    }

    this.expandedPedidoId = cliente.idFile;
    this.pedidoSeleccionado = cliente;
    if (!this.documentosPorPedido[cliente.idFile]) {
      this.cargarDocumentosPedido(cliente);
    }
  }

  private cargarDocumentosPedido(cliente: Cliente, forceReload: boolean = false): void {
    if (!cliente || (!forceReload && this.documentosLoading[cliente.idFile])) {
      return;
    }

    this.documentosLoading[cliente.idFile] = true;
    this.documentosError[cliente.idFile] = null;

    this.validacionService
      .cargarDocumentos(cliente.idFile)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {
          console.error('Error cargando documentos para pedido global:', error);
          this.documentosError[cliente.idFile] = 'Error al cargar documentos';
          this.documentosLoading[cliente.idFile] = false;
          return of([]);
        })
      )
      .subscribe((documentos) => {
        const docs = Array.isArray(documentos) ? documentos : [];
        this.documentosPorPedido[cliente.idFile] = docs;
        this.documentosLoading[cliente.idFile] = false;
        this.actualizarContadorDocumentos(cliente, docs);
      });
  }

  private actualizarContadorDocumentos(cliente: Cliente, documentos: Documento[]): void {
    const pendientes = documentos.filter(
      (doc) => Number(doc.idEstatus) !== 4 && Number(doc.idEstatus) !== 0
    ).length;
    cliente.documentosNoAprobados = pendientes;
  }

  isDocumentoStatus(documento: Documento, status: number): boolean {
    return Number(documento?.idEstatus) === status;
  }

  onFileSelected(event: Event, documento: Documento): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    const key = this.obtenerClaveDocumento(documento);
    if (!key) {
      return;
    }

    this.selectedFiles[key] = file;
  }

  uploadDocument(documento: Documento, cliente: Cliente): void {
    const key = this.obtenerClaveDocumento(documento);
    if (!key) {
      this.snackBar.open('No se pudo identificar el documento', 'Cerrar', { duration: 3000 });
      return;
    }

    const file = this.selectedFiles[key];
    if (!file) {
      this.snackBar.open('Debe seleccionar un archivo', 'Cerrar', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('idSingleFile', cliente.idFile.toString());
    formData.append('idDocumentFile', key);

    this.http
      .post<any>(environment.vanguardia.uploadApiUrl, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(`Documento ${documento.documento} cargado correctamente`, 'Cerrar', {
            duration: 3000
          });
          delete this.selectedFiles[key];
          this.cargarDocumentosPedido(cliente, true);
        },
        error: (error) => {
          console.error('Error subiendo documento desde Global:', error);
          this.snackBar.open('Error al subir el documento', 'Cerrar', { duration: 4000 });
        }
      });
  }

  canUpload(documento: Documento): boolean {
    const key = this.obtenerClaveDocumento(documento);
    const hasFile = key ? !!this.selectedFiles[key] : false;
    const status = Number(documento.idEstatus);
    return hasFile && status !== 3 && status !== 4;
  }

  onVerDocumento(documento: Documento, cliente: Cliente): void {
    if (!documento.documentContainer) {
      this.snackBar.open('No se puede visualizar el documento. No hay archivo asociado.', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const status = String(documento.idEstatus);
    if (status === '2') {
      if (documento.idDocumentByFile === undefined || documento.idDocumentByFile === null) {
        this.snackBar.open('No se pudo preparar el documento, identificador inválido.', 'Cerrar', {
          duration: 3000
        });
        this.abrirDocumento(documento);
        return;
      }

      this.validacionService
        .prepararDocumento(documento.idDocumentByFile!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            documento.idEstatus = 3;
            this.abrirDocumento(documento);
            this.cargarDocumentosPedido(cliente, true);
          },
          error: () => {
            this.snackBar.open(
              'No se pudo actualizar el estatus, pero se intentará abrir el documento',
              'Cerrar',
              { duration: 3000 }
            );
            this.abrirDocumento(documento);
          }
        });
    } else {
      this.abrirDocumento(documento);
    }
  }

  private abrirDocumento(documento: Documento): void {
    const fileName = documento.documentContainer;
    const duration = 3600;
    const params = new URLSearchParams();
    if (fileName) {
      params.append('file', fileName);
    }
    params.append('duration', duration.toString());

    const url = `${environment.vanguardia.uploadApiUrl.replace('/upload', '')}/get-private-url?${params.toString()}`;

    this.http
      .get<any>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const privateUrl = response?.data?.url;
          if (privateUrl) {
            const newWindow = window.open(privateUrl, '_blank');
            if (!newWindow) {
              this.snackBar.open('No se pudo abrir el documento en una nueva pestaña.', 'Cerrar', {
                duration: 4000
              });
            }
          } else {
            this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error('Error obteniendo URL privada de Backblaze:', error);
          this.snackBar.open('Error al obtener la URL del documento', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  private obtenerClaveDocumento(documento: Documento): string | null {
    if (documento?.idDocumentByFile !== undefined && documento.idDocumentByFile !== null) {
      return documento.idDocumentByFile.toString();
    }
    return null;
  }
}

