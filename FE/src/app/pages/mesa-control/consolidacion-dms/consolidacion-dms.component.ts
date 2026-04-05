import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DefaultAgencyService, Agencia } from '../../../core/services/default-agency.service';
import {
  ConsolidacionDmsService,
  PedidoDms,
  BulkStatusRow,
  BulkStatusMode,
} from './consolidacion-dms.service';

@Component({
  selector: 'vex-consolidacion-dms',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    MatTabsModule,
    MatButtonToggleModule,
    MatInputModule,
    MatCheckboxModule,
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
  selectedAgencyId: number | null = null;

  // Filtro mes/año (default: mes actual)
  private now = new Date();
  selectedMonth: number = this.now.getMonth() + 1; // 1-12
  selectedYear: number = this.now.getFullYear();

  meses: { value: number; label: string }[] = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' }
  ];
  anios: number[] = [];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<PedidoDms>([]);

  pageSizeOptions = [10, 25, 50, 100];
  exportingExcel = false;

  /** Tab consulta masiva */
  bulkMode: BulkStatusMode = 'vin';
  bulkText = '';
  bulkLoading = false;
  bulkRows: BulkStatusRow[] = [];
  bulkNotFound: string[] = [];
  /** Si está activo y hay agencia, se envía agencyId al API */
  bulkRestrictAgency = true;
  bulkColumns: string[] = ['IdOrderTotal', 'VIN', 'Name', 'UpdateDate'];
  bulkExporting = false;

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
    'delivery_date': 'Fecha Liberación DMS',
    'deliveryDate': 'Fecha Liberación DMS',
    'DeliveryDate': 'Fecha Liberación DMS',
    'timestamp_dms': 'Fecha Liberacion Expediente Unico',
    'timestampDMS': 'Fecha Liberacion Expediente Unico',
    'TimestampDMS': 'Fecha Liberacion Expediente Unico',
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
            this.selectedAgencyId = savedAgencyId;
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

  onAgenciaChange(): void {
    this.cargarPedidos();
  }

  get selectedAgency(): Agencia | undefined {
    if (this.selectedAgencyId == null) return undefined;
    return this.agencias.find((a) => a.Id === this.selectedAgencyId);
  }

  cargarPedidos(): void {
    const agencia = this.selectedAgency;
    if (!agencia || !agencia['IdAgency']) {
      this.dataSource.data = [];
      this.displayedColumns = [];
      this.cdr.markForCheck();
      if (this.selectedAgencyId != null) {
        this.snackBar.open('La agencia seleccionada no tiene IdAgency configurado', 'Cerrar', {
          duration: 3000,
        });
      }
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();
    this.consolidacionDmsService
      .getPedidosDms(agencia['IdAgency'], this.selectedMonth, this.selectedYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.loading = false;
          this.dataSource.data = data || [];
          if (this.dataSource.data.length > 0) {
            this.displayedColumns = this.buildColumns(this.dataSource.data[0]);
          } else {
            this.displayedColumns = [];
          }
          this.dataSource.paginator = this.paginator;
          this.cdr.markForCheck();
          this.snackBar.open(`${this.dataSource.data.length} pedidos del DMS`, 'Cerrar', {
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

  private buildColumns(row: PedidoDms): string[] {
    // Columnas preferidas en orden específico
    const preferred = [
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

  parseBulkLines(text: string): string[] {
    const parts = text.split(/[\n,;\t]+/);
    const out: string[] = [];
    const seen = new Set<string>();
    for (const p of parts) {
      const s = p.trim();
      if (!s) continue;
      const value = this.bulkMode === 'vin' ? s.toUpperCase() : s;
      if (seen.has(value)) continue;
      seen.add(value);
      out.push(value);
    }
    return out;
  }

  consultarBulk(): void {
    const items = this.parseBulkLines(this.bulkText);
    if (items.length === 0) {
      this.snackBar.open('Pegue al menos un VIN o número de pedido', 'Cerrar', { duration: 3000 });
      return;
    }
    if (items.length > 500) {
      this.snackBar.open('Máximo 500 valores por consulta', 'Cerrar', { duration: 4000 });
      return;
    }

    const agencyId =
      this.bulkRestrictAgency && this.selectedAgencyId != null ? this.selectedAgencyId : null;

    this.bulkLoading = true;
    this.bulkRows = [];
    this.bulkNotFound = [];
    this.cdr.markForCheck();

    this.consolidacionDmsService
      .postBulkStatus(this.bulkMode, items, agencyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.bulkLoading = false;
          if (res.success && res.data) {
            this.bulkRows = res.data.rows || [];
            this.bulkNotFound = res.data.notFound || [];
            this.snackBar.open(
              `${this.bulkRows.length} expediente(s) encontrado(s)${
                this.bulkNotFound.length ? `, ${this.bulkNotFound.length} sin coincidencia` : ''
              }`,
              'Cerrar',
              { duration: 3500 }
            );
          } else {
            this.snackBar.open(res.message || 'Error en la consulta', 'Cerrar', { duration: 4000 });
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.bulkLoading = false;
          this.cdr.markForCheck();
          this.snackBar.open('Error al consultar estatus', 'Cerrar', { duration: 3000 });
        },
      });
  }

  exportarBulkCsv(): void {
    if (this.bulkRows.length === 0) {
      this.snackBar.open('No hay resultados para exportar', 'Cerrar', { duration: 3000 });
      return;
    }
    this.bulkExporting = true;
    this.cdr.markForCheck();
    try {
      const headers = ['ND Pedido (IdOrderTotal)', 'VIN', 'Estatus', 'Fecha actualización'];
      const rows = this.bulkRows.map((r) => [
        this.cellBulk(r, 'IdOrderTotal'),
        this.cellBulk(r, 'VIN'),
        this.cellBulk(r, 'Name'),
        this.cellBulk(r, 'UpdateDate'),
      ]);
      const esc = (v: string) =>
        v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
      const csvContent = [headers.join(','), ...rows.map((row) => row.map(esc).join(','))].join('\n');
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      const nombreArchivo = `consulta_masiva_${new Date().toISOString().split('T')[0]}.csv`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('CSV descargado', 'Cerrar', { duration: 2000 });
    } finally {
      this.bulkExporting = false;
      this.cdr.markForCheck();
    }
  }

  cellBulk(row: BulkStatusRow, col: keyof BulkStatusRow): string {
    const v = row[col];
    if (v == null) return '';
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
      const agencia = this.selectedAgency;
      if (agencia && agencia['Name']) {
        nombreAgencia = String(agencia['Name']).replace(/[^a-zA-Z0-9]/g, '_');
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
