import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DefaultAgencyService, Agencia } from '../../../core/services/default-agency.service';
import { CompanyService, Company } from '../../../core/services/company.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConsolidacionDmsService, PedidoDms } from './consolidacion-dms.service';

@Component({
  selector: 'vex-consolidacion-dms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatMenuModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
],
  templateUrl: './consolidacion-dms.component.html',
  styleUrl: './consolidacion-dms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsolidacionDmsComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private destroy$ = new Subject<void>();

  loading = false;
  loadingAgencias = false;
  agencias: Agencia[] = [];
  companies: Company[] = [];
  /** Valor centinela para "Todas" (mat-select no muestra bien null) */
  readonly COMPANIA_TODAS = -1;
  filterCompania: number = this.COMPANIA_TODAS; // Filtro por razón social (agrupa agencias)
  selectedAgencyIds: number[] = [];

  // Filtro de período
  private now = new Date();
  periodPreset: 'mes_actual' | 'mes_anterior' | 'ultimos_2' | 'ultimos_3' | 'este_anio' | 'rango' = 'mes_actual';

  // Solo para rango personalizado: un solo control de rango de fechas
  rangeDateGroup = new FormGroup({
    start: new FormControl<Date | null>(new Date(this.now.getFullYear(), this.now.getMonth(), 1)),
    end: new FormControl<Date | null>(new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0))
  });

  periodPresets: { value: 'mes_actual' | 'mes_anterior' | 'ultimos_2' | 'ultimos_3' | 'este_anio' | 'rango'; label: string }[] = [
    { value: 'mes_actual', label: 'Mes actual' },
    { value: 'mes_anterior', label: 'Mes anterior' },
    { value: 'ultimos_2', label: 'Últimos 2 meses' },
    { value: 'ultimos_3', label: 'Últimos 3 meses' },
    { value: 'este_anio', label: 'Este año (ene-act)' },
    { value: 'rango', label: 'Rango personalizado' },
  ];

  meses: { value: number; label: string }[] = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
  ];
  anios: number[] = [];

  /** Valor centinela para "Todos" en Estatus */
  readonly ESTATUS_TODAS = -1;
  filterEstatus: number = -1;
  totalRecords = 0;
  currentPage = 1;
  pageSize = 20;

  estatusOptions: { value: number; label: string }[] = [
    { value: -1, label: 'Todos' },
    { value: 0, label: 'Sin Integrar' },
    { value: 1, label: 'Integración' },
    { value: 2, label: 'Liquidación' },
    { value: 3, label: 'Liberación' },
  ];

  /** Columnas fijas: detalles del pedido + estatus en Nexfile */
  readonly displayedColumns: string[] = [
    'agency_name', 'bussines_name', 'order_dms', 'state', 'tipo_operacion', 'tipo_proceso', 'tipo_cliente', 'vin', 'release_date'
  ];
  dataSource = new MatTableDataSource<PedidoDms>([]);

  pageSizeOptions = [20, 25, 50, 100, 200];
  exportingExcel = false;

  // Mapeo de estado (state) numérico a etiqueta
  private stateLabels: { [key: number]: string } = {
    1: 'Integración',
    2: 'Liquidación',
    3: 'Liberación',
    4: 'Liberado',
    5: 'Cancelado',
    6: 'Liberado por Excepción',
  };

  // Mapeo de nombres de columnas (snake_case) a nombres de visualización
  private columnDisplayNames: { [key: string]: string } = {
    'agency_name': 'Agencia',
    'id_agency': 'Agencia',
    'agencyName': 'Agencia',
    'order_dms': 'Pedido DMS',
    'customer_dms': 'Cliente DMS',
    'consultant_name': 'Consultor',
    'nd_cliente': 'ND Cliente',
    'nd_consultant': 'ND Consultor',
    'state': 'Estatus',
    'vin': 'VIN',
    'invoice_reference': 'Factura',
    'delivery_date': 'Fecha Liberación',
    'release_date': 'Fecha Liberación',
    'delivery_month': 'Mes Entrega',
    'delivery_year': 'Año Entrega',
    'timestamp_dms': 'Fecha DMS',
    'external_color': 'Color Exterior',
    'internal_color': 'Color Interior',
    'model': 'Modelo',
    'version': 'Versión',
    'connection_string': 'Conexión',
    'bussines_name': 'Razón Social',
    'tipo_cliente': 'Tipo Cliente',
    'tipo_operacion': 'Tipo Operación',
    'tipo_proceso': 'Tipo Proceso',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private defaultAgencyService: DefaultAgencyService,
    private companyService: CompanyService,
    private consolidacionDmsService: ConsolidacionDmsService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Años disponibles: actual y 5 años atrás
    const currentYear = this.now.getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.anios.push(y);
    }
    this.cargarAgencias();
    this.cargarCompanias();
  }

  private cargarCompanias(): void {
  this.companyService.getCompanies().pipe(takeUntil(this.destroy$)).subscribe({
    next: (res) => {
      if (res.success && res.data?.companies) {
        const raw = res.data.companies as unknown as Array<Record<string, unknown>>;
        this.companies = raw.map((c) => ({
          Id: (c['Id'] ?? c['id']) as number,
          Name: String(c['Name'] ?? c['name'] ?? c['company_name'] ?? '')
        }));

        this.filterCompania = this.COMPANIA_TODAS;
        this.cdr.markForCheck();
      }
    }
  });
}

  /** Obtiene el nombre de una razón social (soporta distintas claves del API) */
  getCompanyName(c: Company): string {
    const rec = c as unknown as Record<string, unknown>;
    const raw = rec['Name'] ?? rec['name'] ?? rec['company_name'];
    return raw != null ? String(raw) : '';
  }

  /** Obtiene el ID de una razón social (soporta distintas claves del API) */
  getCompanyId(c: Company): number {
    const rec = c as unknown as Record<string, unknown>;
    const raw = rec['Id'] ?? rec['id'];
    return typeof raw === 'number' ? raw : Number(raw) || 0;
  }

  /** Agencias filtradas por razón social seleccionada */
  get agenciasFiltradas(): Agencia[] {
    if (this.filterCompania === this.COMPANIA_TODAS) return this.agencias;
    const idComp = Number(this.filterCompania);
    return this.agencias.filter(a => {
      const aId = a['IdCompany'] ?? a['id_company'] ?? a['idCompany'];
      if (aId == null || aId === '') return false;
      return Number(aId) === idComp;
    });
  }

  /** Texto del botón selector de agencias */
  get agenciaSelectorLabel(): string {
    if (this.loadingAgencias) return 'Cargando...';
    const list = this.agenciasFiltradas;
    if (list.length === 0) return this.filterCompania !== this.COMPANIA_TODAS ? 'Sin agencias para esta razón social' : 'No hay agencias';
    const selectedCount = list.filter(a => this.selectedAgencyIds.includes(a.id ?? (a as any).Id)).length;
    if (selectedCount === 0) return 'Seleccione agencias';
    const allSelected = selectedCount === list.length;
    return allSelected ? `Todas (${list.length})` : `${selectedCount} agencia(s)`;
  }

  onCompaniaChange(companiaId: number): void {
    const normalized = typeof companiaId === 'number' ? companiaId : Number(companiaId);
    if (Number.isNaN(normalized)) {
      return;
    }

    if (normalized === this.COMPANIA_TODAS) {
      this.selectedAgencyIds = [];
      this.cdr.markForCheck();
      return;
    }

    const ids = this.agencias
      .filter((agencia) => {
        const companyId = agencia['IdCompany'] ?? agencia['id_company'] ?? agencia['idCompany'];
        if (companyId == null || companyId === '') return false;
        const num = typeof companyId === 'number' ? companyId : Number(companyId);
        return !Number.isNaN(num) && num === normalized;
      })
      .map((agencia) => {
        const rawId = agencia.id ?? (agencia as any).Id;
        const num = typeof rawId === 'number' ? rawId : Number(rawId);
        return Number.isNaN(num) ? null : num;
      })
      .filter((id): id is number => id !== null);

    this.selectedAgencyIds = ids;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarAgencias(): void {
    this.loadingAgencias = true;
    this.cdr.markForCheck();
    // forceRefresh para asegurar IdCompany (evita cache antiguo sin razón social)
    this.defaultAgencyService
      .obtenerAgencias(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lista) => {
          this.agencias = (lista || []).filter((a) => this.defaultAgencyService.esAgenciaHabilitada(a));
          // Seleccionar por defecto todas las agencias
          this.selectedAgencyIds = this.agencias
            .map(a => a.id ?? (a as any).Id)
            .filter((id): id is number => id != null && !Number.isNaN(Number(id)));
          this.loadingAgencias = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loadingAgencias = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar agencias', 'Cerrar', { duration: 3000 });
        },
      });
  }

  get isAllAgenciesSelected(): boolean {
    const list = this.agenciasFiltradas;
    return list.length > 0 && list.every(a => this.selectedAgencyIds.includes(a.id ?? (a as any).Id));
  }

  get isSomeAgenciesSelected(): boolean {
    const list = this.agenciasFiltradas;
    const selectedInList = list.filter(a => this.selectedAgencyIds.includes(a.id ?? (a as any).Id)).length;
    return selectedInList > 0 && selectedInList < list.length;
  }

  toggleTodos(checked: boolean): void {
    const list = this.agenciasFiltradas;
    if (checked) {
      const idsToAdd = list.map(a => a.id ?? (a as any).Id).filter(id => !this.selectedAgencyIds.includes(id));
      this.selectedAgencyIds = [...this.selectedAgencyIds, ...idsToAdd];
    } else {
      const idsToRemove = list.map(a => a.id ?? (a as any).Id);
      this.selectedAgencyIds = this.selectedAgencyIds.filter(id => !idsToRemove.includes(id));
      if (this.selectedAgencyIds.length === 0) {
        this.dataSource.data = [];
        this.totalRecords = 0;
      }
    }
    this.cdr.markForCheck();
  }

  toggleAgency(agencyId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedAgencyIds.includes(agencyId)) {
        this.selectedAgencyIds = [...this.selectedAgencyIds, agencyId];
      }
    } else {
      this.selectedAgencyIds = this.selectedAgencyIds.filter(id => id !== agencyId);
      if (this.selectedAgencyIds.length === 0) {
        this.dataSource.data = [];
        this.totalRecords = 0;
      }
    }
    this.cdr.markForCheck();
  }

  /** Obtiene el ID numérico de una agencia (soporta id e Id del API) */
  getAgencyId(a: Agencia): number {
    const raw = a.id ?? (a as any).Id;
    return typeof raw === 'number' ? raw : Number(raw) || 0;
  }

  isAgencySelected(agencyId: number): boolean {
    return this.selectedAgencyIds.includes(agencyId);
  }

  get selectedAgencies(): Agencia[] {
    return this.agencias.filter(a => this.selectedAgencyIds.includes(a.id ?? (a as any).Id));
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.cargarPedidos();
  }

  onPageChange(page: number, limit: number): void {
    this.currentPage = page;
    this.pageSize = limit;
    this.cargarPedidos();
  }

  limpiarFiltros(): void {
    this.filterCompania = this.COMPANIA_TODAS;
    this.selectedAgencyIds = [];
    this.periodPreset = 'mes_actual';
    this.rangeDateGroup.setValue({
      start: new Date(this.now.getFullYear(), this.now.getMonth(), 1),
      end: new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0)
    });
    this.filterEstatus = this.ESTATUS_TODAS;
    this.dataSource.data = [];
    this.totalRecords = 0;
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  /** Devuelve el rango de release_date (inicio y fin) en formato YYYY-MM-DD según el preset o rango seleccionado. */
  private getReleaseDateRange(): { from: string; to: string } | null {
    const y = this.now.getFullYear();
    const m = this.now.getMonth();

    let start: Date;
    let end: Date;

    switch (this.periodPreset) {
      case 'mes_actual':
        start = new Date(y, m, 1);
        end = new Date(y, m + 1, 0);
        break;
      case 'mes_anterior': {
        const prev = new Date(y, m - 1);
        start = new Date(prev.getFullYear(), prev.getMonth(), 1);
        end = new Date(prev.getFullYear(), prev.getMonth() + 1, 0);
        break;
      }
      case 'ultimos_2': {
        const d = new Date(y, m - 1);
        start = new Date(d.getFullYear(), d.getMonth(), 1);
        end = new Date(y, m + 1, 0);
        break;
      }
      case 'ultimos_3': {
        const d = new Date(y, m - 2);
        start = new Date(d.getFullYear(), d.getMonth(), 1);
        end = new Date(y, m + 1, 0);
        break;
      }
      case 'este_anio':
        start = new Date(y, 0, 1);
        end = new Date(y, m + 1, 0);
        break;
      case 'rango': {
        const rangeStart = this.rangeDateGroup.value.start;
        const rangeEnd = this.rangeDateGroup.value.end;
        if (!rangeStart || !rangeEnd || rangeStart > rangeEnd) return null;
        start = rangeStart;
        end = rangeEnd;
        break;
      }
      default:
        return null;
    }

    const fmt = (d: Date) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    return { from: fmt(start), to: fmt(end) };
  }

  /** Devuelve la lista de periodos (mes, año) para etiquetas. */
  private getPeriodsToFetch(): { month: number; year: number }[] {
    const periods: { month: number; year: number }[] = [];
    const y = this.now.getFullYear();
    const m = this.now.getMonth() + 1; // 1-12

    switch (this.periodPreset) {
      case 'mes_actual':
        periods.push({ month: m, year: y });
        break;
      case 'mes_anterior': {
        const prev = new Date(y, this.now.getMonth() - 1);
        periods.push({ month: prev.getMonth() + 1, year: prev.getFullYear() });
        break;
      }
      case 'ultimos_2': {
        for (let i = 1; i >= 0; i--) {
          const d = new Date(y, this.now.getMonth() - i);
          periods.push({ month: d.getMonth() + 1, year: d.getFullYear() });
        }
        break;
      }
      case 'ultimos_3': {
        for (let i = 2; i >= 0; i--) {
          const d = new Date(y, this.now.getMonth() - i);
          periods.push({ month: d.getMonth() + 1, year: d.getFullYear() });
        }
        break;
      }
      case 'este_anio': {
        for (let i = 0; i <= this.now.getMonth(); i++) {
          const d = new Date(y, i);
          periods.push({ month: d.getMonth() + 1, year: d.getFullYear() });
        }
        break;
      }
      case 'rango': {
        const start = this.rangeDateGroup.value.start;
        const end = this.rangeDateGroup.value.end;
        if (!start || !end || start > end) break;
        const from = start.getFullYear() * 12 + start.getMonth();
        const to = end.getFullYear() * 12 + end.getMonth();
        for (let ym = from; ym <= to; ym++) {
          const year = Math.floor(ym / 12);
          const month = (ym % 12) + 1;
          periods.push({ month, year });
        }
        break;
      }
    }
    return periods;
  }

  get periodLabel(): string {
    const periods = this.getPeriodsToFetch();
    if (periods.length === 0) return 'Sin período';
    if (periods.length === 1) {
      const m = this.meses.find(x => x.value === periods[0].month);
      return `${m?.label ?? periods[0].month} ${periods[0].year}`;
    }
    const first = periods[0];
    const last = periods[periods.length - 1];
    const m1 = this.meses.find(x => x.value === first.month);
    const m2 = this.meses.find(x => x.value === last.month);
    return `${m1?.label ?? first.month}/${first.year} - ${m2?.label ?? last.month}/${last.year}`;
  }

  /** Obtiene el IdAgency DMS de una agencia (soporta IdAgency, id_agency_dms, IdAgencyDMS) */
  private getIdAgencyDms(a: Agencia): string | null {
    const v = a['IdAgency'] ?? a['id_agency_dms'] ?? a['IdAgencyDMS'];
    return v != null && String(v).trim() !== '' ? String(v).trim() : null;
  }

  cargarPedidos(): void {
    const selected = this.selectedAgencies.filter(a => this.getIdAgencyDms(a) != null);
    if (selected.length === 0) {
      this.dataSource.data = [];
      this.totalRecords = 0;
      this.cdr.markForCheck();
      if (this.selectedAgencyIds.length > 0) {
        this.snackBar.open('Las agencias seleccionadas no tienen IdAgency configurado', 'Cerrar', {
          duration: 3000,
        });
      }
      return;
    }

    this.cargarPedidosMultiAgencias(selected);
  }

  private cargarPedidosMultiAgencias(selected: Agencia[]): void {
    const idAgencies = selected
      .filter(a => this.getIdAgencyDms(a) != null)
      .map(a => this.getIdAgencyDms(a)!);
    if (idAgencies.length === 0) {
      this.snackBar.open('No hay agencias con IdAgency configurado', 'Cerrar', { duration: 3000 });
      return;
    }
    const range = this.getReleaseDateRange();
    if (!range) {
      this.snackBar.open('Seleccione un rango de fechas válido', 'Cerrar', { duration: 3000 });
      return;
    }
    const agencyNames: Record<string, string> = {};
    selected.forEach(a => {
      const id = this.getIdAgencyDms(a);
      if (id) agencyNames[id] = (a as any).name ?? (a as any).Name ?? '';
    });

    this.loading = true;
    this.cdr.markForCheck();
    this.consolidacionDmsService
      .getPedidosPaginados(
        idAgencies,
        range.from,
        range.to,
        this.currentPage,
        this.pageSize,
        agencyNames,
        this.filterEstatus
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data, total, page, limit }) => {
          this.loading = false;
          this.dataSource.data = data || [];
          this.totalRecords = total;
          this.currentPage = page;
          this.pageSize = limit;
          this.cdr.markForCheck();
          this.snackBar.open(`${total} pedidos (pág. ${page})`, 'Cerrar', { duration: 2000 });
        },
        error: () => {
          this.loading = false;
          this.dataSource.data = [];
          this.totalRecords = 0;
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar pedidos del DMS', 'Cerrar', { duration: 3000 });
        },
      });
  }

  /**
   * Obtener el nombre de visualización de una columna
   */
  getColumnDisplayName(columnName: string): string {
    return this.columnDisplayNames[columnName] || columnName;
  }

  /**
   * Clases CSS para la columna state (fondo y texto como en Validación).
   * Para otras columnas retorna cadena vacía.
   */
  getStateCellClass(row: PedidoDms, col: string): string {
    if (col !== 'state') return '';
    const label = this.cellValue(row, col);
    const stateClasses: { [key: string]: string } = {
      'Integración': 'bg-green-100 text-green-800',
      'Liquidación': 'bg-blue-100 text-blue-800',
      'Liberación': 'bg-purple-100 text-purple-800',
      'Liberado': 'bg-indigo-100 text-indigo-800',
      'Cancelado': 'bg-red-100 text-red-800',
      'Liberado por Excepción': 'bg-amber-100 text-amber-800',
      'Sin Integrar': 'bg-gray-100 text-gray-800',
    };
    const base = 'rounded px-2 py-0.5 text-xs font-medium ';
    return base + (stateClasses[label] ?? 'bg-gray-100 text-gray-800');
  }

  cellValue(row: PedidoDms, col: string): string {
    if (col === 'agency_name') {
      return String(row['agency_name'] ?? row['agencyName'] ?? row['id_agency'] ?? '');
    }
    const v = row[col];
    if (col === 'state') {
      if (v == null || v === '') return 'Sin Integrar';
      const num = typeof v === 'number' ? v : parseInt(String(v), 10);
      if (Number.isNaN(num)) return 'Sin Integrar';
      return this.stateLabels[num] ?? 'Sin Integrar';
    }
    if ((col === 'release_date' || col === 'delivery_date') && v != null) {
      const s = String(v);
      if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
      return s;
    }
    if (col === 'tipo_cliente' && v != null) {
      const s = String(v).toLowerCase();
      if (s === 'fisica') return 'Persona Física';
      if (s === 'moral') return 'Persona Moral';
      return String(v);
    }
    if (v == null) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }

  exportarExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.snackBar.open('No hay datos para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.displayedColumns.length === 0) {
      this.snackBar.open('No hay columnas para exportar', 'Cerrar', { duration: 3000 });
      return;
    }

    this.exportingExcel = true;
    this.cdr.markForCheck();

    try {
      const headers = this.displayedColumns.map(col => this.getColumnDisplayName(col));
      const rows = this.dataSource.data.map(row =>
        this.displayedColumns.map(col => {
          const value = this.cellValue(row, col);
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
      );

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

      let nombreAgencia = 'consolidacion_dms';
      const sel = this.selectedAgencies;
      if (sel.length > 1) {
        nombreAgencia = 'consolidacion_dms_multi_agencias';
      } else if (sel.length === 1 && sel[0]['Name']) {
        nombreAgencia = String(sel[0]['Name']).replace(/[^a-zA-Z0-9]/g, '_');
      }
      const fechaDescarga = new Date().toISOString().split('T')[0];
      const nombreArchivo = `consolidacion_dms_${nombreAgencia}_${fechaDescarga}.csv`;

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
    } finally {
      this.exportingExcel = false;
      this.cdr.markForCheck();
    }
  }
}
