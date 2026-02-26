import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import {
  ApexOptions,
  VexChartComponent
} from '@vex/components/vex-chart/vex-chart.component';
import { defaultChartOptions } from '@vex/utils/default-chart-options';

export interface TrendData {
  month: string;
  entregados: number;
  canceladas: number;
  proceso: number;
}

// Tipo para las series de ApexCharts
type ApexAxisChartSeries = any[];

@Component({
  selector: 'vex-widget-trend-chart',
  templateUrl: './widget-trend-chart.component.html',
  styleUrls: ['./widget-trend-chart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    VexChartComponent
  ]
})
export class WidgetTrendChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() agencyId: number | null = null;
  @Input() userId: number | null = null;
  @Input() showDetails = true;

  // Filtro de año
  yearControl = new FormControl(new Date().getFullYear());
  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();

  series: ApexAxisChartSeries = [];
  options: ApexOptions = defaultChartOptions({
    grid: {
      show: true,
      borderColor: '#F0F0F0',
      strokeDashArray: 4,
      padding: {
        left: 16,
        top: 8,
        right: 12,
        bottom: 8
      }
    },
    chart: {
      type: 'line',
      height: 280,
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    colors: ['#34D399', '#F87171', '#60A5FA'],
    labels: this.getMonthLabels(),
    xaxis: {
      type: 'category',
      labels: {
        show: true,
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
        show: true,
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
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      labels: {
        colors: '#77797B'
      },
      markers: {
        width: 8,
        height: 8,
        radius: 4,
        strokeWidth: 0
      },
      itemMargin: {
        horizontal: 12,
        vertical: 0
      },
      offsetY: -4
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif'
      },
      fillSeriesColor: false,
      theme: 'light',
      shared: true,
      intersect: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const month = w.globals.labels[dataPointIndex] || w.globals.categoryLabels[dataPointIndex] || '';
        let rows = '';
        for (let i = 0; i < w.config.series.length; i++) {
          const name = w.config.series[i].name;
          const color = w.config.colors[i];
          const val = Math.round(series[i][dataPointIndex] || 0);
          rows += `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">
            <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;"></span>
            <span style="color:#77797B;font-size:12px;">${name}</span>
            <span style="margin-left:auto;font-weight:600;color:#2B2B2B;font-size:12px;">${val}</span>
          </div>`;
        }
        return `<div style="background:#FFFFFF;border:1px solid #EFF0F0;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.08);padding:10px 14px;min-width:160px;">
          <div style="font-weight:600;color:#2B2B2B;font-size:13px;margin-bottom:6px;border-bottom:1px solid #F0F0F0;padding-bottom:6px;">${month}</div>
          ${rows}
        </div>`;
      }
    }
  });

  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private filtersChange$ = new Subject<void>();

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeYears();
    this.setupYearFilter();
    this.setupFiltersDebounce();
    
    // Siempre cargar datos iniciales (incluso si agencyId es null para "todas las agencias")
    this.loadTrendData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['agencyId'] && !changes['agencyId'].firstChange) || 
        (changes['userId'] && !changes['userId'].firstChange)) {
      this.filtersChange$.next();
    }
  }

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    // Generar años disponibles desde 2020 hasta el año actual (sin años futuros)
    for (let year = 2020; year <= currentYear; year++) {
      this.availableYears.push(year);
    }
    this.selectedYear = currentYear;
  }

  private setupFiltersDebounce(): void {
    this.filtersChange$
      .pipe(
        debounceTime(300), // Esperar 300ms después del último cambio
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadTrendData();
      });
  }

  private setupYearFilter(): void {
    this.yearControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(year => {
        if (year) {
          this.selectedYear = year;
          this.filtersChange$.next();
        }
      });
  }

  private loadTrendData(): void {
    this.loading = true;
    this.error = null;

    // Consultar datos reales del backend para el año seleccionado
    this.loadRealTrendData();
  }

  private loadRealTrendData(): void {
    const filters = {
      year: this.selectedYear,
      agency_id: this.agencyId,
      idSeller: this.userId
    };

    this.analyticsService.getTrendData(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const toNum = (arr: unknown) => (Array.isArray(arr) ? arr : []).map((v) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0));
          this.series = [
            { name: 'Entregados', data: toNum(data.entregados || []) },
            { name: 'Canceladas', data: toNum(data.canceladas || []) },
            { name: 'Proceso', data: toNum(data.proceso || []) }
          ];
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al cargar los datos de tendencia';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.series = [
            { name: 'Entregados', data: Array(12).fill(0) },
            { name: 'Canceladas', data: Array(12).fill(0) },
            { name: 'Proceso', data: Array(12).fill(0) }
          ];
          this.cdr.markForCheck();
        }
      });
  }

  private generateTrendData(): void {
    // Generar datos para enero a diciembre del año seleccionado
    const entregadosData: number[] = [];
    const canceladasData: number[] = [];
    const procesoData: number[] = [];

    // Datos simulados basados en el año seleccionado
    const monthlyData = this.getMonthlyDataForYear(this.selectedYear);

    monthlyData.forEach(month => {
      entregadosData.push(month.entregados);
      canceladasData.push(month.canceladas);
      procesoData.push(month.proceso);
    });

    this.series = [
      {
        name: 'Entregados',
        data: entregadosData
      },
      {
        name: 'Canceladas',
        data: canceladasData
      },
      {
        name: 'Proceso',
        data: procesoData
      }
    ];
  }

  private getMonthlyDataForYear(year: number): any[] {
    // Datos simulados diferentes según el año
    if (year === 2024) {
      return [
        { entregados: 0, canceladas: 0, proceso: 0 },     // Enero
        { entregados: 0, canceladas: 0, proceso: 0 },     // Febrero
        { entregados: 0, canceladas: 0, proceso: 0 },     // Marzo
        { entregados: 0, canceladas: 0, proceso: 0 },     // Abril
        { entregados: 0, canceladas: 0, proceso: 0 },     // Mayo
        { entregados: 0, canceladas: 0, proceso: 0 },     // Junio
        { entregados: 0, canceladas: 0, proceso: 0 },     // Julio
        { entregados: 0, canceladas: 0, proceso: 0 },     // Agosto
        { entregados: 0, canceladas: 0, proceso: 0 },     // Septiembre
        { entregados: 0, canceladas: 0, proceso: 0 },     // Octubre
        { entregados: 0, canceladas: 0, proceso: 0 },     // Noviembre
        { entregados: 425, canceladas: 7, proceso: 41 }  // Diciembre
      ];
    } else if (year === 2025) {
      return [
        { entregados: 81, canceladas: 0, proceso: 6 },   // Enero
        { entregados: 0, canceladas: 0, proceso: 0 },     // Febrero
        { entregados: 0, canceladas: 0, proceso: 0 },     // Marzo
        { entregados: 0, canceladas: 0, proceso: 0 },     // Abril
        { entregados: 55, canceladas: 0, proceso: 5 },   // Mayo
        { entregados: 0, canceladas: 0, proceso: 0 },     // Junio
        { entregados: 25, canceladas: 0, proceso: 4 },   // Julio
        { entregados: 63, canceladas: 0, proceso: 8 },   // Agosto
        { entregados: 0, canceladas: 0, proceso: 0 },    // Septiembre
        { entregados: 0, canceladas: 0, proceso: 0 },    // Octubre
        { entregados: 0, canceladas: 0, proceso: 0 },     // Noviembre
        { entregados: 0, canceladas: 0, proceso: 0 }     // Diciembre
      ];
    } else {
      // Para otros años, generar datos aleatorios más bajos
      return Array.from({ length: 12 }, () => ({
        entregados: Math.floor(Math.random() * 20),
        canceladas: Math.floor(Math.random() * 5),
        proceso: Math.floor(Math.random() * 10)
      }));
    }
  }

  private getMonthLabels(): string[] {
    return [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
  }

  refresh(): void {
    this.loadTrendData();
  }
}
