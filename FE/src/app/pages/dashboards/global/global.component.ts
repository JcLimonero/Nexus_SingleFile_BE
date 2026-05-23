import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subject, of, takeUntil } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Cliente, FiltrosValidacion, ValidacionService } from '../../mesa-control/validacion/validacion.service';
import { DefaultAgencyService } from '../../../core/services/default-agency.service';
import { CompanyService } from '../../../core/services/company.service';
import { FASES_FILTER_CATALOG, CatalogItem } from '../../../core/constants/catalogs';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalDocumentosDialogComponent } from './global-documentos-dialog/global-documentos-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { readFiltersFromUrl, writeFiltersToUrl } from '../../../core/utils/filter-url-sync';

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
export class GlobalComponent implements OnInit, OnDestroy, AfterViewInit {
  agencias: any[] = [];
  procesos: any[] = [];
  fases: CatalogItem[] = FASES_FILTER_CATALOG;
  companies: { id: number; name: string }[] = [];

  selectedCompany: number | string = '';
  selectedAgency: number | string | null = '';
  selectedProcess: number | string | null = '';
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

  loadingCompanies = false;
  loadingAgencias = false;
  loadingProcesos = false;
  loadingClientes = false;
  refreshing = false;
  agenciasCargadas = false;
  procesosCargados = false;
  exportingExcel = false;

  clientesOriginales: Cliente[] = [];
  clientesDataSource = new MatTableDataSource<Cliente>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  clientesDisplayedColumns: string[] = [];

