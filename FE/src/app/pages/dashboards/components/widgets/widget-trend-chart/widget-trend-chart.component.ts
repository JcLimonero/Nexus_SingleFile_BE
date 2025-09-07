import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
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
      strokeDashArray: 3,
      padding: {
        left: 16
      }
    },
    chart: {
      type: 'line',
      height: 269, // Reducido de 384 a 269 (30% menos)
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#10b981', '#ef4444', '#3b82f6'],
    labels: this.getMonthLabels(),
    xaxis: {
      type: 'category',
      labels: {
        show: true,
        style: {
          cssClass: 'text-secondary fill-current caption font-medium',
          fontFamily: 'inherit'
        }
      }
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          cssClass: 'text-secondary fill-current caption font-medium',
          fontFamily: 'inherit'
        }
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      itemMargin: {
        horizontal: 4,
        vertical: 4
      }
    }
  });

  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private filtersChange$ = new Subject<void>();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.initializeYears();
    this.setupYearFilter();
    this.setupFiltersDebounce();
    
    // Cargar datos iniciales si hay filtros
    if (this.agencyId !== null || this.userId !== null) {
      this.loadTrendData();
    }
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
        distinctUntilChanged(),
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
          this.series = [
            {
              name: 'Entregados',
              data: data.entregados || []
            },
            {
              name: 'Canceladas',
              data: data.canceladas || []
            },
            {
              name: 'Proceso',
              data: data.proceso || []
            }
          ];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading trend data:', error);
          this.error = 'Error al cargar los datos de tendencia';
          this.loading = false;
          
          // Fallback a datos vacíos si hay error
          this.series = [
            { name: 'Entregados', data: Array(12).fill(0) },
            { name: 'Canceladas', data: Array(12).fill(0) },
            { name: 'Proceso', data: Array(12).fill(0) }
          ];
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
