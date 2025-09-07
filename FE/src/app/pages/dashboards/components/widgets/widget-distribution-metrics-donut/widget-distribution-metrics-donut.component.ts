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

  series: number[] = [];
  labels: string[] = [];
  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'donut',
      height: 300,
      sparkline: {
        enabled: false
      }
    },
    colors: [
      '#10b981', // Verde para entregados
      '#ef4444', // Rojo para cancelados
      '#3b82f6'  // Azul para en proceso
    ],
    labels: ['Entregados', 'Cancelados', 'En Proceso'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: '#111827',
              offsetY: 16,
              formatter: function (val: string) {
                return val + ' expedientes';
              }
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total Mes Actual',
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total + ' expedientes';
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: string, opts: any) {
        return opts.w.config.series[opts.seriesIndex] + ' (' + val + '%)';
      },
      style: {
        fontSize: '12px',
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
          const seriesName = opts.w.config.labels[opts.seriesIndex];
          const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
          return `${seriesName}: ${val} expedientes (${percentage}%)`;
        }
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  });

  distributionMetrics: DistributionMetrics | null = null;
  loading = true;
  error: string | null = null;
  totalCases = 0;

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
    console.log('📊 DistributionMetricsDonut ngOnChanges called with changes:', changes);
    if (changes['agencyId'] && !changes['agencyId'].firstChange) {
      console.log('📊 DistributionMetricsDonut: Agency changed, triggering data reload');
      console.log('📊 DistributionMetricsDonut: Current agencyId:', this.agencyId);
      this.loadDistributionMetrics();
    }
  }

  private loadDistributionMetrics(): void {
    this.loading = true;
    this.error = null;

    const filters: any = {
      agency_id: this.agencyId
    };

    console.log('📊 DistributionMetricsDonut: Loading distribution metrics with filters:', filters);

    this.analyticsService.getDistributionMetrics(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (metrics) => {
          console.log('📊 DistributionMetricsDonut: Received metrics:', metrics);
          this.distributionMetrics = metrics;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          console.error('📊 DistributionMetricsDonut: Error loading distribution metrics:', error);
          this.error = 'Error al cargar métricas de distribución';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.distributionMetrics = null;
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (!this.distributionMetrics) {
      this.series = [];
      this.labels = [];
      this.options = {
        ...this.options,
        labels: []
      };
      this.totalCases = 0;
      return;
    }

    // Preparar datos para el chart
    this.labels = ['Entregados', 'Cancelados', 'En Proceso'];
    this.series = [
      this.distributionMetrics.entregados.total,
      this.distributionMetrics.canceladas.total,
      this.distributionMetrics.proceso.total
    ];
    this.totalCases = this.distributionMetrics.total;

    this.options = {
      ...this.options,
      labels: this.labels
    };
  }

  refresh(): void {
    this.loadDistributionMetrics();
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
