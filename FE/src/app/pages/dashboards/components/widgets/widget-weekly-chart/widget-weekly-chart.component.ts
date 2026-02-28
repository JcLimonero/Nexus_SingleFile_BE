import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { ApexOptions, VexChartComponent } from '@vex/components/vex-chart/vex-chart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface WeeklyData {
  day: string;
  dayName: string;
  count: number;
}

@Component({
  selector: 'vex-widget-weekly-chart',
  templateUrl: './widget-weekly-chart.component.html',
  styleUrls: ['./widget-weekly-chart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    VexChartComponent,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class WidgetWeeklyChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  private destroy$ = new Subject<void>();

  weeklyData: WeeklyData[] = [];
  series: any[] = [];
  options: ApexOptions = {
    chart: {
      type: 'line',
      height: 280,
      sparkline: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#60A5FA'],
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    markers: {
      size: 4,
      colors: ['#60A5FA'],
      strokeColors: '#FFFFFF',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val).toString();
      },
      style: {
        fontSize: '10px',
        fontWeight: 600,
        colors: ['#77797B']
      },
      offsetY: -8,
      background: {
        enabled: false
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const day = w.globals.categoryLabels[dataPointIndex] || w.config.xaxis.categories[dataPointIndex] || '';
        const val = Math.round(series[seriesIndex][dataPointIndex] || 0);
        return `<div style="background:#FFFFFF;border:1px solid #EFF0F0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);padding:10px 14px;min-width:120px;">
          <div style="font-weight:600;color:#2B2B2B;font-size:13px;margin-bottom:6px;border-bottom:1px solid #F0F0F0;padding-bottom:6px;">${day}</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="width:8px;height:8px;border-radius:50%;background:#60A5FA;flex-shrink:0;"></span>
            <span style="color:#77797B;font-size:12px;">Expedientes</span>
            <span style="margin-left:auto;font-weight:600;color:#2B2B2B;font-size:12px;">${val}</span>
          </div>
        </div>`;
      }
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: {
          colors: '#868C92',
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#868C92'],
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500
        },
        formatter: function (val: number) {
          return Math.round(val).toString();
        }
      }
    },
    grid: {
      borderColor: '#F0F0F0',
      strokeDashArray: 4,
      padding: {
        left: 16,
        top: 8,
        right: 12,
        bottom: 8
      }
    }
  };

  loading = false;
  error: string | null = null;
  totalCases = 0;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agencyId'] || changes['userId']) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.analyticsService.getWeeklyData(this.agencyId?.toString(), this.userId?.toString())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: WeeklyData[]) => {
          if (data && Array.isArray(data)) {
            this.weeklyData = data;
            this.updateChart();
          } else {
            this.weeklyData = [];
            this.updateChart();
          }
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error: any) => {
          this.error = 'Error al cargar los datos semanales';
          this.weeklyData = [];
          this.updateChart();
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private updateChart(): void {
    if (!this.weeklyData || !Array.isArray(this.weeklyData) || this.weeklyData.length === 0) {
      this.series = [];
      this.totalCases = 0;
      return;
    }

    try {
      const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const chartData = daysOfWeek.map(day => {
        const dayData = this.weeklyData.find(item => item.dayName === day);
        const v = dayData ? dayData.count : 0;
        return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
      });

      this.totalCases = this.weeklyData.reduce((total, day) => total + (Number(day.count) || 0), 0);

      this.series = [
        {
          name: 'Expedientes',
          data: chartData
        }
      ];
      
    } catch (error) {
      this.series = [];
      this.totalCases = 0;
    }
  }

  get totalAdvisors(): number {
    return this.weeklyData.length;
  }
}