  private isAdminUser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private validacionService: ValidacionService,
    private defaultAgencyService: DefaultAgencyService,
    private companyService: CompanyService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Suscribirse a cambios en los grupos de rango de fecha
    this.registrationDateRangeGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.aplicarFiltros();
      });

    this.liberationDateRangeGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.aplicarFiltros();
      });
  }

  ngOnInit(): void {
    // Restaurar filtros desde URL (sobrescribe defaults). F5 conserva contexto.
    const fromUrl = readFiltersFromUrl<{
      company?: number | string;
      agency?: number | string;
      process?: number | string;
      q?: string;
    }>(this.route);
    if (fromUrl.company !== undefined) this.selectedCompany = fromUrl.company;
    if (fromUrl.agency !== undefined) this.selectedAgency = fromUrl.agency as any;
    if (fromUrl.process !== undefined) this.selectedProcess = fromUrl.process as any;
    if (fromUrl.q !== undefined) this.searchTerm = String(fromUrl.q);

    // Obtener la agencia guardada inmediatamente al inicializar (solo si URL no la trajo)
    if (fromUrl.agency === undefined) {
      const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
      if (savedAgencyId !== null) {
        this.selectedAgency = savedAgencyId;
      }
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
    this.cargarCompanies();
    this.cargarAgencias();
    this.cargarProcesos();
  }

  /** Persiste los filtros actuales en la URL (?company=...&agency=...&process=...&q=...) */
  private syncFiltersToUrl(): void {
    writeFiltersToUrl(this.router, this.route, {
      company: this.selectedCompany,
      agency: this.selectedAgency,
      process: this.selectedProcess,
      q: this.searchTerm
    });
  }

  get agenciesFiltradas(): any[] {
    if (!this.selectedCompany || this.selectedCompany === '') return this.agencias;
    const idComp = Number(this.selectedCompany);
    return this.agencias.filter((a: any) => {
      const aId = a.id_company ?? a.IdCompany ?? a.idCompany;
      if (aId == null || aId === '') return false;
      return Number(aId) === idComp;
    });
  }

  onCompanyChange(): void {
    if (this.agenciesFiltradas.length > 0 && this.selectedAgency) {
      const agencyInList = this.agenciesFiltradas.some(
        (a: any) => String(a.id ?? a.Id) === String(this.selectedAgency)
      );
      if (!agencyInList) {
        this.selectedAgency = '';
      }
    } else if (this.agenciesFiltradas.length === 0) {
      this.selectedAgency = '';
    }
    this.intentarCargarClientes();
  }

  private cargarCompanies(): void {
    this.loadingCompanies = true;
    this.companyService.getCompanies().subscribe({
      next: (res) => {
        if (res.success && res.data?.companies) {
          this.companies = (res.data.companies as any[]).map((c: any) => ({
            id: c.id ?? c.Id,
            name: c.name ?? c.Name
          }));
        }
        this.loadingCompanies = false;
      },
      error: () => {
        this.loadingCompanies = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.clientesDataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAgenciaChange(): void {
    if (this.selectedAgency !== null && this.selectedAgency !== undefined && this.selectedAgency !== '') {
      // seleccionarAgencia() ya actualiza el caché (cookie y BehaviorSubject)
      this.defaultAgencyService.seleccionarAgencia(this.selectedAgency as number);
      
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

  limpiarFiltros(): void {
    this.selectedCompany = '';
    this.selectedFase = '';
    this.searchTerm = '';
    this.registrationDateRangeGroup.patchValue({ start: null, end: null });
    this.liberationDateRangeGroup.patchValue({ start: null, end: null });
    this.aplicarFiltros();
  }

  recargarDatos(): void {
    this.intentarCargarClientes();
  }

  recargarFiltros(): void {
    this.refreshing = true;
    this.selectedCompany = '';
    this.selectedAgency = null;
    this.selectedProcess = null;
    this.selectedFase = '';
    this.searchTerm = '';
    this.showCancelledOrders = false;
    this.registrationDateRangeGroup.patchValue({ start: null, end: null });
    this.liberationDateRangeGroup.patchValue({ start: null, end: null });

    this.cargarAgencias(true);
    this.cargarProcesos(true);

    setTimeout(() => {
      this.refreshing = false;
      this.clientesOriginales = [];
      this.clientesDataSource.data = [];
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
        const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
        if (savedAgencyId !== null && this.agencias.some(ag => ag.Id === savedAgencyId)) {
          this.selectedAgency = savedAgencyId;
          this.onAgenciaChange();
        }
        // Si no hay agencia guardada, permanece en '' ("Todas las agencias")
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
      'monto',
      'avisoConfidencialidad',
      'beneficiarios',
      'registro',
      'fechaLiberacion',
      'documentosNoAprobados',
      'documentos'
    ];
  }

  formatMonto(value: number | null | undefined): string {
    if (value == null || value === undefined) return '—';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  isBeneficiariosCompleto(cliente: Cliente): boolean {
    const pct = Number(cliente.porcentajeBeneficiarios ?? 0);
    return pct >= 100;
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
        }
        // Si no hay proceso seleccionado, permanece en '' ("Todos los procesos")
      });
  }

  private intentarCargarClientes(): void {
    if (
      (this.selectedAgency === null || this.selectedAgency === undefined) ||
      (this.selectedProcess === null || this.selectedProcess === undefined) ||
      !this.agenciasCargadas ||
      !this.procesosCargados
    ) {
      return;
    }

    this.cargarClientes();
  }

  private cargarClientes(): void {
    if (this.selectedAgency === null || this.selectedAgency === undefined) {
      this.loadingClientes = false;
      this.clientesOriginales = [];
      this.clientesDataSource.data = [];
      return;
    }

    const filtros: FiltrosValidacion = {
      agencia: (this.selectedAgency === '' ? undefined : this.selectedAgency) as number | undefined,
      proceso: (this.selectedProcess === '' ? undefined : this.selectedProcess) as number | undefined,
      showCancelled: this.showCancelledOrders
    };

    this.loadingClientes = true;
    this.validacionService
      .cargarClientes(filtros)
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError((error) => {

          this.snackBar.open('Error al cargar pedidos', 'Cerrar', { duration: 3000 });
          this.loadingClientes = false;
          this.clientesOriginales = [];
          this.clientesDataSource.data = [];
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
      // Comparar IdCurrentState con el valor de la fase seleccionada
      data = data.filter((cliente) => String(cliente.IdCurrentState) === this.selectedFase);
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

    // Filtro por fecha de registro
    const registrationRange = this.registrationDateRangeGroup.value;
    if (registrationRange.start || registrationRange.end) {
      data = data.filter((cliente) => {
        if (!cliente.registro) return false;
        const registroDate = new Date(cliente.registro);
        registroDate.setHours(0, 0, 0, 0);
        
        if (registrationRange.start) {
          const startDate = new Date(registrationRange.start);
          startDate.setHours(0, 0, 0, 0);
          if (registroDate < startDate) return false;
        }
        
        if (registrationRange.end) {
          const endDate = new Date(registrationRange.end);
          endDate.setHours(23, 59, 59, 999);
          if (registroDate > endDate) return false;
        }
        
        return true;
      });
    }

    // Filtro por fecha de liberación
    const liberationRange = this.liberationDateRangeGroup.value;
    if (liberationRange.start || liberationRange.end) {
      data = data.filter((cliente) => {
        if (!cliente.fechaLiberacion) return false;
        const liberationDate = new Date(cliente.fechaLiberacion);
        liberationDate.setHours(0, 0, 0, 0);
        
        if (liberationRange.start) {
          const startDate = new Date(liberationRange.start);
          startDate.setHours(0, 0, 0, 0);
          if (liberationDate < startDate) return false;
        }
        
        if (liberationRange.end) {
          const endDate = new Date(liberationRange.end);
          endDate.setHours(23, 59, 59, 999);
          if (liberationDate > endDate) return false;
        }
        
        return true;
      });
    }

    this.clientesDataSource.data = data;
    // Conectar paginador cuando hay datos (puede no existir en el primer render)
    setTimeout(() => {
      if (this.paginator) {
        this.clientesDataSource.paginator = this.paginator;
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
    this.registrationDateRangeGroup.patchValue({ start: null, end: null });
  }

  clearLiberationDateRange(): void {
    this.liberationDateRangeGroup.patchValue({ start: null, end: null });
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
    if (this.clientesDataSource.data.length === 0) {
      this.snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 3000 });
      return;
    }

    this.exportingExcel = true;

    try {
      // Preparar datos para Excel (sin la columna de documentos)
      const datos = this.clientesDataSource.data.map(cliente => ({
        'ND Cliente': cliente.ndCliente || '',
        'ND Pedido': cliente.ndPedido || '',
        'Cliente': cliente.cliente || '',
        'Proceso': cliente.proceso || '',
        'Fase': cliente.fase || '',
        'Operación': cliente.operacion || '',
        'Monto': cliente.montoUnidad != null ? this.formatMonto(cliente.montoUnidad) : '—',
        'Aviso confid.': cliente.avisoConfidencialidadAceptado ? 'Sí' : 'No',
        'Beneficiarios %': cliente.porcentajeBeneficiarios != null ? cliente.porcentajeBeneficiarios : '—',
        'Registro': cliente.registro ? new Date(cliente.registro).toLocaleDateString('es-MX') : '',
        'Fecha Liberación': cliente.fechaLiberacion ? new Date(cliente.fechaLiberacion).toLocaleDateString('es-MX') : '—',
        'Documentos Pendientes': cliente.documentosNoAprobados ?? 0
      }));

      // Crear CSV (compatible con Excel)
      const headers = Object.keys(datos[0]);
      const csvContent = [
        headers.join(','),
        ...datos.map(row => 
          headers.map(header => {
            const value = (row as any)[header];
            // Escapar comillas y envolver en comillas si contiene comas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Agregar BOM para UTF-8 (para que Excel reconozca caracteres especiales)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Obtener nombre de la agencia seleccionada
      let nombreAgencia = 'Todas';
      if (this.selectedAgency !== null) {
        const agenciaSeleccionada = this.agencias.find(a => a.Id === this.selectedAgency);
        if (agenciaSeleccionada && agenciaSeleccionada.Name) {
          // Limpiar el nombre de la agencia para usar en el nombre del archivo (remover caracteres especiales)
          nombreAgencia = agenciaSeleccionada.Name.replace(/[^a-zA-Z0-9]/g, '_');
        }
      }

      // Formatear fecha de descarga (YYYY-MM-DD)
      const fechaDescarga = new Date().toISOString().split('T')[0];
      
      // Crear nombre del archivo: {nombreAgencia}ordenes_{fecha}.csv
      const nombreArchivo = `${nombreAgencia}ordenes_${fechaDescarga}.csv`;
      
      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.snackBar.open('Datos exportados exitosamente', 'Cerrar', { duration: 3000 });
    } catch (error) {

      this.snackBar.open('Error al exportar datos', 'Cerrar', { duration: 3000 });
    } finally {
      this.exportingExcel = false;
    }
  }
}

