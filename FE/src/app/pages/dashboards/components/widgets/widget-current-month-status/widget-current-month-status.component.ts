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

export interface CurrentMonthStatusData {
  statusName: string;
  totalCases: number;
  percentage: number;
}

// Tipo para las series de ApexCharts
type ApexAxisChartSeries = any[];

@Component({
  selector: 'vex-widget-current-month-status',
  templateUrl: './widget-current-month-status.component.html',
  styleUrls: ['./widget-current-month-status.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VexChartComponent
  ]
})
export class WidgetCurrentMonthStatusComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  series: ApexAxisChartSeries = [];
  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'donut',
      height: 350,
      sparkline: {
        enabled: false
      }
    },
    colors: [
      '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
      '#14b8a6', '#0ea5e9', '#eab308', '#dc2626', '#a855f7'
    ],
    labels: [],
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
              color: '#374151'
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: '#111827',
              formatter: function (val: string) {
                return val;
              }
            },
            total: {
              show: true,
              showAlways: false,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6b7280',
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
  statusData: CurrentMonthStatusData[] = [];
  currentMonth: string = '';

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.setCurrentMonth();
    this.loadCurrentMonthStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('📊 CurrentMonthStatus ngOnChanges called with changes:', changes);
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
      console.log('📊 CurrentMonthStatus: Agency or User changed, triggering data reload');
      console.log('📊 CurrentMonthStatus: Current agencyId:', this.agencyId);
      console.log('📊 CurrentMonthStatus: Current userId:', this.userId);
      this.loadCurrentMonthStatus();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setCurrentMonth(): void {
    const now = new Date();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    this.currentMonth = monthNames[now.getMonth()];
  }

  private loadCurrentMonthStatus(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      agency_id: this.agencyId,
      idSeller: this.userId,
      current_month: true
    };

    console.log('📊 CurrentMonthStatus: Loading current month status with filters:', filters);

    this.analyticsService.getCurrentMonthStatusDistribution(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('📊 CurrentMonthStatus: Received data:', data);
          this.statusData = data;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          console.error('📊 CurrentMonthStatus: Error loading current month status:', error);
          this.error = 'Error al cargar distribución del mes actual';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.statusData = [];
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (this.statusData.length === 0) {
      this.series = [];
      this.options = {
        ...this.options,
        labels: []
      };
      return;
    }

    const seriesData = this.statusData.map(item => item.totalCases);
    const labels = this.statusData.map(item => item.statusName);

    this.series = seriesData;
    this.options = {
      ...this.options,
      labels: labels
    };
  }

  refresh(): void {
    this.loadCurrentMonthStatus();
  }

  getTotalCases(): number {
    return this.statusData.reduce((total, item) => total + item.totalCases, 0);
  }
}
