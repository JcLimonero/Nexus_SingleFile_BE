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

  // Filtros adicionales (se aplican sobre los datos ya cargados)
  filterEstatus: number | null = null;
  private fullData: PedidoDms[] = [];

  estatusOptions: { value: number | null; label: string }[] = [
    { value: null, label: 'Todos' },
    { value: 0, label: 'Sin Integrar' },
    { value: 1, label: 'Integración' },
    { value: 2, label: 'Liquidación' },
    { value: 3, label: 'Liberación' },
    { value: 4, label: 'Liberado' },
    { value: 5, label: 'Cancelado' },
    { value: 6, label: 'Liberado por Excepción' },
  ];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<PedidoDms>([]);

  pageSizeOptions = [10, 25, 50, 100];
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

  // Mapeo de nombres de columnas originales a nombres de visualización
  private columnDisplayNames: { [key: string]: string } = {
    'order_dms': 'ND Pedido',
    'orderDMS': 'ND Pedido',
    'OrderDMS': 'ND Pedido',
    'state': 'Estatus',
    'State': 'Estatus',
    'vin': 'VIN',
    'Vin': 'VIN',
    'VIN': 'VIN',
    'invoice_reference': 'Factura',
    'invoiceReference': 'Factura',
    'InvoiceReference': 'Factura',
    'delivery_date': 'Fecha Liberación',
    'deliveryDate': 'Fecha Liberación',
    'DeliveryDate': 'Fecha Liberación',
    'timestamp_dms': 'Fecha DMS',
    'timestampDMS': 'Fecha DMS',
    'TimestampDMS': 'Fecha DMS',
    'agencyName': 'Agencia',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private defaultAgencyService: DefaultAgencyService,
    private consolidacionDmsService: ConsolidacionDmsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Años disponibles: actual y 5 años atrás
    const currentYear = this.now.getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
      this.anios.push(y);
    }
    this.cargarAgencias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarAgencias(): void {
    this.loadingAgencias = true;
    this.cdr.markForCheck();
    this.defaultAgencyService
      .obtenerAgencias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (lista) => {
          this.agencias = (lista || []).filter((a) => this.defaultAgencyService.esAgenciaHabilitada(a));
          // Seleccionar por defecto la agencia guardada en localStorage
          const savedAgencyId = this.defaultAgencyService.getAgenciaSeleccionada();
          if (savedAgencyId !== null && this.agencias.some(ag => ag.Id === savedAgencyId)) {
            this.selectedAgencyIds = [savedAgencyId];
          }
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
    return this.agencias.length > 0 && this.selectedAgencyIds.length === this.agencias.length;
  }

  get isSomeAgenciesSelected(): boolean {
    return this.selectedAgencyIds.length > 0 && this.selectedAgencyIds.length < this.agencias.length;
  }

  toggleTodos(checked: boolean): void {
    if (checked) {
      this.selectedAgencyIds = this.agencias.map(a => a.Id);
    } else {
      this.selectedAgencyIds = [];
      this.dataSource.data = [];
      this.displayedColumns = [];
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
        this.displayedColumns = [];
      }
    }
    this.cdr.markForCheck();
  }

  isAgencySelected(agencyId: number): boolean {
    return this.selectedAgencyIds.includes(agencyId);
  }

  get selectedAgencies(): Agencia[] {
    return this.agencias.filter(a => this.selectedAgencyIds.includes(a.Id));
  }

  aplicarFiltros(): void {
    let filtered = [...this.fullData];
    if (this.filterEstatus != null) {
      if (this.filterEstatus === 0) {
        // Sin Integrar: state null, vacío, 0 o NaN
        filtered = filtered.filter(row => {
          const v = row['state'] ?? row['State'];
          if (v == null || v === '') return true;
          const num = typeof v === 'number' ? v : parseInt(String(v), 10);
          return Number.isNaN(num) || num === 0;
        });
      } else {
        filtered = filtered.filter(row => {
          const v = row['state'] ?? row['State'];
          const num = typeof v === 'number' ? v : parseInt(String(v), 10);
          return !Number.isNaN(num) && num === this.filterEstatus;
        });
      }
    }
    this.dataSource.data = filtered;
    if (filtered.length > 0 && this.displayedColumns.length === 0) {
      this.displayedColumns = this.buildColumns(filtered[0], true);
    } else if (filtered.length === 0) {
      this.displayedColumns = this.fullData.length > 0 ? this.buildColumns(this.fullData[0], true) : [];
    }
    this.cdr.markForCheck();
  }

  onFilterChange(): void {
    this.aplicarFiltros();
  }

  /** Devuelve la lista de periodos (mes, año) a consultar según el preset o rango seleccionado. */
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

  cargarPedidos(): void {
    const selected = this.selectedAgencies.filter(a => a['IdAgency']);
    if (selected.length === 0) {
      this.dataSource.data = [];
      this.displayedColumns = [];
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
    const agenciesWithId = selected
      .filter(a => a['IdAgency'])
      .map(a => ({ idAgency: a['IdAgency'], name: a.Name || '' }));
    if (agenciesWithId.length === 0) {
      this.snackBar.open('No hay agencias con IdAgency configurado', 'Cerrar', { duration: 3000 });
      return;
    }
    this.loading = true;
    this.cdr.markForCheck();
    const periods = this.getPeriodsToFetch();
    if (periods.length === 0) {
      this.snackBar.open('Seleccione un rango de fechas válido', 'Cerrar', { duration: 3000 });
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }
    this.consolidacionDmsService
      .getPedidosDmsMultiAgenciasForPeriods(agenciesWithId, periods)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.loading = false;
          this.fullData = data || [];
          this.aplicarFiltros();
          if (this.displayedColumns.length === 0 && this.fullData.length > 0) {
            this.displayedColumns = this.buildColumns(this.fullData[0], true);
          }
          this.dataSource.paginator = this.paginator;
          this.cdr.markForCheck();
          this.snackBar.open(`${this.fullData.length} pedidos del DMS (${selected.length} agencias)`, 'Cerrar', {
            duration: 2000,
          });
        },
        error: () => {
          this.loading = false;
          this.dataSource.data = [];
          this.displayedColumns = [];
          this.cdr.markForCheck();
          this.snackBar.open('Error al cargar pedidos del DMS', 'Cerrar', { duration: 3000 });
        },
      });
  }

  private buildColumns(row: PedidoDms, includeAgencyColumn: boolean): string[] {
    // Columnas preferidas en orden específico
    const preferred = [
      ...(includeAgencyColumn ? ['agencyName'] as const : []),
      'order_dms',
      'orderDMS',
      'OrderDMS',
      'state',
      'State',
      'vin',
      'Vin',
      'VIN',
      'invoice_reference',
      'invoiceReference',
      'InvoiceReference',
      'delivery_date',
      'deliveryDate',
      'DeliveryDate',
      'timestamp_dms',
      'timestampDMS',
      'TimestampDMS',
    ];
    const keys = Object.keys(row);
    const ordered: string[] = [];
    
    // Agregar columnas preferidas primero
    for (const k of preferred) {
      if (keys.includes(k)) ordered.push(k);
    }
    
    // Agregar el resto de columnas
    for (const k of keys) {
      if (!ordered.includes(k)) ordered.push(k);
    }
    
    // Filtrar columnas que no queremos mostrar
    const excludedColumns = [
      'idAgency', 'IdAgency', 'idagency', 'IDAgency',
      ...(includeAgencyColumn ? [] : ['agencyName']),
      'delivery_month', 'delivery_year',
      'timestamp_dms_month', 'timestamp_dms_year',
    ];
    return ordered.filter(col => !excludedColumns.includes(col));
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
    if (col !== 'state' && col !== 'State') return '';
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
    const v = row[col];
    // Columna state: traducir número a etiqueta
    if (col === 'state' || col === 'State') {
      if (v == null || v === '') return 'Sin Integrar';
      const num = typeof v === 'number' ? v : parseInt(String(v), 10);
      if (Number.isNaN(num)) return 'Sin Integrar';
      return this.stateLabels[num] ?? 'Sin Integrar';
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
