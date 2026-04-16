import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, of, takeUntil } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Cliente, FiltrosValidacion, ValidacionService } from '../../mesa-control/validacion/validacion.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { FASES_CATALOG, CatalogItem } from '../../../core/constants/catalogs';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalDocumentosDialogComponent } from './global-documentos-dialog/global-documentos-dialog.component';

@Component({
  selector: 'app-dashboard-global',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule
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
  
  registrationDateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });
  
  liberationDateRangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  loadingAgencias = false;
  loadingProcesos = false;
  loadingClientes = false;
  refreshing = false;
  agenciasCargadas = false;
  procesosCargados = false;
  exportingExcel = false;

  /** Página actual del listado (servidor) */
  currentPage = 0;
  pageSize = 25;
  pageSizeOptions = [10, 25, 50, 100];
  totalRecords = 0;

  clientesFiltrados: Cliente[] = [];

  clientesDisplayedColumns: string[] = [];

  private isAdminUser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    // Suscribirse a cambios en los grupos de rango de fecha
    this.registrationDateRangeGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cargarClientesLista({ resetPage: true });
      });

    this.liberationDateRangeGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cargarClientesLista({ resetPage: true });
      });
  }

  ngOnInit(): void {
    // Obtener la agencia guardada inmediatamente al inicializar
    const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
    if (savedAgencyId !== null) {
      this.selectedAgency = savedAgencyId;
    }

    // Suscribirse a los cambios de agencia del servicio compartido
    this.defaultAgencyService.selectedAgency$
      .pipe(takeUntil(this.destroy$))
      .subscribe(agenciaId => {
        if (agenciaId !== null && agenciaId !== this.selectedAgency) {
          this.selectedAgency = agenciaId;
        }
      });

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
      // seleccionarAgencia() ya actualiza el caché (cookie y BehaviorSubject)
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency);
      
      // COMENTADO: Llamada HTTP deshabilitada para mejorar performance
      // La actualización del servidor se puede hacer de forma asíncrona o en otro momento
      // seleccionarAgencia() ya maneja el caché local
      /*
      // Actualizar la agencia predeterminada del usuario
      this.defaultAgencyService.actualizarAgenciaPredeterminada(this.selectedAgency).subscribe({
        next: (success) => {
          if (success) {

          } else {

          }
        },
        error: (error) => {

        }
      });
      */
    } else {
      this.defaultAgencyService.limpiarSeleccion();
    }

    this.intentarCargarClientes();
  }

  onProcesoChange(): void {
    this.intentarCargarClientes();
  }

  onFaseChange(): void {
    this.cargarClientesLista({ resetPage: true });
  }

  onSearchChange(): void {
    this.cargarClientesLista({ resetPage: true });
  }

  onToggleCancelledOrders(): void {
    this.cargarClientesLista({ resetPage: true });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.cargarClientesLista({ resetPage: true });
  }

  limpiarFiltros(): void {
    this.selectedFase = '';
    this.searchTerm = '';
    this.registrationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });
    this.liberationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });
    this.cargarClientesLista({ resetPage: true });
  }

  recargarFiltros(): void {
    this.refreshing = true;
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.searchTerm = '';
    this.showCancelledOrders = false;
    this.registrationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });
    this.liberationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });

    this.cargarAgencias(true);
    this.cargarProcesos(true);

    setTimeout(() => {
      this.refreshing = false;
      this.clientesFiltrados = [];
      this.totalRecords = 0;
      this.currentPage = 0;
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
          console.error('Error cargando agencias:', error);
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
          // Establecer agencia predeterminada DESPUÉS de que las agencias se carguen
          setTimeout(() => {
            // Obtener la agencia guardada
            const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
            
            // Verificar que la agencia guardada existe en la lista
            if (savedAgencyId !== null && this.agencias.some(ag => ag.Id === savedAgencyId)) {
              // La agencia guardada existe, usarla
              this.selectedAgency = savedAgencyId;
              this.onAgenciaChange();
            } else {
              // Si no hay agencia guardada válida, establecer la predeterminada
              this.defaultAgencyService
                .establecerAgenciaPredeterminada(true)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (agenciaId) => {
                    if (agenciaId && this.agencias.some(ag => ag.Id === agenciaId)) {
                      this.selectedAgency = agenciaId;
                      this.onAgenciaChange();
                    }
                  },
                  error: () => {
                    // Si falla y hay agencias, seleccionar la primera
                    if (this.agencias.length > 0) {
                      this.selectedAgency = this.agencias[0].Id;
                      this.onAgenciaChange();
                    }
                  }
                });
            }
          }, 150); // Aumentar el timeout para asegurar que las opciones se rendericen
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
    this.clientesDisplayedColumns = [
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
  }

  private cargarProcesos(showMessage: boolean = false): void {
    this.loadingProcesos = true;

    this.validacionService
      .cargarProcesos()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {

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

    this.cargarClientesLista({ resetPage: true });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarClientesLista();
  }

  /**
   * Construye filtros para el API (incluye fase, búsqueda y rangos de fecha).
   */
  private buildFiltrosApi(): FiltrosValidacion {
    const filtros: FiltrosValidacion = {
      agencia: this.selectedAgency ?? undefined,
      proceso: this.selectedProcess ?? undefined,
      showCancelled: this.showCancelledOrders
    };
    if (this.selectedFase) {
      filtros.idCurrentState = parseInt(this.selectedFase, 10);
    }
    if (this.searchTerm?.trim()) {
      filtros.q = this.searchTerm.trim();
    }
    const reg = this.registrationDateRangeGroup.value;
    if (reg.start) {
      filtros.registroDesde = this.toYmd(reg.start);
    }
    if (reg.end) {
      filtros.registroHasta = this.toYmd(reg.end);
    }
    const lib = this.liberationDateRangeGroup.value;
    if (lib.start) {
      filtros.liberacionDesde = this.toYmd(lib.start);
    }
    if (lib.end) {
      filtros.liberacionHasta = this.toYmd(lib.end);
    }
    return filtros;
  }

  private toYmd(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Carga la página actual de pedidos desde el servidor.
   */
  private cargarClientesLista(options?: { resetPage?: boolean }): void {
    if (
      this.selectedAgency === null ||
      this.selectedProcess === null ||
      !this.agenciasCargadas ||
      !this.procesosCargados
    ) {
      return;
    }

    if (options?.resetPage) {
      this.currentPage = 0;
    }

    this.loadingClientes = true;
    const filtros = this.buildFiltrosApi();

    this.validacionService
      .cargarClientes(filtros, this.currentPage + 1, this.pageSize)
      .pipe(
        takeUntil(this.destroy$),
        timeout(60000),
        catchError(() => {
          this.snackBar.open('Error al cargar pedidos', 'Cerrar', { duration: 3000 });
          this.loadingClientes = false;
          this.clientesFiltrados = [];
          this.totalRecords = 0;
          return of({ clientes: [], totalRecords: 0 });
        })
      )
      .subscribe((result) => {
        if (result.clientes.length === 0 && result.totalRecords > 0 && this.currentPage > 0) {
          this.currentPage--;
          this.cargarClientesLista();
          return;
        }

        this.totalRecords = result.totalRecords;
        const clientes = result.clientes;
        this.clientesFiltrados = Array.isArray(clientes)
          ? clientes.map((cliente) => ({
              ...cliente,
              documentosNoAprobados: Number(cliente.documentosNoAprobados ?? 0)
            }))
          : [];

        this.loadingClientes = false;

        if (result.totalRecords === 0) {
          this.snackBar.open('No se encontraron pedidos con los filtros seleccionados', 'Cerrar', {
            duration: 2500
          });
        }
      });
  }

  hasRegistrationDateRange(): boolean {
    return !!(this.registrationDateRangeGroup.value.start || this.registrationDateRangeGroup.value.end);
  }

  hasLiberationDateRange(): boolean {
    return !!(this.liberationDateRangeGroup.value.start || this.liberationDateRangeGroup.value.end);
  }

  clearRegistrationDateRange(): void {
    this.registrationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });
    this.cargarClientesLista({ resetPage: true });
  }

  clearLiberationDateRange(): void {
    this.liberationDateRangeGroup.patchValue({ start: null, end: null }, { emitEvent: false });
    this.cargarClientesLista({ resetPage: true });
  }

  openDocumentsDialog(cliente: Cliente): void {
    const dialogRef = this.dialog.open(GlobalDocumentosDialogComponent, {
      width: '1200px',
      maxHeight: '90vh',
      data: { cliente }
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result && typeof result.documentosNoAprobados === 'number') {
          cliente.documentosNoAprobados = result.documentosNoAprobados;
        }
      });
  }

  exportarExcel(): void {
    if (this.totalRecords === 0) {
      this.snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 3000 });
      return;
    }

    this.exportingExcel = true;

    this.validacionService
      .cargarClientes(this.buildFiltrosApi(), 1, 10000)
      .pipe(
        takeUntil(this.destroy$),
        timeout(120000),
        catchError(() => {
          this.exportingExcel = false;
          this.snackBar.open('Error al exportar datos', 'Cerrar', { duration: 3000 });
          return of({ clientes: [] as Cliente[], totalRecords: 0 });
        })
      )
      .subscribe({
        next: (result) => {
          this.exportingExcel = false;

          const filas = (result.clientes || []).map((cliente) => ({
            'ND Cliente': cliente.ndCliente || '',
            'ND Pedido': cliente.ndPedido || '',
            Cliente: cliente.cliente || '',
            Proceso: cliente.proceso || '',
            Fase: cliente.fase || '',
            Operación: cliente.operacion || '',
            Registro: cliente.registro ? new Date(cliente.registro).toLocaleDateString('es-MX') : '',
            'Fecha Liberación': cliente.fechaLiberacion
              ? new Date(cliente.fechaLiberacion).toLocaleDateString('es-MX')
              : '—',
            'Documentos Pendientes': Number(cliente.documentosNoAprobados ?? 0)
          }));

          if (filas.length === 0) {
            this.snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 3000 });
            return;
          }

          try {
            const headers = Object.keys(filas[0]);
            const csvContent = [
              headers.join(','),
              ...filas.map((row) =>
                headers.map((header) => {
                  const value = (row as Record<string, string | number>)[header];
                  if (
                    typeof value === 'string' &&
                    (value.includes(',') || value.includes('"') || value.includes('\n'))
                  ) {
                    return `"${value.replace(/"/g, '""')}"`;
                  }
                  return value;
                }).join(',')
              )
            ].join('\n');

            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

            let nombreAgencia = 'Todas';
            if (this.selectedAgency !== null) {
              const agenciaSeleccionada = this.agencias.find((a) => a.Id === this.selectedAgency);
              if (agenciaSeleccionada?.Name) {
                nombreAgencia = agenciaSeleccionada.Name.replace(/[^a-zA-Z0-9]/g, '_');
              }
            }

            const fechaDescarga = new Date().toISOString().split('T')[0];
            const nombreArchivo = `${nombreAgencia}ordenes_${fechaDescarga}.csv`;

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            this.snackBar.open('Datos exportados exitosamente', 'Cerrar', { duration: 3000 });
          } catch {
            this.snackBar.open('Error al exportar datos', 'Cerrar', { duration: 3000 });
          }
        },
        error: () => {
          this.exportingExcel = false;
        }
      });
  }
}

