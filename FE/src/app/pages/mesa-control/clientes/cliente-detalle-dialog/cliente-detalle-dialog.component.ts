import { Component, Inject, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClientesMesaService, ExpedienteCliente } from '../../../../core/services/clientes-mesa.service';
import { ValidacionService } from '../../validacion/validacion.service';

export interface ClienteDetalleDialogData {
  idHeaderClient: number;
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
export class ClienteDetalleDialogComponent implements OnInit, AfterViewInit {
  loading = true;
  grupos: GrupoExpedientes[] = [];
  displayedColumns = ['ndPedido', 'proceso', 'operacion', 'tipoCliente', 'estatus', 'monto', 'registro', 'acciones'];
  readonly pageSizeOptions = [5, 10, 25];

  @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;

  constructor(
    public dialogRef: MatDialogRef<ClienteDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteDetalleDialogData,
    private clientesService: ClientesMesaService,
    private validacionService: ValidacionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clientesService.getExpedientes(this.data.idHeaderClient).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data?.expedientes) {
          this.grupos = this.agruparPorCompaniaAgencia(res.data.expedientes);
          setTimeout(() => this.asignarPaginators());
        }
      },
      error: () => {
        this.loading = false;
      }
    });
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
}
