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
      type: 'area',
      height: 200,
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      }
    },
    colors: [
      '#10b981', // Verde para entregados
      '#ef4444', // Rojo para cancelados
      '#3b82f6'  // Azul para en proceso
    ],
    plotOptions: {
      area: {
        fillTo: 'end'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toString();
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#ffffff']
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: ['Entregados', 'Cancelados', 'En Proceso'],
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: ['#6b7280']
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: ['#374151']
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 3
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `${val} expedientes`;
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      labels: {
        colors: ['#374151']
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 150
          },
          legend: {
            fontSize: '10px'
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

    // Preparar datos para el chart de barras
    this.labels = ['Entregados', 'Cancelados', 'En Proceso'];
    this.series = [
      this.distributionMetrics.entregados.total,
      this.distributionMetrics.canceladas.total,
      this.distributionMetrics.proceso.total
    ];
    this.totalCases = this.distributionMetrics.total;

    // Actualizar las opciones del gráfico
    this.options = {
      ...this.options,
      xaxis: {
        ...this.options.xaxis,
        categories: this.labels
      }
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
