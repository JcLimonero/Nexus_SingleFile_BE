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
import { MatDialog } from '@angular/material/dialog';
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

  private isAdminUser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog
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
}

