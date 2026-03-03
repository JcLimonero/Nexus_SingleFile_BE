import { Component, Inject, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { ClientesMesaService, DocumentoLiquidacion, ExpedienteCliente } from '../../../../core/services/clientes-mesa.service';
import { ApiConfigService } from '../../../../core/services/api-config.service';
import { ValidacionService } from '../../validacion/validacion.service';
import { environment } from '../../../../../environments/environment';

export interface ClienteDetalleDialogData {
  idHeaderClient?: number;
  idClientHeader?: number;
  cliente: string;
  ndCliente: string;
}

interface GrupoExpedientes {
  compania: string;
  agencia: string;
  idAgency: number;
  expedientes: ExpedienteCliente[];
  dataSource: MatTableDataSource<ExpedienteCliente>;
}

@Component({
  selector: 'app-cliente-detalle-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './cliente-detalle-dialog.component.html',
  styleUrl: './cliente-detalle-dialog.component.scss'
})
export class ClienteDetalleDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  grupos: GrupoExpedientes[] = [];
  displayedColumns = ['expand', 'ndPedido', 'proceso', 'operacion', 'tipoCliente', 'estatus', 'monto', 'registro', 'acciones'];
  docsLiquidacionColumns = ['documento', 'monto', 'tipoPago', 'fechaPago', 'ver'];
  readonly pageSizeOptions = [5, 10, 25];

  /** Resumen: suma de operaciones en los últimos 6 meses */
  resumenUltimos6Meses: { totalMonto: number; cantidadOperaciones: number } = { totalMonto: 0, cantidadOperaciones: 0 };

  /** Monto en efectivo (id_payment_method=1) en los últimos 6 meses */
  montoEfectivo6Meses = 0;

  /** Monto total en todo el tiempo, sin importar tipo de pago */
  montoTotalTodoTiempo = 0;

  /** Fila expandida (por idFile para soportar múltiples tablas) */
  expandedElement: ExpedienteCliente | null = null;

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;

  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ClienteDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteDetalleDialogData,
    private clientesService: ClientesMesaService,
    private validacionService: ValidacionService,
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idHeaderClient = this.data?.idHeaderClient ?? this.data?.idClientHeader;
    if (idHeaderClient == null || idHeaderClient === undefined) {
      this.loading = false;
      return;
    }
    this.clientesService.getExpedientes(idHeaderClient).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data?.expedientes) {
          this.grupos = this.agruparPorCompaniaAgencia(res.data.expedientes);
          this.calcularResumenUltimos6Meses(res.data.expedientes);
          setTimeout(() => this.asignarPaginators());
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private calcularResumenUltimos6Meses(expedientes: ExpedienteCliente[]): void {
    const hace6Meses = new Date();
    hace6Meses.setMonth(hace6Meses.getMonth() - 6);
    hace6Meses.setHours(0, 0, 0, 0);

    const enUltimos6Meses = expedientes.filter((exp) => {
      if (!exp.registro) return false;
      const fechaRegistro = new Date(exp.registro);
      return fechaRegistro >= hace6Meses;
    });

    // Todo desde liquidation_receipt_detail (documentosLiquidacion) para detectar discrepancias
    const totalMonto = enUltimos6Meses.reduce((sum, exp) => {
      const docs = exp.documentosLiquidacion ?? [];
      return sum + docs.reduce((s, d) => s + (Number(d.monto) || 0), 0);
    }, 0);
    this.resumenUltimos6Meses = {
      totalMonto,
      cantidadOperaciones: enUltimos6Meses.length
    };

    // Monto en efectivo (id_payment_method=1) en últimos 6 meses
    this.montoEfectivo6Meses = enUltimos6Meses.reduce((sum, exp) => {
      const docs = exp.documentosLiquidacion ?? [];
      return sum + docs
        .filter((d) => d.idPaymentMethod === 1)
        .reduce((s, d) => s + (Number(d.monto) || 0), 0);
    }, 0);

    // Monto total en todo el tiempo (suma de liquidation_receipt_detail, todos los tipos de pago)
    this.montoTotalTodoTiempo = expedientes.reduce((sum, exp) => {
      const docs = exp.documentosLiquidacion ?? [];
      return sum + docs.reduce((s, d) => s + (Number(d.monto) || 0), 0);
    }, 0);
  }

  private agruparPorCompaniaAgencia(expedientes: ExpedienteCliente[]): GrupoExpedientes[] {
    const map = new Map<string, GrupoExpedientes>();
    for (const exp of expedientes) {
      const key = `${exp.compania ?? 'Sin razón social'}|${exp.agencia}|${exp.idAgency}`;
      if (!map.has(key)) {
        const ds = new MatTableDataSource<ExpedienteCliente>([]);
        map.set(key, {
          compania: exp.compania ?? 'Sin razón social',
          agencia: exp.agencia,
          idAgency: exp.idAgency,
          expedientes: [],
          dataSource: ds
        });
      }
      const g = map.get(key)!;
      g.expedientes.push(exp);
    }
    const sorted = Array.from(map.values()).sort((a, b) => {
      const c = a.compania.localeCompare(b.compania);
      return c !== 0 ? c : a.agencia.localeCompare(b.agencia);
    });
    sorted.forEach(g => {
      g.dataSource.data = g.expedientes;
    });
    return sorted;
  }

  ngAfterViewInit(): void {
    this.asignarPaginators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private asignarPaginators(): void {
    if (this.paginators?.length && this.grupos.length) {
      this.paginators.forEach((paginator, i) => {
        if (this.grupos[i]) {
          this.grupos[i].dataSource.paginator = paginator;
        }
      });
    }
  }

  formatDate(val: string | null): string {
    if (!val) return '—';
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d.toLocaleDateString('es-MX');
    } catch {
      return val;
    }
  }

  formatMonto(val: number | null | undefined): string {
    if (val == null || isNaN(val)) return '—';
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onCompartirWhatsApp(exp: ExpedienteCliente): void {
    this.validacionService.generarTokenMiniportal(exp.idFile).subscribe({
      next: (data) => {
        window.open(data.url, '_blank', 'noopener,noreferrer');
        this.snackBar.open('Enlace abierto en nueva ventana', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err?.message || 'Error al generar enlace', 'Cerrar', { duration: 5000 });
      }
    });
  }

  getDocumentosLiquidacion(row: ExpedienteCliente): DocumentoLiquidacion[] {
    return row.documentosLiquidacion ?? [];
  }

  toggleExpanded(row: ExpedienteCliente): void {
    this.expandedElement = this.expandedElement?.idFile === row.idFile ? null : row;
  }

  isExpanded(row: ExpedienteCliente): boolean {
    return this.expandedElement?.idFile === row.idFile;
  }

  hasDocumentosLiquidacion(row: ExpedienteCliente): boolean {
    return (row.documentosLiquidacion?.length ?? 0) > 0;
  }

  onVerDocumentoLiquidacion(doc: DocumentoLiquidacion): void {
    if (!doc.documentContainer) {
      this.snackBar.open('No hay archivo asociado para visualizar', 'Cerrar', { duration: 3000 });
      return;
    }
    const params = new URLSearchParams();
    params.append('file', doc.documentContainer);
    params.append('duration', '3600');
    params.append('baseUrl', environment.apiBaseUrl);
    const url = `${this.apiConfig.getUploadApiBaseUrl()}/get-private-url?${params.toString()}`;
    this.http.get<{ data?: { url?: string } }>(url).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        const privateUrl = res?.data?.url;
        if (privateUrl) {
          const w = window.open(privateUrl, '_blank');
          if (!w) this.snackBar.open('No se pudo abrir el documento', 'Cerrar', { duration: 3000 });
        } else {
          this.snackBar.open('No se pudo obtener la URL del documento', 'Cerrar', { duration: 3000 });
        }
      },
      error: () => this.snackBar.open('Error al obtener la URL del documento', 'Cerrar', { duration: 3000 })
    });
  }
}
