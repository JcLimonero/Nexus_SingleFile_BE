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

export interface DistributionMetrics {
  entregados: {
    total: number;
    porcentaje: number;
  };
  canceladas: {
    total: number;
    porcentaje: number;
  };
  proceso: {
    total: number;
    porcentaje: number;
  };
  total: number;
  month: string;
  year: string;
  agency_id: number | null;
}

@Component({
  selector: 'vex-widget-distribution-metrics-donut',
  templateUrl: './widget-distribution-metrics-donut.component.html',
  styleUrls: ['./widget-distribution-metrics-donut.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VexChartComponent
  ]
})
export class WidgetDistributionMetricsDonutComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() showDetails = true;

  series: any[] = [];
  labels: string[] = [];
  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'donut',
      height: 220,
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: [
      '#10b981', // Entregados - verde (igual que Análisis temporal)
      '#ef4444', // Cancelados - rojo
      '#3b82f6'  // En Proceso - azul
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '85%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#2B2B2B',
              offsetY: -6
            },
            value: {
              show: true,
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#2B2B2B',
              offsetY: 6,
              formatter: function (val: string) {
                return val;
              }
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#868C92',
              formatter: (w: any) => {
                const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return sum;
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff']
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `${val} expedientes`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 200
          }
        }
      }
    ]
  });

  distributionMetrics: DistributionMetrics | null = null;
  loading = true;
  error: string | null = null;
  totalCases = 0;

  /** Index of the legend item currently hovered, or null if none. */
  hoveredIndex: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadDistributionMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      this.loadDistributionMetrics();
    }
  }

  private loadDistributionMetrics(): void {
    this.loading = true;
    this.error = null;

    const filters: any = {
      agency_id: this.agencyId
    };


    this.analyticsService.getDistributionMetrics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          this.distributionMetrics = metrics;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar métricas de distribución';
          this.loading = false;

          // Datos de prueba para mostrar el gráfico
          this.distributionMetrics = {
            entregados: { total: 5, porcentaje: 50 },
            canceladas: { total: 2, porcentaje: 20 },
            proceso: { total: 3, porcentaje: 30 },
            total: 10,
            month: 'Septiembre',
            year: '2025',
            agency_id: this.agencyId
          };
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (!this.distributionMetrics) {
      this.series = [];
      this.labels = [];
      this.totalCases = 0;
      return;
    }

    // Preparar datos para el chart (donut: array de valores)
    this.labels = ['Entregados', 'Cancelados', 'En Proceso'];
    const data = [
      this.distributionMetrics.entregados.total,
      this.distributionMetrics.canceladas.total,
      this.distributionMetrics.proceso.total
    ].map((v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0));
    this.series = data;
    this.totalCases = this.distributionMetrics.total;
  }

  refresh(): void {
    this.loadDistributionMetrics();
  }

  /** Called when a legend item is hovered or unhovered. */
  onLegendHover(index: number | null): void {
    this.hoveredIndex = index;
  }

  getStatusCount(): number {
    return this.labels.length;
  }

  getStatusColor(statusName: string): string {
    const colorMap: { [key: string]: string } = {
      'Entregados': '#10b981',
      'Cancelados': '#ef4444',
      'En Proceso': '#3b82f6'
    };
    return colorMap[statusName] || '#6b7280';
  }
}
