import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AnalyticsService } from '../../../../../core/services/analytics.service';
import { ApexOptions, VexChartComponent } from '@vex/components/vex-chart/vex-chart.component';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule,
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
      height: 280, // Reducido de 350 para ocupar menos espacio
      sparkline: {
        enabled: false
      }
    },
    colors: ['#3b82f6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5, // Reducido de 6
      colors: ['#3b82f6'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 7 // Reducido de 8
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return Math.round(val).toString(); // Quitar decimales
      },
      style: {
        fontSize: '10px', // Reducido de 12px
        fontWeight: 600,
        colors: ['#3b82f6']
      }
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: false,
      y: {
        formatter: function (val: number) {
          return Math.round(val).toString(); // Quitar decimales
        }
      }
    },
    xaxis: {
      categories: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      labels: {
        style: {
          fontSize: '11px', // Reducido de 12px
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '11px', // Reducido de 12px
          fontWeight: 500
        },
        formatter: function (val: number) {
          return Math.round(val).toString(); // Quitar decimales del eje Y
        }
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 3, // Reducido de 4
      padding: {
        left: 16,
        top: 8,    // Reducido para ocupar menos espacio
        right: 8,  // Reducido para ocupar menos espacio
        bottom: 8  // Reducido para ocupar menos espacio
      }
    }
  };

  loading = false;
  error: string | null = null;
  totalCases = 0;

  constructor(private analyticsService: AnalyticsService) {}

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
          console.log('Datos semanales recibidos:', data);
          
          if (data && Array.isArray(data)) {
            this.weeklyData = data;
            this.updateChart();
          } else {
            console.warn('Datos no válidos recibidos:', data);
            this.weeklyData = [];
            this.updateChart();
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading weekly data:', error);
          this.error = 'Error al cargar los datos semanales';
          this.weeklyData = [];
          this.updateChart();
          this.loading = false;
        }
      });
  }

  private updateChart(): void {
    console.log('updateChart() llamado');
    console.log('weeklyData:', this.weeklyData);
    
    if (!this.weeklyData || !Array.isArray(this.weeklyData) || this.weeklyData.length === 0) {
      console.log('Datos vacíos o inválidos, inicializando gráfico vacío');
      this.series = [];
      this.totalCases = 0;
      return;
    }

    try {
      console.log('Procesando datos del gráfico...');
      
      // Crear array de datos para cada día de la semana
      const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      const chartData = daysOfWeek.map(day => {
        const dayData = this.weeklyData.find(item => item.dayName === day);
        return dayData ? dayData.count : 0;
      });

      console.log('Datos del gráfico:', chartData);

      this.totalCases = this.weeklyData.reduce((total, day) => total + day.count, 0);
      console.log('Total casos:', this.totalCases);

      this.series = [
        {
          name: 'Expedientes',
          data: chartData
        }
      ];
      console.log('Series configuradas:', this.series);
      
    } catch (error) {
      console.error('Error updating chart:', error);
      this.series = [];
      this.totalCases = 0;
    }
  }

  get totalAdvisors(): number {
    return this.weeklyData.length;
  }
}
