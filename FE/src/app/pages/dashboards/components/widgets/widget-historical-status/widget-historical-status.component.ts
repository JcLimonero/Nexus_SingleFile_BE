import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
      height: 260,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    legend: {
      show: false
    },
    colors: [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ],
    fill: {
      type: 'solid',
      opacity: 0.9
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 6,
        columnWidth: '60%',
        distributed: true
      }
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1
        }
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.15
        }
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -4,
      formatter: function (val: number, opts: any) {
        const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
        const percentage = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
        return `${percentage}%`;
      },
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#2B2B2B']
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '13px',
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
      type: 'category',
      categories: [],
      labels: {
        show: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '11px',
          fontWeight: 500,
          colors: '#868C92'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    grid: {
      show: true,
      borderColor: '#EFF0F0',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 0, right: 0 }
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

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHistoricalStatusData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
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

    this.analyticsService.getHistoricalStatusDistribution(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.historicalStatusData = data;
          this.updateChart();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al cargar datos históricos por estatus';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.historicalStatusData = [];
          this.updateChart();
          this.cdr.markForCheck();
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

    // Preparar datos para el chart de barras verticales
    this.labels = this.historicalStatusData.map(item => item.statusName);
    const data = this.historicalStatusData.map(item => item.totalCases);
    this.totalCases = data.reduce((total, cases) => total + cases, 0);

    // Colores para cada barra (distributed: true)
    const barColors = this.labels.map(label => this.getStatusColor(label));
    this.options = {
      ...this.options,
      colors: barColors,
      xaxis: {
        ...this.options.xaxis,
        categories: this.labels
      }
    };

    this.series = [{
      name: 'Expedientes',
      data: data
    }];
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
