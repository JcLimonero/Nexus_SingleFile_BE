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

export interface ProcessDistributionData {
  processName: string;
  totalCases: number;
  percentage: number;
}

// Tipo para las series de ApexCharts
type ApexAxisChartSeries = any[];

@Component({
  selector: 'vex-widget-process-distribution',
  templateUrl: './widget-process-distribution.component.html',
  styleUrls: ['./widget-process-distribution.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VexChartComponent
  ]
})
export class WidgetProcessDistributionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  series: ApexAxisChartSeries = [];
  readonly chartColors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'donut',
      height: 220,
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    colors: [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ],
    labels: [],
    legend: {
      show: false
    },
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
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toString();
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
    }
  });

  loading = true;
  error: string | null = null;
  processData: ProcessDistributionData[] = [];

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadProcessDistribution();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
      this.loadProcessDistribution();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProcessDistribution(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      agency_id: this.agencyId,
      idSeller: this.userId
    };

    this.analyticsService.getProcessDistribution(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.processData = data;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar distribución por proceso';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.processData = [];
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (this.processData.length === 0) {
      this.series = [];
      this.options = {
        ...this.options,
        labels: []
      };
      return;
    }

    const seriesData = this.processData.map(item => item.totalCases);
    const labels = this.processData.map(item => item.processName);

    this.series = seriesData;
    this.options = {
      ...this.options,
      labels: labels
    };
  }

  refresh(): void {
    this.loadProcessDistribution();
  }

  getTotalCases(): number {
    return this.processData.reduce((total, item) => total + item.totalCases, 0);
  }

  getProcessColor(index: number): string {
    return this.chartColors[index % this.chartColors.length] || '#6b7280';
  }
}
