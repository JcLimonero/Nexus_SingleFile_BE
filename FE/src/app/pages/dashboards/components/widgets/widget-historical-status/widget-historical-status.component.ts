import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import {
  ApexOptions,
  VexChartComponent
} from '@vex/components/vex-chart/vex-chart.component';
import { defaultChartOptions } from '@vex/utils/default-chart-options';

export interface HistoricalStatusData {
  statusName: string;
  totalCases: number;
  percentage: number;
}

@Component({
  selector: 'vex-widget-historical-status',
  templateUrl: './widget-historical-status.component.html',
  styleUrls: ['./widget-historical-status.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VexChartComponent
  ]
})
export class WidgetHistoricalStatusComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  series: any[] = [];
  labels: string[] = [];
  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'bar',
      height: 350,
      sparkline: {
        enabled: false
      }
    },
    colors: [
      '#10b981', // Verde para entregados
      '#3b82f6', // Azul para en proceso
      '#ef4444', // Rojo para cancelados
      '#f59e0b', // Amarillo para otros estados
      '#8b5cf6', // Púrpura para estados adicionales
      '#06b6d4', // Cian para más estados
      '#84cc16', // Lima para estados adicionales
      '#f97316'  // Naranja para más estados
    ],
    fill: {
      type: 'solid',
      opacity: 0.8
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '60%',
        distributed: false
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts: any) {
        const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
        const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
        return `${val} (${percentage}%)`;
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#ffffff']
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      },
      fillSeriesColor: false,
      theme: 'light',
      y: {
        formatter: function (val: number, opts: any) {
          const seriesName = opts.w.config.xaxis.categories[opts.dataPointIndex];
          const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
          return `${seriesName}: ${val} expedientes (${percentage}%)`;
        }
      }
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          }
        }
      }
    ]
  });

  loading = true;
  error: string | null = null;
  historicalStatusData: HistoricalStatusData[] = [];
  totalCases = 0;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadHistoricalStatusData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('📊 HistoricalStatus ngOnChanges called with changes:', changes);
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
      console.log('📊 HistoricalStatus: Agency or User changed, triggering data reload');
      console.log('📊 HistoricalStatus: Current agencyId:', this.agencyId);
      console.log('📊 HistoricalStatus: Current userId:', this.userId);
      this.loadHistoricalStatusData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadHistoricalStatusData(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      agency_id: this.agencyId,
      idSeller: this.userId
    };

    console.log('📊 HistoricalStatus: Loading historical status data with filters:', filters);

    this.analyticsService.getHistoricalStatusDistribution(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('📊 HistoricalStatus: Received data:', data);
          this.historicalStatusData = data;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          console.error('📊 HistoricalStatus: Error loading historical status data:', error);
          this.error = 'Error al cargar datos históricos por estatus';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.historicalStatusData = [];
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (this.historicalStatusData.length === 0) {
      this.series = [];
      this.labels = [];
      this.options = {
        ...this.options,
        xaxis: {
          ...this.options.xaxis,
          categories: []
        }
      };
      this.totalCases = 0;
      return;
    }

    // Preparar datos para el chart de barras horizontales
    this.labels = this.historicalStatusData.map(item => item.statusName);
    const data = this.historicalStatusData.map(item => item.totalCases);
    this.totalCases = data.reduce((total, cases) => total + cases, 0);

    // Crear series con colores específicos para cada barra
    const seriesData = data.map((value, index) => ({
      x: this.labels[index],
      y: value,
      fillColor: this.getStatusColor(this.labels[index])
    }));

    this.series = [{
      name: 'Expedientes',
      data: seriesData
    }];

    this.options = {
      ...this.options,
      xaxis: {
        ...this.options.xaxis,
        categories: this.labels
      }
    };
  }

  refresh(): void {
    this.loadHistoricalStatusData();
  }

  getStatusColor(statusName: string): string {
    const colorMap: { [key: string]: string } = {
      'Entregado': '#10b981',
      'En Proceso': '#3b82f6',
      'Cancelado': '#ef4444',
      'Pendiente': '#f59e0b',
      'Rechazado': '#ef4444',
      'Completado': '#10b981',
      'Liberado': '#10b981',
      'Liberación': '#3b82f6',
      'Integración': '#f59e0b',
      'Liquidación': '#8b5cf6',
      'Liberado por Excepción': '#06b6d4'
    };
    return colorMap[statusName] || '#6b7280';
  }
}
