import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
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
    VexChartComponent
  ]
})
export class WidgetTrendChartComponent implements OnInit, OnDestroy {
  @Input() agencyId: number | null = null;
  @Input() showDetails = true;

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

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadTrendData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTrendData(): void {
    this.loading = true;
    this.error = null;

    // Generar datos de tendencia para el año actual (enero a diciembre)
    this.generateTrendData();
    this.loading = false;
  }

  private generateTrendData(): void {
    const currentYear = new Date().getFullYear();
    
    // Generar datos para enero a diciembre del año actual
    const entregadosData: number[] = [];
    const canceladasData: number[] = [];
    const procesoData: number[] = [];

    // Datos simulados basados en el patrón del gráfico para el año actual
    const monthlyData = [
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
