import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService } from '../../../../../../core/services/analytics.service';

export interface AttentionPeriodDialogData {
  range: string;
  label: string;
  count: number;
  color: string;
  agencyId: number | null;
  userId: number | null;
  currentMonth?: boolean;
  liberatedOnly?: boolean; // ← NUEVO PARÁMETRO PARA PEDIDOS LIBERADOS
}

export interface OrderByPeriod {
  idFile: number;
  ndCliente: number;
  ndPedido: number;
  cliente: string;
  proceso: string;
  operacion: string;
  fase: string;
  fechaAtencion: string;
  fechaCierre: string;
  diasAtencion: number;
  estado: string;
}

@Component({
  selector: 'vex-attention-period-dialog',
  templateUrl: './attention-period-dialog.component.html',
  styleUrls: ['./attention-period-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule
  ]
})
export class AttentionPeriodDialogComponent implements OnInit {
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'ndCliente', 
    'ndPedido', 
    'cliente', 
    'proceso', 
    'operacion', 
    'fase', 
    'fechaAtencion', 
    'fechaCierre', 
    'diasAtencion', 
    'estado'
  ];

  orders: OrderByPeriod[] = [];
  loading = false;
  error: string | null = null;
  totalOrders = 0;

  constructor(
    public dialogRef: MatDialogRef<AttentionPeriodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AttentionPeriodDialogData,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getOrdersByAttentionPeriod(
      this.data.range,
      this.data.agencyId?.toString(),
      this.data.userId?.toString(),
      this.data.currentMonth,
      this.data.liberatedOnly // ← Pasar el parámetro liberatedOnly
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (orders: OrderByPeriod[]) => {
        this.orders = orders;
        this.totalOrders = orders.length;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders by attention period:', error);
        this.error = 'Error al cargar los pedidos del período seleccionado';
        this.orders = [];
        this.totalOrders = 0;
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'aprobado':
      case 'entregado':
        return 'primary';
      case 'pendiente':
        return 'accent';
      case 'rechazado':
      case 'cancelado':
        return 'warn';
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX');
  }
}
