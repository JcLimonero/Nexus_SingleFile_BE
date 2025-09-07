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

export interface PreviousMonthsData {
  month: string;
  year: number;
  totalCases: number;
  deliveredCases: number;
  inProcessCases: number;
  cancelledCases: number;
}

// Tipo para las series de ApexCharts
type ApexAxisChartSeries = any[];

@Component({
  selector: 'vex-widget-previous-months',
  templateUrl: './widget-previous-months.component.html',
  styleUrls: ['./widget-previous-months.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VexChartComponent
  ]
})
export class WidgetPreviousMonthsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;
  @Input() monthsToShow = 6; // Mostrar últimos 6 meses por defecto

  series: ApexAxisChartSeries = [];
  options: ApexOptions = defaultChartOptions({
    chart: {
      type: 'bar',
      height: 350,
      sparkline: {
        enabled: false
      },
      stacked: false
    },
    colors: [
      '#10b981', // Verde para entregados
      '#3b82f6', // Azul para en proceso
      '#ef4444', // Rojo para cancelados
      '#f59e0b'  // Amarillo para total
    ],
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Expedientes'
      },
      labels: {
        formatter: function (val: number) {
          return Math.round(val).toString();
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val: number, opts: any) {
          const seriesName = opts.w.config.series[opts.seriesIndex].name;
          return `${seriesName}: ${val} expedientes`;
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4
    }
  });

  loading = true;
  error: string | null = null;
  previousMonthsData: PreviousMonthsData[] = [];
  currentMonth: string = '';

  private destroy$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.setCurrentMonth();
    this.loadPreviousMonthsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('📊 PreviousMonths ngOnChanges called with changes:', changes);
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange) ||
        (changes['monthsToShow'] && !changes['monthsToShow'].firstChange)) {
      console.log('📊 PreviousMonths: Agency, User or monthsToShow changed, triggering data reload');
      console.log('📊 PreviousMonths: Current agencyId:', this.agencyId);
      console.log('📊 PreviousMonths: Current userId:', this.userId);
      console.log('📊 PreviousMonths: Months to show:', this.monthsToShow);
      this.loadPreviousMonthsData();
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

  private loadPreviousMonthsData(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      agency_id: this.agencyId,
      idSeller: this.userId,
      months_to_show: this.monthsToShow
    };

    console.log('📊 PreviousMonths: Loading previous months data with filters:', filters);

    this.analyticsService.getPreviousMonthsData(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('📊 PreviousMonths: Received data:', data);
          this.previousMonthsData = data;
          this.updateChart();
          this.loading = false;
        },
        error: (error) => {
          console.error('📊 PreviousMonths: Error loading previous months data:', error);
          this.error = 'Error al cargar datos de meses anteriores';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.previousMonthsData = [];
          this.updateChart();
        }
      });
  }

  private updateChart(): void {
    if (this.previousMonthsData.length === 0) {
      this.series = [];
      this.options = {
        ...this.options,
        xaxis: {
          ...this.options.xaxis,
          categories: []
        }
      };
      return;
    }

    // Preparar datos para el chart
    const categories = this.previousMonthsData.map(item => `${item.month} ${item.year}`);
    const deliveredData = this.previousMonthsData.map(item => item.deliveredCases);
    const inProcessData = this.previousMonthsData.map(item => item.inProcessCases);
    const cancelledData = this.previousMonthsData.map(item => item.cancelledCases);
    const totalData = this.previousMonthsData.map(item => item.totalCases);

    this.series = [
      {
        name: 'Entregados',
        data: deliveredData
      },
      {
        name: 'En Proceso',
        data: inProcessData
      },
      {
        name: 'Cancelados',
        data: cancelledData
      },
      {
        name: 'Total',
        data: totalData,
        type: 'line' // Mostrar total como línea
      }
    ];

    this.options = {
      ...this.options,
      xaxis: {
        ...this.options.xaxis,
        categories: categories
      }
    };
  }

  refresh(): void {
    this.loadPreviousMonthsData();
  }

  getTotalCases(): number {
    return this.previousMonthsData.reduce((total, item) => total + item.totalCases, 0);
  }

  getAverageCases(): number {
    if (this.previousMonthsData.length === 0) return 0;
    return Math.round(this.getTotalCases() / this.previousMonthsData.length);
  }
}
